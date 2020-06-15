const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const dbConfig = require('./config/secret');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser());
app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

require('./socket/streams')(io);

const auth = require('./routes/authRoute');
const posts = require('./routes/postsRoute');
app.use('/api/letsgossip', auth);
app.use('/api/letsgossip', posts);

server.listen(3000, () => {
    console.log('Running on port 3000');
})