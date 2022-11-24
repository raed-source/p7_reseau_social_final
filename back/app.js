const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({
    path: './config/.env'
});

const app = express();
const userRoute = require('./routers/user.route');
const postRoute = require('./routers/post.route');
const path = require('path');
const bodyParser = require('body-parser');
const post = require('./models/postModel')

// ********************************************************************************
// mongodb://localhost:27017/oc'
mongoose.connect('mongodb+srv://p7:p7@cluster0.zavdmbw.mongodb.net/p7?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// *******************************************************************************
app.use(bodyParser.json());
// *****************************************************************
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200'
}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/api/auth', userRoute)
app.use('/api/posts', postRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cookieParser());
module.exports = app;