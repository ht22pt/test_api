/* eslint-disable strict */

'use strict';

let url = require('url');
let FacebookAPI = require('../utility/facebook-api');
let logger = require('../utility/logger');

module.exports = function (app) {
    // Install a `/` route that returns server status
    let router = app.loopback.Router();
    let TestUserModel = app.models.TestUser;

    router.get('/facebook/login', function (req, res) {
        // get authorization url
        let baseUrl = req.headers.host;
        if (baseUrl.indexOf('http') === -1) {
            baseUrl = 'http://' + baseUrl;
        }
        let facebookApi = new FacebookAPI();

        // shows dialog
        res.redirect(facebookApi.requestOAuth(baseUrl));
    });

    router.get('/facebook/auth', function (req, res) {
        // after user click, auth `code` will be set
        // we'll send that and get the access token
        let baseUrl = req.headers.host;
        if (baseUrl.indexOf('http') === -1) {
            baseUrl = 'http://' + baseUrl;
        }
        let authenCode = req.query.code;
        let facebookApi = new FacebookAPI();

        facebookApi.verifyOAth(baseUrl, authenCode).then(function (data) {
            res.redirect(url.format({
                pathname: '/facebook/userinfo',
                query: data
            }));
        }).catch(function (err) {
            // Log error
            console.log(err);
        });
    });

    router.get('/facebook/userinfo', function (req, res) {
        // Get user info, store token to database and update geneate information for user
        let token = req.query;
        let facebookApi = new FacebookAPI();

        facebookApi.getSelfInfo(token.access_token).then(function (data) {
            // Return data to client
            res.send(data);

            let testUser = {
                name: data.name,
                type: 1,
                token: token
            };

            return TestUserModel.upsertWithWhere({name: data.name}, testUser);
        }).then(function (userInfo) {
            logger.debug('Create user done', userInfo);
        }).catch(function (err) {
            // Log error
            logger.error(err);
        });
    });

    router.get('/facebook/getFriends', function (req, res) {
        // Get user info, store token to database and update geneate information for user
        let token = req.query;
        let facebookApi = new FacebookAPI();

        facebookApi.getSelfInfo(token.access_token).then(function (data) {
            // Return data to client
            res.send(data);

            let testUser = {
                name: data.name,
                type: 1,
                token: token
            };

            return TestUserModel.upsertWithWhere({name: data.name}, testUser);
        }).then(function (userInfo) {
            console.log('Create user done', userInfo);
        }).catch(function (err) {
            // Log error
            console.log(err);
        });
    });

    router.post('/facebook/posts', function (req, res) {

    });

    router.post('/facebook/friends', function (req, res) {

    });

    app.use(router);
};
