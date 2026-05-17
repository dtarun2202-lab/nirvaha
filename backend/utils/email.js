const nodemailer = require('nodemailer');

// Reusable transporter instance (cached)
let transporterInstance = null;

/**
 * Configure Nodemailer Transporter
 * Reads credentials from environment variables: SMTP_USER, SMTP_PASS
 * Falls back to console simulation if SMTP credentials are not present in .env
 */
const getTransporter = () => {
  if (transporterInstance) return transporterInstance;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('⚠️  Email Warning: SMTP_USER or SMTP_PASS not found in environment variables. Falling back to console email simulation.');
    return null;
  }

  // Create reusable transporter configured for Gmail SMTP
  transporterInstance = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  return transporterInstance;
};

/**
 * Send Session Confirmation Email to the user
 * @param {Object} booking - Booking/Session information
 */
const sendSessionConfirmationEmail = async (booking) => {
  const { userName, userEmail, email, date, time, companionName, itemName, type, platform, sessionNotes, price } = booking;
  const targetEmail = userEmail || email;
  const sessionTitle = companionName || itemName || type || 'Wellness Session';

  const subject = 'Session Confirmed – Nirvaha';

  const textContent = `Hello ${userName},

Your session has been successfully confirmed.

Session Details:
* Session: ${sessionTitle}
* Date: ${date}
* Time: ${time}
* Platform: ${platform || 'Online'}
* Price: ₹${price || '1500'}
* Status: Session Confirmed
${sessionNotes ? `\nYour Notes: ${sessionNotes}\n` : ''}
Thank you for choosing Nirvaha.
We look forward to supporting your reflection journey.

Best regards,
Nirvaha Team`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Confirmed – Nirvaha</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #F4FAF6;
          color: #1B4332;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          background-color: #F4FAF6;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(27, 67, 50, 0.04);
          border: 1px solid #D5EEDD;
        }
        .header {
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);
          padding: 40px 30px;
          text-align: center;
          color: #ffffff;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 12px;
          text-transform: uppercase;
          color: #52B788;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #ffffff;
        }
        .content {
          padding: 40px 35px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1B4332;
        }
        .intro-text {
          font-size: 15px;
          line-height: 1.6;
          color: #2D6A4F;
          margin-bottom: 30px;
        }
        .details-card {
          background-color: #F4FAF6;
          border: 1px solid #D5EEDD;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #D5EEDD;
          padding-bottom: 12px;
          margin-bottom: 16px;
          width: 100%;
        }
        .details-title {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2D6A4F;
        }
        .badge {
          background-color: #D5EEDD;
          color: #1B4332;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
        }
        .detail-label {
          font-weight: 600;
          color: #556B5D;
        }
        .detail-value {
          font-weight: 700;
          color: #1B4332;
          text-align: right;
        }
        .notes-card {
          border-left: 4px solid #52B788;
          background-color: #F4FAF6;
          padding: 16px 20px;
          margin-bottom: 30px;
          border-radius: 0 12px 12px 0;
        }
        .notes-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #2D6A4F;
          margin-bottom: 6px;
        }
        .notes-content {
          font-size: 14px;
          font-style: italic;
          line-height: 1.5;
          color: #1B4332;
        }
        .action-container {
          text-align: center;
          margin: 35px 0 15px;
        }
        .button {
          background-color: #1B4332;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.15);
          transition: all 0.2s ease;
        }
        .tips-section {
          margin-top: 30px;
          border-top: 1px dashed #D5EEDD;
          padding-top: 24px;
        }
        .tips-title {
          font-size: 13px;
          font-weight: 700;
          color: #1B4332;
          margin-bottom: 8px;
        }
        .tips-list {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #556B5D;
          line-height: 1.6;
        }
        .footer {
          background-color: #1B4332;
          padding: 40px 30px;
          text-align: center;
          color: #D5EEDD;
          border-top: 1px solid #D5EEDD;
        }
        .footer-brand {
          font-weight: 800;
          color: #ffffff;
          font-size: 18px;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }
        .footer p {
          margin: 6px 0;
          font-size: 13px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">Nirvaha</div>
            <h1>Your session is confirmed</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${userName},</div>
            <div class="intro-text">
              We are pleased to inform you that your wellness session booking has been successfully confirmed by the Nirvaha Team. We look forward to supporting your reflection and mindfulness journey.
            </div>
            
            <div class="details-card">
              <div class="details-header">
                <span class="details-title">Booking Details</span>
                <span class="badge">Session Confirmed</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Session Guide / Item</span>
                <span class="detail-value">${sessionTitle}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time</span>
                <span class="detail-value">${time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Platform</span>
                <span class="detail-value">${platform || 'Video Session'}</span>
              </div>
              <div class="detail-row" style="border-top: 1px solid #D5EEDD; margin-top: 10px; padding-top: 12px; display: flex; justify-content: space-between;">
                <span class="detail-label" style="color: #1B4332; font-weight: 700;">Total Investment</span>
                <span class="detail-value" style="color: #1B4332; font-weight: 800;">₹${price || '1500'}</span>
              </div>
            </div>
            
            ${sessionNotes ? `
            <div class="notes-card">
              <div class="notes-title">Your Notes for the Session</div>
              <div class="notes-content">"${sessionNotes}"</div>
            </div>
            ` : ''}
            
            <div class="tips-section">
              <div class="tips-title">💡 Quick tips for your reflection session:</div>
              <ul class="tips-list">
                <li>Choose a quiet, comfortable space where you won't be interrupted.</li>
                <li>Test your audio and internet connection 5 minutes prior to the session.</li>
                <li>Bring a journal or notebook to jot down any personal insights.</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Nirvaha</div>
            <p>Thank you for choosing Nirvaha.</p>
            <p>If you have any questions or need to reschedule, please contact our support team.</p>
            <p style="margin-top: 24px; font-size: 11px; opacity: 0.7;">
              © ${new Date().getFullYear()} Nirvaha Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Nirvaha" <${process.env.SMTP_USER}>`,
    to: targetEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Confirmation email sent successfully');
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send confirmation email via SMTP:', error.message);
      return { success: false, error: error.message };
    }
  } else {
    // Simulated delivery log
    console.log(`✉️  [SIMULATION] Sending Email Confirmation:`);
    console.log(`====================================================`);
    console.log(`TO:       ${targetEmail}`);
    console.log(`SUBJECT:  ${subject}`);
    console.log(`BODY:\n${textContent}`);
    console.log(`====================================================`);
    console.log(`✅ Simulated email delivery successful.`);
    return { success: true, simulated: true };
  }
};

module.exports = {
  sendSessionConfirmationEmail,
};
