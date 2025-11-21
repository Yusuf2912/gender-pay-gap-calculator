/**
 * AI Feedback service for communicating with AWS Lambda via API Gateway
 */

import type { UserFormSubmission } from "../components/formState";

export interface AIFeedbackResponse {
  analysis: string;
  payGapPercentage?: number;
  status: string;
  error?: string;
  factors?: string[];
  recommendations?: string[];
}

export interface SalaryPredictionResponse {
  statusCode: number;
  body: string; // JSON string containing predicted_salary
}

export interface PredictedSalary {
  predicted_salary: number;
}

// Replace with your actual API Gateway endpoint URL
const API_GATEWAY_URL = import.meta.env.VITE_API_URL || 
  'https://<api-id>.execute-api.us-east-1.amazonaws.com/Dev/salary-analysis';

// AWS API for salary prediction
// Use proxy in development to bypass CORS, direct URL in production
const SALARY_PREDICTION_API_URL = import.meta.env.DEV 
  ? '/api/salary-predict'
  : 'https://svo7xmgnz5.execute-api.us-east-1.amazonaws.com/get-salary-predict';
  

export async function getAIFeedback(
  data: UserFormSubmission
): Promise<AIFeedbackResponse> {
  try {
    // Map form data to API format
    const payload = {
      jobRole: data.jobRole,
      salary: data.salary,
      employmentType: data.employmentType,
      gender: data.gender,
      age: data.age,
      experience: data.experience,
      children: data.children,
      ethnicity: data.ethnicity,
    };

    const response = await fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('AI Feedback Error:', error);
    throw error;
  }
}

/**
 * Get salary prediction from AWS model
 */
export async function getSalaryPrediction(
  data: UserFormSubmission
): Promise<number> {
  try {
    // Map form data to API format expected by the model
    const payload = {
      Age: data.age,
      Gender: data.gender,
      "Education Level": data.education,
      "Years of Experience": data.experience,
      JobFamily: data.jobRole,
    };

    console.log('Fetching from URL:', SALARY_PREDICTION_API_URL);
    console.log('Payload:', payload);

    const response = await fetch(SALARY_PREDICTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Get the response text first to see what we're receiving
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}. Response: ${responseText}`);
    }

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
    }

    // Check if the response has the expected format
    if (result.body) {
      // Response format: { statusCode: 200, body: "{\"predicted_salary\": 123}" }
      const parsedBody: PredictedSalary = JSON.parse(result.body);
      return parsedBody.predicted_salary;
    } else if (result.predicted_salary !== undefined) {
      // Direct format: { predicted_salary: 123 }
      return result.predicted_salary;
    } else {
      throw new Error(`Unexpected response format: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error('Salary Prediction Error:', error);
    throw error;
  }
}
