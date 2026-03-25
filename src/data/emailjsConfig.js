// ============================================================
// EmailJS Configuration
// ============================================================
// To activate automatic email delivery:
//
// 1. Go to https://www.emailjs.com and create a FREE account
// 2. Add a new Email Service → connect your Gmail account
//    (name it anything, e.g. "marketing_ethics")
// 3. Create a new Email Template with these template variables:
//      {{to_email}}       — recipient (instructor email)
//      {{from_name}}      — student name
//      {{course}}         — course name
//      {{subject}}        — email subject line
//      {{message}}        — full assessment body
//    Set "To Email" = {{to_email}} in the template settings
// 4. Copy your Service ID, Template ID, and Public Key here:
// ============================================================

export const EMAILJS_CONFIG = {
  SERVICE_ID:  'YOUR_SERVICE_ID',    // e.g. 'service_abc123'
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',   // e.g. 'template_xyz789'
  PUBLIC_KEY:  'YOUR_PUBLIC_KEY',    // e.g. 'AbCdEfGhIjKlMnOp'
  TO_EMAIL:    'marcinoregon@gmail.com',
};

// ============================================================
// EmailJS Free Tier: 200 emails/month, no credit card needed
// Docs: https://www.emailjs.com/docs/sdk/installation/
// ============================================================
