// src/types/index.ts

export interface Message {
  sender: "bot" | "user";
  content: string;
  loading?: boolean;
  idea?: boolean;
  finalPrompt?: boolean;
  allSet?: boolean;
  example?: string | null;
}

export interface Answer {
  topic: string;
  question: string;
  example: string;
  status: "unanswered" | "answered" | "skipped";
  answer: string | null;
}

export interface ProductInfo {
  productType?: string | null;
  color?: string | null;
}

export interface DataResponse {
  greeting?: string;
  question?: {
    topic: string;
    question: string;
    example: string;
  };
  topics?: string[];
  [key: string]: any;
}
