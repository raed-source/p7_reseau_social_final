const User = require('../models/userModel');
// const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.getAllUsers = (req, res, next) => {
  User.find().then(
      (users) => {
        res.status(200).Json(users);
      }
    )
    .catch(
      (error) => {
        res.status(400).Json({
          error: error
        });
      }
    )
}
exports.getOneuser = (req, res, next) => {
  console.log('ce user');
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};







// ------------------------FONCTION SIGNUP---------------------------------
exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      console.log("hash", hash);
      const user = new User({
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
      console.log(user);
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        .catch(error => {
          console.log(error);
          res.status(400).json({
            error
          })
        });
      console.log('saved in databases');
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error
      })
    });
  console.log('not saved');
};

// ---------------------------------FONCTION LOGIN----------------------------------
exports.login = (req, res, next) => {
  User.findOne({email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({error: 'Utilisateur non trouvé !'});
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          res.status(200).json({
            userId: user._id,
            isAdmin:user.isAdmin,
            token: jwt.sign({
                userId: user._id
              },
              'RANDOM_TOKEN_SECRET', {
                expiresIn: '24h'
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};