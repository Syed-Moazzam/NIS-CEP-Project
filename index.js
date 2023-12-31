const express = require('express');
const connectToMongo = require('./db');
const { readdirSync } = require('fs');
const app = express();

app.use(express.json());

connectToMongo();

readdirSync('./routes')?.map((route) => app.use('/api', require('./routes/' + route)));

const port = 4000;
app.listen(port, () => {
    console.log('Server is running on port 4000');
});