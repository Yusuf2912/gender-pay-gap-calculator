import { useEffect, useState } from "react";
import type { UserFormSubmission } from "./formState";
import type { AIFeedbackResponse } from "../services/aiFeedback";
import { getAIFeedback } from "../services/aiFeedback";

type AIFeedbackSectionProps = {
  submission: UserFormSubmission;
};

const AIFeedbackSection = ({ submission }: AIFeedbackSectionProps) => {
  const [feedback, setFeedback] = useState<AIFeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      setFeedback(null);

      try {
        const result = await getAIFeedback(submission);
        setFeedback(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AI feedback';
        setError(errorMessage);
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [submission]);

  return (
    <section className="results-feedback">
      <h3>Your AI Feedback</h3>
      
      {loading && (
        <div className="feedback-loading">
          <div className="spinner"></div>
          <p>Analyzing your salary data...</p>
        </div>
      )}

      {error && (
        <div className="feedback-error">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {feedback && !loading && (
        <div className="feedback-content">
          <p className="feedback-analysis">{feedback.analysis}</p>
          
          {feedback.payGapPercentage !== undefined && (
            <div className="feedback-pay-gap">
              <p className="feedback-label">Pay Gap:</p>
              <p className={`feedback-value ${feedback.payGapPercentage > 0 ? 'positive' : 'negative'}`}>
                {feedback.payGapPercentage > 0 ? '+' : ''}
                {feedback.payGapPercentage.toFixed(1)}%
              </p>
            </div>
          )}

          {feedback.factors && feedback.factors.length > 0 && (
            <div className="feedback-factors">
              <p className="feedback-label">Key Factors:</p>
              <ul>
                {feedback.factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.recommendations && feedback.recommendations.length > 0 && (
            <div className="feedback-recommendations">
              <p className="feedback-label">Recommendations:</p>
              <ul>
                {feedback.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AIFeedbackSection;
