'use strict';

var url = require('url');
var FacebookAPI = require('../utility/facebook-api');

module.exports = function (app) {
  // Install a `/` route that returns server status
  var router = app.loopback.Router();
  var TestUserModel = app.models.TestUser;

  router.get('/facebook/login', function (req, res) {
    // get authorization url
    var baseUrl = req.headers.host;
    if (baseUrl.indexOf("http") === -1) {
      baseUrl = "http://" + baseUrl;
    }
    var facebookApi = new FacebookAPI();

    // shows dialog
    res.redirect(facebookApi.requestOAuth(baseUrl));
  });

  router.get('/facebook/auth', function (req, res) {
    // after user click, auth `code` will be set
    // we'll send that and get the access token
    var baseUrl = req.headers.host;
    if (baseUrl.indexOf("http") === -1) {
      baseUrl = "http://" + baseUrl;
    }
    var authenCode = req.query.code;

    var facebookApi = new FacebookAPI();

    facebookApi.verifyOAth(baseUrl, authenCode).then(function (data) {
      res.redirect(url.format({
        pathname: "/facebook/userinfo",
        query: data
      }));
    }).catch(function (err) {
      // Log error
      console.log(err);
    });
  });

  router.get('/facebook/userinfo', function (req, res) {
    // Get user info, store token to database and update geneate information for user
    var token = req.query;
    var facebookApi = new FacebookAPI();

    facebookApi.getSelfInfo(token.access_token).then(function (data) {

      // Return data to client
      res.send(data);

      var testUser = {
        name: data.name,
        type: 1,
        token: token
      };

      return TestUserModel.upsertWithWhere({name: data.name}, testUser);
    }).then(function (userInfo) {
          console.log("Create user done", userInfo);
    }).catch(function (err) {
      // Log error
      console.log(err);
    });
  });

    router.get('/facebook/getFriends', function (req, res) {
    // Get user info, store token to database and update geneate information for user
    var token = req.query;
    var facebookApi = new FacebookAPI();

    facebookApi.getSelfInfo(token.access_token).then(function (data) {

      // Return data to client
      res.send(data);

      var testUser = {
        name: data.name,
        type: 1,
        token: token
      };

      return TestUserModel.upsertWithWhere({name: data.name}, testUser);
    }).then(function (userInfo) {
          console.log("Create user done", userInfo);
    }).catch(function (err) {
      // Log error
      console.log(err);
    });
  });

  router.post('/facebook/posts', function (req, res) {
    var youtube = new YouTubeAPI();
    youtube.getComments("36m1o-tM05g").then(function (data) {
      res.send(data);
    }).catch(function (err) {
      res.send(err);
    });
  });

  router.post('/facebook/friends', function (req, res) {
    var youtube = new YouTubeAPI();
    youtube.getComments("36m1o-tM05g").then(function (data) {
      res.send(data);
    }).catch(function (err) {
      res.send(err);
    });
  });


  app.use(router);
};


