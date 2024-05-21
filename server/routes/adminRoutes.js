const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {secretKey} = require('../credentials');
const User = require('../models/user');

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Оnly the admin has permission' });
    }
    // Проверка на временную блокировку аккаунта
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      return res.status(401).json({ message: `Account is blocked until ${user.blockedUntil}` });
    }

    let loginAttempts = user.loginAttempts + 1;
    const maxLoginAttempts = 5;
    const lockoutTimeInMinutes = 5;

    // Сравниваем введенные данные с данными администратора
    if (password === user.password) {
      await User.findByIdAndUpdate(user._id, { loginAttempts: 0, blockedUntil: null });
      
      // Создание JWT токена и отправка ответа
      const token = jwt.sign({ userId: user._id}, secretKey, { expiresIn: '1h' });
      req.session.token = token;
      console.log(req.session);

      // Отправляем ответ в формате JSON
      res.status(200).json({ message: 'Login successful. Hello, Darina Sarsenova', token});
    } else {
      
      if (loginAttempts >= maxLoginAttempts) {
        const blockedUntil = new Date();
        blockedUntil.setSeconds(blockedUntil.getSeconds() + lockoutTimeInMinutes);
        await User.findByIdAndUpdate(user._id, { loginAttempts: 0, blockedUntil });
        // Отправляем ошибку в формате JSON
        return res.status(401).json({ message: `Too many login attempts. Account is blocked until ${blockedUntil}` });
      }else {
        await User.findByIdAndUpdate(user._id, { loginAttempts });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

module.exports = router;
