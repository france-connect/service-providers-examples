'use strict';

const IndexController = function(){};
const configManager = new (require('../helpers/configManager.js'))();

IndexController.prototype.handleMain = function(req, res){
    if(req.session.user){
        res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: req.session.userinfos});
    } else {
        if(req.session.passport && req.session.user){
            const given_name = (req.session.userinfos.given_name) ? req.session.userinfos.given_name : '';
            const family_name = (req.session.userinfos.family_name) ? req.session.userinfos.family_name : '';
            req.session.user = given_name + ' ' + family_name;
            const userInfo = (req.session.userinfos) ? req.session.userinfos : '';
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: userInfo});
        } else {
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: undefined, userInfo: undefined});
        }
    }
};

module.exports.IndexController = IndexController;
