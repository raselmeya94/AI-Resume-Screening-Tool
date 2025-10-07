
import { GoogleGenAI, Type } from '@google/genai';
import type { EvaluationResult, ExtractedInfo } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractionSchema = {
  type: Type.OBJECT,
  properties: {
    candidate_name: { type: Type.STRING },
    contact_number: { type: Type.STRING },
    email_address: { type: Type.STRING },
    education_summary: { type: Type.STRING },
    experience_summary: { type: Type.STRING },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    years_of_experience: {
        type: Type.NUMBER,
        description: "The total years of professional work experience mentioned in the resume."
    }
  },
  required: ['candidate_name', 'email_address', 'experience_summary', 'skills', 'years_of_experience'],
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        skills_score: { type: Type.NUMBER, description: "Score from 0 to 100 for skills match." },
        experience_score: { type: Type.NUMBER, description: "Score from 0 to 100 for experience relevance." },
        education_score: { type: Type.NUMBER, description: "Score from 0 to 100 for education background." },
        keywords_score: { type: Type.NUMBER, description: "Score from 0 to 100 for keyword matching." },
        final_fit_score: { type: Type.NUMBER, description: "A final weighted fit score from 0 to 100." },
        explanation: { type: Type.STRING, description: "A brief explanation for the scores." },
    },
    required: ["skills_score", "experience_score", "education_score", "keywords_score", "final_fit_score", "explanation"]
};

export const extractInfoFromResume = async (resumeText: string): Promise<ExtractedInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert resume parser. Extract the following information from the provided resume text: candidate name, contact number, email address, a summary of their education, a summary of their work experience, a list of their skills, and the total years of professional experience as a number. Provide the output in a clean JSON format. Resume Text: """${resumeText}"""`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: extractionSchema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ExtractedInfo;
  } catch (error) {
    console.error('Error extracting resume info:', error);
    throw new Error('Failed to extract information from the resume.');
  }
};

export const evaluateCandidate = async (candidateText: string, jobRequirements: string, jobRoles: string): Promise<EvaluationResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert hiring manager hiring for the following role(s): "${jobRoles}". Evaluate the following candidate's resume against the provided job requirements. Score each category from 0 to 100 and provide a final fit score and a brief explanation. Respond only with a valid JSON object matching the specified schema.
            
            Job Requirements:
            ---
            ${jobRequirements}
            ---
            
            Candidate Resume Text:
            ---
            ${candidateText}
            ---
            `,
            config: {
                responseMimeType: 'application/json',
                responseSchema: evaluationSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EvaluationResult;
    } catch (error) {
        console.error('Error evaluating candidate:', error);
        throw new Error('Failed to evaluate the candidate.');
    }
}