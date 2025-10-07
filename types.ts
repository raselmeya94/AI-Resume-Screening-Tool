export enum Page {
  UPLOAD,
  DASHBOARD,
  OUTBOX,
}

export interface Candidate {
  id: string;
  fileName: string;
  name: string;
  contact: string;
  email: string;
  education: string;
  experience: string;
  skills: string[];
  experienceYears: number;
  rawText: string;
  evaluation?: EvaluationResult;
  emailSent?: boolean;
}

export interface ExtractedInfo {
  candidate_name: string;
  contact_number: string;
  email_address: string;
  education_summary: string;
  experience_summary: string;
  skills: string[];
  years_of_experience: number;
}

export interface EvaluationResult {
  skills_score: number;
  experience_score: number;
  education_score: number;
  keywords_score: number;
  final_fit_score: number;
  explanation: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

export interface SentEmail {
  id: string;
  candidate: {
    id:string;
    name: string;
    email: string;
  };
  subject: string;
  body: string;
  sentAt: Date;
}