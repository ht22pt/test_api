/* eslint-disable strict */

'use strict';

let url = require('url');
var YouTubeAPI = require('../utility/youtube-api');
var logger = require('../utility/logger');

module.exports = function (app) {
    // Install a `/` route that returns server status
    var router = app.loopback.Router();
    var TestUserModel = app.models.TestUser;

    router.get('/youtube/login', function (req, res) {
        // get authorization url
        let baseUrl = req.headers.host;
        if (baseUrl.indexOf('http') === -1) {
            baseUrl = 'http://' + baseUrl;
        }
        let googleApi = new YouTubeAPI();

        // shows dialog
        res.redirect(googleApi.requestOAuth(baseUrl));
    });
    router.get('/youtube/auth', function (req, res) {
        // after user click, auth `code` will be set
        // we'll send that and get the access token
        let baseUrl = req.headers.host;
        if (baseUrl.indexOf('http') === -1) {
            baseUrl = 'http://' + baseUrl;
        }
        let authenCode = req.query.code;
        let youtubeApi = new YouTubeAPI();

        youtubeApi.verifyOAth(baseUrl, authenCode).then(function (data) {
            res.redirect(url.format({
                pathname: '/youtube/channel',
                query: data
            }));
        }).catch(function (err) {
            // Log error
            console.log(err);
        });
    });

    router.get('/youtube/channel', function (req, res) {
        // Get user info, store token to database and update geneate information for user
        let token = req.query;
        let youtubeApi = new YouTubeAPI();

        youtubeApi.getChannel(token).then(function (data) {
            // Return data to client
            res.send(data);

            let testUser = {
                name: data.channelName,
                type: 0,
                token: token
            };

            return TestUserModel.upsertWithWhere({name: data.channelName}, testUser);
        }).then(function (userInfo) {
            logger.debug('Create user done', userInfo);
        }).catch(function (err) {
            // Log error
            logger.error(err);
        });
    });

    router.post('/youtube/search', function (req, res) {
        var youtube = new YouTubeAPI();
        youtube.searchVideo(undefined, 'demo').then(function (data) {
            logger.debug('Debug data done', data);
            res.send(data);
        }).catch(function (err) {
            res.send(err);
        });
    });

    router.post('/youtube/comments', function (req, res) {
        var youtube = new YouTubeAPI();
        youtube.getComments('36m1o-tM05g').then(function (data) {
            res.send(data);
        }).catch(function (err) {
            res.send(err);
        });
    });

    app.use(router);
};
