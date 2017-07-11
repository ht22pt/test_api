/* eslint-disable strict */

'use strict';

var YouTubeAPI = require('../utility/youtube-api');
var logger = require('./utility/logger');

module.exports = function (app) {
  // Install a `/` route that returns server status
  var router = app.loopback.Router();
  // var TestUserModel = app.models().TestUser;

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
