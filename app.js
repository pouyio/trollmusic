const express = require('express')
const http = require('http');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const PORT = 8080;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));


server.listen(PORT, () => console.log(`Started on port ${PORT}!`));