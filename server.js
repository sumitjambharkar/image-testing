const express = require('express');
const app = express();
const IP = require('ip');
const dotenv = require('dotenv')
dotenv.config()
const Port = process.env.PORT 
app.set('trust proxy', true);

app.get('/getIpAddress', (req, res) => {
    const ipAddress = IP.address();
    res.send(ipAddress)
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
