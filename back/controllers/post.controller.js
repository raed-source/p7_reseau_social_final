const Post = require('../models/postModel');



exports.getAllPosts = (req, res, next) => {
    Post.find().then(
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
    const postObject = req.body;
    delete postObject._id;
    const post = new Post({
        ...postObject,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked:[]
    });
    post.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};



// exports.modifyPost = (req, res, next) => {
//     const post = new Post({
//         _id: req.params.id,
//         title: req.body.title,
//         description: req.body.description,
//         imgUrl: req.body.imgUrl,
//         price: req.body.price,
//         userId: req.body.userId
//     });
//     console.log(userId);
//     console.log(post.id);
//     Post.updateOne({ _id: req.params.id }, post).then(
//         () => {
//             res.status(201).json({
//                 message: 'Post updated successfully!'
//             });
//         }
//     ).catch(
//         (error) => {
//             res.status(400).json({
//                 error: error
//             });
//         }
//     );
// };
// 
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (post.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                console.log(post.id);
                // const filename = post.imgUrl.split('/images/')[1];
                // fs.unlink(`images/${filename}`, () => {
                    Post.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                // });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// ----------------------MODIFY LE post------------------------------
exports.modifyPost = (req, res, next) => {

    console.log('modifier posts');
    const postObject = req.file ? {
      ...JSON.parse(req.body.post),
    //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(postObject);
    console.log(req.auth.userId);
    if (postObject.userId !== req.auth.userId) {
      return res.status(401).json({ error: new Error('Vous ne pouvez pas modifier cette post') })
    }
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
      .then(
        () => {
          console.log('Post modifié !');
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
  