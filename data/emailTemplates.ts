import type { EmailTemplate } from '../types';

export const emailTemplates: EmailTemplate[] = [
  {
    name: 'Interview Request',
    subject: `Interview Request for the {{job_title}} Position`,
    body: `
Dear {{name}}<br><br>

Thank you for your interest in the {{job_title}} position at our company. We were impressed with your background and would like to invite you for an interview to discuss your qualifications and the role further.<br><br>

Please let us know what time works best for you in the coming week.<br><br>

Best regards,<br>
The Hiring Team`,
  },
  {
    name: 'Acceptance',
    subject: `Offer of Employment: {{job_title}}`,
    body: `
Dear {{name}}<br><br>

Congratulations! We are delighted to offer you the position of {{job_title}} at our company. We believe your skills and experience will be a valuable asset to our team.<br><br>

We will send over the official offer letter shortly. We look forward to you joining us.<br><br>

Sincerely,<br>
The Hiring Team`,
  },
  {
    name: 'Rejection',
    subject: `Update on your application for the {{job_title}} position`,
    body: `
Dear {{name}}<br><br>

Thank you for taking the time to apply for the {{job_title}} position. We received a large number of applications, and after careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.<br><br>

We appreciate your interest and wish you the best of luck in your job search.<br><br>

Regards,<br>
The Hiring Team`,
  },
];
