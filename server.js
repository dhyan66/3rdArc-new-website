import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log API key presence (don't reveal in production logs)
console.log('RESEND_API_KEY present?', !!process.env.RESEND_API_KEY);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Send email to 3rd Arc Productions
    console.log('sending email to 3rdarcproductions@gmail.com');
    const emailResponse = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: '3rdarcproductions@gmail.com',
      replyTo: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; color: #555;">${escapeHtml(data.message)}</p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Reply to this email to contact the sender directly at ${escapeHtml(data.email)}
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend error object:', emailResponse);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Also send a confirmation email to the user
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: data.email,
      subject: 'We received your message - 3rd Arc Productions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out!</h2>

          <p style="color: #555; line-height: 1.6;">
            Hi ${escapeHtml(data.name)},
          </p>

          <p style="color: #555; line-height: 1.6;">
            We've received your message and appreciate your interest in 3rd Arc Productions.
            We'll get back to you as soon as possible.
          </p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              <strong>Your message:</strong>
            </p>
            <p style="white-space: pre-wrap; color: #555; margin-top: 10px;">${escapeHtml(data.message)}</p>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Best regards,<br>
            3rd Arc Productions Team
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Local API server running at http://localhost:${port}`);
  console.log(`📧 Contact form endpoint: http://localhost:${port}/api/contact`);
});