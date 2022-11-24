const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post.controller');

router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
// router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;