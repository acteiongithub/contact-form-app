const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// API endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;

    const sql = `INSERT INTO customers (firstname, lastname, email, phone, message) 
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE firstname=VALUES(firstname), lastname=VALUES(lastname), phone=VALUES(phone), message=VALUES(message)`;

    db.query(sql, [firstname, lastname, email, phone, message], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Form submitted successfully');
    });
});

// API endpoint to get all customers
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM customers';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
