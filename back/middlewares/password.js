const passwordValidator = require('password-validator');
const mongoose = require('mongoose');

const passwordSchema = new passwordValidator();
passwordSchema
    // .is().min(8)
    .is().max(20)
    // .has().uppercase(1)
    .has().lowercase()
    // .has().symbols(1)
    // .has().digits(1)
    .is().not(/[\]()'"[{}<>@]/)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);


module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        console.log(`pssword ${passwordSchema.validate(req.body.password)}`);
        next();
    } else {
        // console.log(`pssword ${passwordSchema.validate(req.body.password)}`);
        console.log(`le mot de pass respect ces critères: 8 à 20 caractères, un majuscule, un symbole, pas d'espace, pas de:/[\]()'"[{}<>@]/ `);

        return res
            .status(400)
            .json({ error: `le mot de pass ${passwordSchema.validate('req.body.password', { list: true })}` })
    }
};


