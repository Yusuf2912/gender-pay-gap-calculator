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

// Replace with your actual API Gateway endpoint URL
const API_GATEWAY_URL = import.meta.env.VITE_API_URL || 
  'https://<api-id>.execute-api.us-east-1.amazonaws.com/Dev/salary-analysis';

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
