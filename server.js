const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const authRoute = require('./routes/auth.routes');
const booksRoute = require('./routes/books.routes');
const authenticateToken = require('./middlewares/auth.middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api', authenticateToken, booksRoute);

app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});


