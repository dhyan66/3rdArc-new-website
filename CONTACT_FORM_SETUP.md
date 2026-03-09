# Contact Form Backend Setup Guide

## Overview

This implements a contact form backend using:

- **Cloudflare Pages Functions** for serverless API
- **Resend** for reliable email delivery
- Sends emails to: 3rdarcproductions@gmail.com
- Sends confirmation email to the user

## Setup Steps

### 1. Install Dependencies

Resend package is already installed. Verify with:

```bash
npm list resend
```

If not installed:

```bash
npm install resend
```

### 2. Get Resend API Key

1. Go to [Resend](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 3. Set Environment Variables in Cloudflare

**For Local Development:**

```bash
# Create a .env.local file (not committed to git)
RESEND_API_KEY=your_actual_api_key
```

**For Cloudflare Pages:**

1. Go to your Cloudflare Pages project dashboard
2. Settings → Environment variables
3. Add the following for each environment (Production, Preview, Development):
   - **Variable name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key

### 4. Update wrangler.toml

Replace `your-account-id` in `wrangler.toml` with your actual Cloudflare account ID:

```bash
wrangler whoami
```

### 5. Configure Resend Domain (Optional but Recommended)

For production, set up your custom domain in Resend:

1. Go to Resend dashboard
2. Add your domain (3rdarcproductions.com)
3. Follow DNS verification steps
4. Update the `from` field in `functions/api/contact.ts`:

```typescript
from: "Contact Form <contact@3rdarcproductions.com>";
```

**For now**, emails will be sent from the Resend default domain during onboarding.

### 6. Test Locally (Optional)

```bash
npm run dev
```

Visit the contact form and submit a test message.

### 7. Deploy to Cloudflare Pages

Make sure you're connected to Cloudflare Pages:

```bash
npm run build
wrangler pages deploy dist
```

Or set up automatic deployments:

1. Connect your Git repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Add environment variable `RESEND_API_KEY` in the dashboard

## File Structure

```
functions/
├── api/
│   └── contact.ts          # Contact form API endpoint
```

## API Endpoint

### POST /api/contact

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here..."
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response (Error):**

```json
{
  "error": "Error message describing what went wrong"
}
```

## Features

✅ **Sends email to:** 3rdarcproductions@gmail.com  
✅ **Sends confirmation to:** User's email address  
✅ **Validates** required fields and email format  
✅ **HTML formatted** professional emails  
✅ **Error handling** with user-friendly messages  
✅ **Security** - Escapes HTML to prevent injection attacks

## Troubleshooting

### Emails not sending?

1. Check API key is correct in environment variables
2. Ensure `RESEND_API_KEY` is set in Cloudflare Pages dashboard
3. Check Resend dashboard for failed messages

### 401 Unauthorized Error

- Your Resend API key is invalid or expired
- Generate a new key from Resend dashboard

### Cannot verify domain?

- This is optional during onboarding
- You can use the default Resend domain to start
- Set up custom domain later once live

## Support

- Resend Docs: https://resend.com/docs
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/functions/
