'use strict';
var sinon = require('sinon');
var assert = require('chai').assert;
var controller = new (require('../../controllers/index.js').IndexController)();

describe('index page (/)', function(){
    it('should render the page using user session data if user info exists in current session', function(){
        //setup
        var req = {
            session: {
                user: 'john', userInfo: {
                    given_name: 'john'
                }
            }
        };
        var res = {render:sinon.spy()};
        //action
        controller.handleMain(req, res);
        //assert
        assert.equal(res.render.calledOnce, true);
        assert.equal(res.render.getCall(0).args[0], 'index');
        assert.deepEqual(res.render.getCall(0).args[1], {title: 'Démonstrateur France Connect - Accueil', user: 'john', userInfo: {given_name: 'john'}});
    });

    it('should render the page with an "undefined" user data if there is no user data in the session and no passport session either', function(){
        //setup
        var req = {session:{}};
        var res = {render:sinon.spy()};
        //action
        controller.handleMain(req, res);
        //assert
        assert.equal(res.render.calledOnce, true);
        assert.equal(res.render.getCall(0).args[0], 'index');
        assert.deepEqual(res.render.getCall(0).args[1], {title: 'Démonstrateur France Connect - Accueil', user: undefined, userInfo: undefined});
    });

    it('should set req.session.user data before rendering if passport session data is available', function(){
        //setup
        var req = {session:{passport:{user:{_json:{given_name:'John', family_name:'Oliver'}}}}};
        var res = {render:sinon.spy()};
        //action
        controller.handleMain(req, res);
        //assert
        assert.equal(res.render.calledOnce, true);
        assert.equal(res.render.getCall(0).args[0], 'index');
        assert.deepEqual(res.render.getCall(0).args[1], {title: 'Démonstrateur France Connect - Accueil',
            user: 'John Oliver',
            userInfo: {family_name: 'Oliver', given_name: 'John'}
        });
    });
});