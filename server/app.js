const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db'); 
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mailRouter = require('./routes/emailRoutes');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


connectDB();

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: "*",
  allowedHeaders: ["Content-Type"],
  credentials: true 
};
app.use(cors(corsOptions));

// Папка для сохранения загруженных изображений
const uploadDir = path.join(__dirname, 'uploads');
app.use(express.static(uploadDir));

// Мультипарт обработка загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Роутер для загрузки изображений
app.post('/upload', upload.array('images', 5), (req, res) => {
    // Пути к загруженным файлам
    const imagePaths = req.files.map(file => file.filename);
    res.json({ imagePaths: imagePaths });
});


// Routes
app.use('/projects', projectRoutes);
app.use('/admin', adminRoutes);
app.use('/send-email', mailRouter);


// Запуск сервера
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
