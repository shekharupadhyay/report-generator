const express = require('express');
const cors = require('cors');
const surveyRouter = require('./routes/survey');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/survey', surveyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
