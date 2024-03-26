const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = 3000;

const app = express();

app.use('/api', require('./src/routes/prototypeApi'));

app.use(cors());

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});