const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const {myEmail, pass} = require('../credentials')

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: myEmail,
        pass: pass
    }
  });

  const mailOptions = {
    from: myEmail,
    to: 'maksutaisana20091@gmail.com',
    subject: 'Новое сообщение от ' + name,
    text: `Имя: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Ошибка при отправке письма:', error);
      res.status(500).json({ message: 'Ошибка при отправке письма'});
    } else {
      console.log('Письмо успешно отправлено:', info.response);
      res.status(200).json({ message: 'Письмо успешно отправлено'});
    }
  });
});

module.exports = router;
