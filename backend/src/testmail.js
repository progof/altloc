import nodemailer from "nodemailer";

// Настройки транспортера с использованием SMTP
let transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // SMTP-сервер
    port: 587,                // Порт сервера
    secure: false,            // true для 465, false для других портов
    auth: {
        user: 'elspero.project@gmail.com',  // Твоя почта
        pass: 'vodg qeod lmzd zknb'      // Пароль или токен
    }
});

// Настройки письма
let mailOptions = {
    from: '"Your Name" <elspero.project@gmail.com', // От кого
    to: 'progof031@gmail.com',                 // Кому
    subject: 'Hello from Nodemailer',            // Тема
    text: 'This is a test email sent using Nodemailer.', // Текст письма
    html: '<b>This is a test email sent using Nodemailer.</b>' // HTML-версия письма
};

// Отправка письма
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ', error);
    }
    console.log('Email sent: ', info.response);
});
