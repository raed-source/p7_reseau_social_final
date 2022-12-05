const { json } = require('express');
const fs = require('fs');
const Post = require('../models/postModel');


//************************* */
exports.getAllPosts = (req, res, next) => {
    Post.find().sort({createdAt:-1}).then(
        (posts) => {
            res.status(200).json(posts);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// **************************************************************************
exports.getOnePost = (req, res, next) => {
    Post.findOne({
        _id: req.params.id
    }).then(
        (post) => {
            res.status(200).json(post);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};
// *****************************************************************************
exports.createPost = (req, res, next) => {
    console.log(req.body);
    console.log(req.file.filename);
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;
    const post = new Post({
        ...postObject,
        likes: 0,
        dislikes: 0,
        imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        usersLiked:[],
        usersDisliked:[]
    });
    post.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// ----------------------MODIFY LE post------------------------------
exports.modifyPost = (req, res, next) => {

    console.log('modifier posts');
    // console.log('imag '+ req.file.filename);
    const postObject = req.file ? {
      ...JSON.parse(req.body.post),
      imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...JSON.parse(req.body.post) };
    console.log('image', req.file?.filename)
    console.log(postObject);
    console.log(req.auth.userId);
    if (postObject.userId !== req.auth.userId) {
      return res.status(401).json({ error: new Error('Vous ne pouvez pas modifier cette post') })
    }
    Post.findOneAndUpdate({ _id: req.params.id }, { ...postObject})
      .then(
        (post) => {
          console.log('Post modifié !', post);
          res.status(200).json({
            message: 'Post updated successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
  };
  // ********************************************
  
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
      .then((post) => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({ message: 'Not authorized' });
          } else {
              console.log(post.id);
              const filename = post.imgUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Post.deleteOne({ _id: req.params.id })
                      .then(() => {console.log('Objet supprimé !');
                         res.status(200).json({ message: 'Objet supprimé !' }) })
                         .catch(error => {
                          console.log(error)
                          res.status(400).json({ error })
                       });              });
          }
      })
      .catch(error => {
        console.log(error);
          res.status(500).json({ message:error });
      });
};

//   ***********like methode*********************
exports.likePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        if (req.body.like === 1) {
          post.usersLiked.push(req.body.userId);
        } else if (req.body.like === -1) {
          post.usersDisliked.push(req.body.userId);
        } else if (req.body.like === 0) {
       
          if (post.usersLiked.includes(req.body.userId) === true) {
            const userIdIndex = post.usersLiked.indexOf(req.body.userId);
            post.usersLiked.splice(userIdIndex, 1);
          } else {
            const userIdIndexDisliked = post.usersDisliked.indexOf(req.body.userId);
            post.usersDisliked.splice(userIdIndexDisliked, 1);
          }
        }
        post.likes = post.usersLiked.length;
        post.dislikes = post.usersDisliked.length;
        Post.updateOne(
          { _id: req.params.id },
          {
            likes: post.likes,
            dislikes: post.dislikes,
            usersLiked: post.usersLiked,
            usersDisliked: post.usersDisliked,
          }
        )
          .then(() => res.status(200).json({ message: "Vous venez de voter" }))
          .catch((error) => {
            if (error) {
              console.log(error);
            }
          });
      })
      // si erreur envoit un status 404 Not Found et l'erreur en json
      .catch((error) => res.status(404).json({ error }));
  }
  