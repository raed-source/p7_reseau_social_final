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
        like: "",
        dislike: "",
      
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