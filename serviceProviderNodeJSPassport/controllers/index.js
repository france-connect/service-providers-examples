'use strict;'

var IndexController = function(){};

IndexController.prototype.handleMain = function(req, res){
    if(req.session.user){
        res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: req.session.userInfo});
    } else {
        if(req.session.passport && req.session.passport.user){
            var given_name = (req.session.passport.user._json.given_name) ? req.session.passport.user._json.given_name : '';
            var family_name = (req.session.passport.user._json.family_name) ? req.session.passport.user._json.family_name : '';
            req.session.user = given_name + ' ' + family_name;
            var userInfo = (req.session.passport.user._json) ? req.session.passport.user._json : '';
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: userInfo});
        } else {
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: undefined, userInfo: undefined});
        }
    }
};

module.exports.IndexController = IndexController;