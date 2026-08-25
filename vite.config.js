import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_KEY_B64 = 'cmVfVWlBUjlFWFdfOFkxNnVyc1BpR0p2b2dGbkNLYkp0Y1dz';

const resendApiPlugin = () => ({
  name: 'resend-api-middleware',
  configureServer(server) {
    server.middlewares.use('/api/send-contact', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const { name, email, fundName, subject, category, message } = data;

          if (!name || !email || !message) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Name, email, and message are required fields.' }));
            return;
          }

          const apiKey = Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf-8');

          const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #334155;">
              <div style="border-bottom: 1px solid #1e293b; padding-bottom: 18px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #10b981; font-size: 20px;">Global &amp; India VC Index — New Contact Inquiry</h2>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Received via VC Intelligence Portal</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: 600;">Sender Name:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Sender Email:</td>
                  <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                </tr>
                ${fundName ? `
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">VC Firm / Org:</td>
                  <td style="padding: 8px 0; color: #ffffff;">${fundName}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Inquiry Type:</td>
                  <td style="padding: 8px 0; color: #f59e0b; font-weight: bold;">${category || subject || 'General Inquiry'}</td>
                </tr>
              </table>

              <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-top: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content</h4>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #f1f5f9; font-size: 14px;">${message}</p>
              </div>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
                Sent to <strong>global-and-indiavc@flugelsoft.com</strong> • Global &amp; India VC Index
              </div>
            </div>
          `;

          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: ['global-and-indiavc@flugelsoft.com'],
              reply_to: email,
              subject: `[Global & India VC Index] ${category || subject || 'Contact Message'} from ${name}`,
              html: htmlContent,
            }),
          });

          const result = await resendResponse.json();

          if (!resendResponse.ok) {
            res.statusCode = resendResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: result.message || 'Failed to send email via Resend' }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    resendApiPlugin(),
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true
  }
})