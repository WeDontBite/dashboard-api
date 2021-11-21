const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/data', async (req, res) => {
    try {
        const data = req.body;
        const connection = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        await connection.db('wedontbyte').collection('data').deleteMany({});
        await connection.db('wedontbyte').collection('data').insertMany(data);
        await connection.close();

        res.json();
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get('/data', async (req, res) => {
    try {
        const connection = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        const data = await connection.db('wedontbyte').collection('data').find({}).toArray();
        await connection.close();
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});