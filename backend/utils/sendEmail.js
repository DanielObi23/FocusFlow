import sgMail from'@sendgrid/mail';
import dotenv from "dotenv";

dotenv.config();
export default async function sendEmail(option) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
    to: option.myEmail || option.email, // sent to my email or user email
    from: {
        name: "FocusFlow",
        email: process.env.SENDGRID_EMAIL,
    },
    subject: option.subject,
    text: option.text,
    html: option.html,
    };
    try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      }
}


