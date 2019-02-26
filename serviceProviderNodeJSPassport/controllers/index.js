'use strict';

const IndexController = function(){};
const configManager = new (require('../helpers/configManager.js'))();

IndexController.prototype.handleMain = function(req, res){
    const agentMode = configManager.isModeAgents();
    if(req.session.user){
        res.render('index', {title: 'Démonstrateur AgentConnect - Accueil', user: req.session.user, userInfo: req.session.userinfos, agentMode: agentMode});
    } else {
        if(req.session.passport && req.session.user){
            const given_name = (req.session.userinfos.given_name) ? req.session.userinfos.given_name : '';
            const family_name = (req.session.userinfos.family_name) ? req.session.userinfos.family_name : '';
            req.session.user = given_name + ' ' + family_name;
            const userInfo = (req.session.userinfos) ? req.session.userinfos : '';
            res.render('index', {title: 'Démonstrateur AgentConnect - Accueil', user: req.session.user, userInfo: userInfo, agentMode: agentMode});
        } else {
            res.render('index', {title: 'Démonstrateur AgentConnect - Accueil', user: undefined, userInfo: undefined, agentMode: agentMode});
        }
    }
};

module.exports.IndexController = IndexController;
