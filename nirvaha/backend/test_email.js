/**
 * Quick SMTP test — run with: node test_email.js
 * This sends a real test email to verify your credentials work.
 */
require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

console.log('📧 Testing SMTP credentials...');
console.log(`   SMTP_USER: ${user}`);
console.log(`   SMTP_PASS: ${pass ? '✓ set (' + pass.length + ' chars)' : '✗ NOT SET'}`);

if (!user || !pass) {
  console.error('❌ SMTP_USER or SMTP_PASS is missing in .env!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection FAILED:', error.message);
    console.log('\n💡 Common fixes:');
    console.log('   1. Make sure 2-Step Verification is ON for your Google account');
    console.log('   2. Go to https://myaccount.google.com/apppasswords and generate a new App Password');
    console.log('   3. Paste it in .env without any spaces: SMTP_PASS=xxxxxxxxxxxxxxxx');
    process.exit(1);
  }

  console.log('✅ SMTP connection verified! Sending test email...');

  transporter.sendMail({
    from: `"Nirvaha Test" <${user}>`,
    to: user,  // send to yourself
    subject: '✅ Nirvaha Email Test - Working!',
    text: `This is a test email from Nirvaha backend.\n\nIf you received this, your SMTP credentials are working correctly!\n\nSMTP_USER: ${user}`,
  }, (err, info) => {
    if (err) {
      console.error('❌ Failed to send test email:', err.message);
      process.exit(1);
    }
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox at: ${user}`);
  });
});
