require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./router');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

for (const [key, value] of Object.entries(router)) {
  app.use('/' + key, value);
}

app.listen(process.env.APP_PORT, function () {
  console.log(`Service running successfully! The address is http://127.0.0.1:${process.env.APP_PORT}`);
});