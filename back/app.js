require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// require('dotenv').config({
//     path: './config/.env'
// });
// 
const path = require('path');
// ********************************************************************************
// mongodb://localhost:27017/oc'
mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.MDP}@cluster0.zavdmbw.mongodb.net/p7?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
const userRoute = require('./routers/user.route');
const postRoute = require('./routers/post.route');
const bodyParser = require('body-parser');
const post = require('./models/postModel')



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
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoute)
app.use('/api/posts', postRoute);
app.use(cookieParser());
module.exports = app;