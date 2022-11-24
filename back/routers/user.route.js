const express = require('express');
const validEmail = require('../middlewares/email');
const validPassword = require('../middlewares/password');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');



router.post('/signup', validEmail, validPassword, userCtrl.signup);
router.post('/login', userCtrl.login);
// router.post('/refrech_token', userCtrl.generateAccessToken);

module.exports = router;