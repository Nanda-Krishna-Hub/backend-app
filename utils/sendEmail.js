const nodemailer = require('nodemailer');
const config = require('../config/config')



const sendEmail = async (to, subject, html) => {
    try{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailuser,
            pass: config.emailpass
        }
    });

    const mailOptions = {
        from: '"backend-app" urstrulynanda@gmail.com',
        to,
        subject,
        html,
    };
    
    await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.error("❌ Email send error:", err.stack);
    }
};

module.exports = sendEmail


