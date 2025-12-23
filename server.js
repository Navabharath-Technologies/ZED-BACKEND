const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email endpoint
app.post('/send-email', async (req, res) => {
    // 1. Capture ALL fields (including Service and Phone)
    const { name, email, phone, service, message } = req.body;

    // DEBUG LOG: Check your Render logs to see this line!
    console.log("📝 Received Form Data:", { name, email, phone, service, message });

    if (!name || !email || !phone || !service || !message) {
        console.log("❌ Missing fields in request");
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const emailData = await resend.emails.send({
            from: "NBSOC <no-reply@updates.navabharatha.com>",
            to: "contact@navabharatha.com",
            // Subject now includes the Name
            subject: New Contact Form Submission from ${name},
            // HTML body explicitly includes Phone and Service
            html: `
                <h2>New Contact Form Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service Interested In:</strong> ${service}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        console.log("✔ Email Sent Successfully:", emailData);

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
    console.log(🚀 Server running on port ${PORT});
});
