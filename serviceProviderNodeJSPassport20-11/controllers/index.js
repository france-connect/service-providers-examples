'use strict;'

// var IndexController = function(){};
// var configManager = new (require('../helpers/configManager.js'))();
const config = require('../config/config.json')

const handleMain = (req, res) => {
    // var agentMode = configManager.isModeAgents();
    const agentMode = config.mode === 'agents'

    if(req.session.user){
        res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: req.session.userInfo, agentMode: agentMode});
    } else {
        if(req.session.passport && req.session.passport.user){
            var given_name = (req.session.passport.user._json.given_name) ? req.session.passport.user._json.given_name : '';
            var family_name = (req.session.passport.user._json.family_name) ? req.session.passport.user._json.family_name : '';
            req.session.user = given_name + ' ' + family_name;
            var userInfo = (req.session.passport.user._json) ? req.session.passport.user._json : '';
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user, userInfo: userInfo, agentMode: agentMode});
        } else {
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: undefined, userInfo: undefined, agentMode: agentMode});
        }
    }
}

module.exports = {
  handleMain
};
