const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {user, password} = require('../credentials');

router.use(bodyParser.json());


const adminCredentials = {
  login: user,
  password: password
};

router.post('/register', (req, res) => {
  const { login, password } = req.body;

  // Сравниваем введенные данные с данными администратора
  if (login === adminCredentials.login && password === adminCredentials.password) {
    // Отправляем ответ в формате JSON
    res.json({ message: 'Добро пожаловать, Администратор!' });
  } else {
    // Отправляем ошибку в формате JSON
    res.status(401).json({ error: 'Доступ запрещен: неверные учетные данные.' });
  }
});

module.exports = router;
