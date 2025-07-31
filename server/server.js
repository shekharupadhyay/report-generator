const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const surveyRouter = require('./routes/survey');

const app = express();
app.use(cors(), express.json());

mongoose.connect('mongodb://localhost:27017/survey-docx', {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.use('/api/survey', surveyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
