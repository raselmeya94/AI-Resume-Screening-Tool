
# AI Resume Screening Tool

## Overview

The **AI Resume Screening Tool** is a powerful web-based platform designed to automate and optimize the process of screening resumes for recruitment. Using advanced AI models, including **Gemini 2.5 Flash**, the tool extracts relevant information from uploaded resumes, scores candidates based on their fit for a role, and helps recruiters and hiring managers streamline their candidate evaluation process.

## Features

* **Upload & Extract**: Upload resumes in various formats (TXT, PDF, DOCX) for automated extraction of key details like contact information, skills, and experience.
* **Screening Dashboard**: View uploaded resumes, evaluate candidates, and filter based on key skills, experience, and role fit.
* **Candidate Dashboard**: Access detailed insights on each candidate, including extraction results and overall fit scores.
* **AI-powered Resume Evaluation**: Automatically evaluate candidates based on job requirements using AI-powered models.
* **Job Role Matching**: Enter expected job roles and key requirements to filter and rank candidates according to how well they meet those requirements.
* **Outbox**: Send emails to candidates directly from the platform, and track all sent communications.

## Technologies Used

* **AI Model**: Gemini 2.5 Flash (LLM Selection) for resume extraction and evaluation.
* **OCR Technology**: AI OCR for scanning and extracting text from image-based PDFs and other formats.
* **Backend**: Custom API integration for processing resumes and sending data to the AI model.
* **Frontend**: User-friendly web interface for uploading resumes, viewing candidates, and managing the evaluation process.

## Installation

### Prerequisites

* **Node.js** (for backend development)
* **React** (for frontend)
* **Python** (for running AI and OCR models)
* **API Key** for Gemini 2.5 Flash AI Model (obtain from the provider)
* **Database** (PostgreSQL or MySQL recommended)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ai-resume-screening-tool.git
   cd ai-resume-screening-tool
   ```

2. **Install Dependencies**

   * For backend (Node.js):

     ```bash
     cd backend
     npm install
     ```

   * For frontend (React):

     ```bash
     cd frontend
     npm install
     ```

3. **Configure API Keys**

   * Obtain your **Gemini 2.5 Flash** API key.
   * Update the backend configuration to include your API key.

4. **Run the Application**

   * Start the backend server:

     ```bash
     cd backend
     npm start
     ```

   * Start the frontend server:

     ```bash
     cd frontend
     npm start
     ```

5. **Open in Browser**

   Visit `http://localhost:3000` to start using the AI Resume Screening Tool.

## Features in Detail

### Upload & Extract

* **Supported File Formats**: TXT, PDF, DOCX.
* **Extraction Process**: The tool uses AI OCR to extract text from the uploaded resumes, including tables, contact blocks, and structured content like work experience, skills, and education.
* **Preview**: A preview of the extracted content is displayed to ensure accuracy before running the full extraction process.

### Screening Dashboard

* **Candidate Overview**: View all uploaded resumes with relevant details, including extracted skills, experience, and contact info.
* **Filter Candidates**: Apply filters like experience (in years), specific skills (e.g., React, Node.js), and fit score.
* **Fit Score**: AI-generated score based on how well the candidate matches the provided job requirements and role expectations.

### Candidate Dashboard

* **Candidate Details**: View all extracted data for each candidate, including name, contact information, skills, and past work experience.
* **Evaluation**: Evaluate candidates based on job role requirements and a detailed fit score.
* **Actions**: Send emails to candidates directly from the dashboard.

### Outbox

* **Email Communication**: Track and manage all emails sent to candidates.
* **Search & Filter**: Search sent emails by candidate name, email, or subject.

## Configuration Options

### Text Extractor Configs

* **AI OCR Mode**: Configure OCR mode selection for better extraction results.
* **OCR Options**:

  * **Detect Tables**: Option to detect and extract tables from resumes.
  * **Extract Contact Blocks**: Option to extract contact details like name, email, phone number.

### Screening Configs

* **LLM Selection**: Choose the AI model (Gemini 2.5 Flash) for evaluating candidates.
* **Expected Job Roles**: Enter comma-separated roles (e.g., Senior Engineer, Product Manager).
* **Job Requirements**: Specify key requirements (skills, experience, etc.) for the job role.

## Future Improvements

* **Integration with Job Boards**: Automatically pull resumes from job boards like LinkedIn, Indeed, or Glassdoor.
* **Enhanced Resume Parsing**: Improve extraction accuracy with machine learning training on more diverse resume formats.
* **Job Matching Recommendations**: Use AI to suggest ideal candidates for a job based on resume analysis.

## Contributing

We welcome contributions! If you'd like to contribute to the development of this project, please fork the repository and submit a pull request.

1. Fork the repository
2. Clone your forked repo
3. Create a new branch
4. Make your changes
5. Push your changes to your fork
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

