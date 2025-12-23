const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Resend client - Ensure you have RESEND_API_KEY in your environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email endpoint
app.post('/send-email', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    // Validate that all fields are present
    if (!name || !email || !phone || !service || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const emailData = await resend.emails.send({
            from: "NBSOC <no-reply@updates.navabharatha.com>",
            to: "contact@navabharatha.com",
            subject: New Contact Form Submission from ${name}, // Fixed template literal
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #0E5E72; border-bottom: 2px solid #0E5E72; padding-bottom: 10px;">New Contact Form Message</h2>
                    
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Service Interested In:</strong> ${service}</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <footer style="margin-top: 20px; font-size: 0.8em; color: #777; text-align: center;">
                        This email was sent from the Navabharatha Contact Form.
                    </footer>
                </div>
            `
        });

        console.log("✔ Email Sent successfully:", emailData); // Fixed template literal

        return res.status(200).json({
            success: true,
            message: "Email sent successfully!"
        });

    } catch (error) {
        console.error("❌ Email Send Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send email."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(🚀 Server running on port ${PORT}); // Fixed template literal
});
