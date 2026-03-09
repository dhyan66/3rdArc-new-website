import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface CloudflareEnv {
  RESEND_API_KEY: string;
}

export const onRequest: PagesFunction<CloudflareEnv> = async (context) => {
  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Parse request body
    const data: ContactFormData = await context.request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(context.env.RESEND_API_KEY);

    // Send email to 3rd Arc Productions
    const emailResponse = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Resend requires this format initially
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
      console.error('Resend error:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
