import { useState, useEffect } from "react";
import type { UserFormSubmission } from "./formState";
import { getSalaryPrediction } from "../services/aiFeedback";

type SalaryPredictionSectionProps = {
  submission: UserFormSubmission;
};

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const SalaryPredictionSection = ({ submission }: SalaryPredictionSectionProps) => {
  const [predictedSalary, setPredictedSalary] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        const prediction = await getSalaryPrediction(submission);
        setPredictedSalary(prediction);
      } catch (err) {
        console.error("Failed to fetch salary prediction:", err);
        setError("Unable to fetch salary prediction. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [submission]);

  const calculateDifference = (actual: number, predicted: number) => {
    return actual - predicted;
  };

  const calculatePercentDifference = (actual: number, predicted: number) => {
    if (predicted === 0) return 0;
    return ((actual - predicted) / predicted) * 100;
  };

  const formatPercent = (value: number): string => {
    const normalized = Number.isFinite(value) ? value : 0;
    const rounded = Number(normalized.toFixed(1));
    const safeRounded = Object.is(rounded, -0) ? 0 : rounded;
    const sign = safeRounded > 0 ? "+" : "";
    return `${sign}${safeRounded.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <section className="salary-prediction-section">
        <h3>AI Salary Prediction</h3>
        <div className="prediction-loading">
          <p>Analyzing your data with our AI model...</p>
        </div>
      </section>
    );
  }

  if (error || predictedSalary === null) {
    return (
      <section className="salary-prediction-section">
        <h3>AI Salary Prediction</h3>
        <div className="prediction-error">
          <p>{error || "Unable to generate prediction"}</p>
        </div>
      </section>
    );
  }

  const difference = calculateDifference(submission.salary, predictedSalary);
  const percentDifference = calculatePercentDifference(submission.salary, predictedSalary);
  const isOverpaid = difference > 0;
  const isUnderpaid = difference < 0;

  return (
    <section className="salary-prediction-section">
      <h3>AI Model Salary Prediction</h3>
      <p className="prediction-description">
        Based on your demographics and experience, our AI model predicts what you should be earning.
      </p>

      <div className="prediction-comparison">
        <div className="prediction-values">
          <div className="prediction-value-item">
            <span className="prediction-label">Your Current Salary</span>
            <span className="prediction-amount user-salary">
              {currencyFormatter.format(submission.salary)}
            </span>
          </div>

          <div className="prediction-arrow" aria-hidden="true">
            vs
          </div>

          <div className="prediction-value-item">
            <span className="prediction-label">AI Predicted Salary</span>
            <span className="prediction-amount predicted-salary">
              {currencyFormatter.format(predictedSalary)}
            </span>
          </div>
        </div>

        <div className="prediction-difference">
          <div
            className={`difference-badge ${
              isOverpaid ? "overpaid" : isUnderpaid ? "underpaid" : "fair"
            }`}
          >
            <span className="difference-amount">
              {difference > 0 ? "+" : ""}
              {currencyFormatter.format(difference)}
            </span>
            <span className="difference-percent">
              ({formatPercent(percentDifference)})
            </span>
          </div>

          <p className="difference-message">
            {isOverpaid && (
              <>
                You are earning <strong>{currencyFormatter.format(Math.abs(difference))}</strong> more 
                than the AI model predicts for your profile.
              </>
            )}
            {isUnderpaid && (
              <>
                You are earning <strong>{currencyFormatter.format(Math.abs(difference))}</strong> less 
                than the AI model predicts for your profile.
              </>
            )}
            {!isOverpaid && !isUnderpaid && (
              <>Your salary matches the AI prediction.</>
            )}
          </p>
        </div>

        <div className="prediction-visual">
          <div className="bar-container">
            <div className="bar-item">
              <div className="bar-label">Your Salary</div>
              <div className="bar-track">
                <div
                  className="bar-fill user-bar"
                  style={{
                    width: `${(submission.salary / Math.max(submission.salary, predictedSalary)) * 100}%`,
                  }}
                />
              </div>
              <div className="bar-value">{currencyFormatter.format(submission.salary)}</div>
            </div>

            <div className="bar-item">
              <div className="bar-label">AI Predicted</div>
              <div className="bar-track">
                <div
                  className="bar-fill predicted-bar"
                  style={{
                    width: `${(predictedSalary / Math.max(submission.salary, predictedSalary)) * 100}%`,
                  }}
                />
              </div>
              <div className="bar-value">{currencyFormatter.format(predictedSalary)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalaryPredictionSection;
