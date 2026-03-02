const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'pablopok08@gmail.com',
      subject: 'LASS Realty - Resend Test',
      html: '<p>Congrats on sending your <strong>first email</strong> through the LASS Realty backend!</p>'
    });
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
test();
