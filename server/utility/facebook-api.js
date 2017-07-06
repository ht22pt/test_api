var fs = require('fs');
var readline = require('readline');
var fbGraph = require('fbgraph');

var CLIENT_ID = "113106169105867";
var CLIENT_SECRET = "d436a7c8422e37a7a273566ce850f1bb";
var CLIENT_REDIRECT = "/facebook/auth";

// Some API need authentication

function FacebookApi() {

};

FacebookApi.prototype.requestOAuth = function (baseUrl) {

  var redirectUrl = baseUrl + CLIENT_REDIRECT;
  var authUrl = fbGraph.getOauthUrl({
    "client_id": CLIENT_ID,
    "redirect_uri": redirectUrl
  });

  return authUrl;
};

FacebookApi.prototype.verifyOAth = function (baseUrl, authenCode) {

  var redirectUrl = baseUrl + CLIENT_REDIRECT;

  return new Promise(function (fulfill, reject) {
    fbGraph.authorize({
      "client_id": CLIENT_ID
      , "redirect_uri": redirectUrl
      , "client_secret": CLIENT_SECRET
      , "code": authenCode
    }, function (err, response) {
      // Store to database
      if (err) {
        reject(err);
        return;
      }
      fulfill(response);
    });
  });
};

FacebookApi.prototype.getSelfInfo = function (token) {

  return new Promise(function (fulfill, reject) {

    fbGraph.get("/me?access_token=" + token, function (err, res) {
      // returns the post id
      if (err) {
        console.log('The API searchVideo returned an error: ' + err);
        reject(err);
        return;
      }
      fulfill(res);
    });
  });

};

FacebookApi.prototype.getPosts = function (auth, searchText, nextToken) {

  return new Promise(function (fulfill, reject) {

    var service = google.youtube('v3');
    service.search.list({
      key: API_KEY,
      maxResults: 25,
      part: 'snippet',
      q: searchText,
      type: ''
    }, function (err, response) {
      if (err) {
        console.log('The API searchVideo returned an error: ' + err);
        reject(err);
        return;
      }
      fulfill(response);
    });
  });

};

FacebookApi.prototype.getFriends = function (auth, searchText, nextToken) {

  return new Promise(function (fulfill, reject) {

    var service = google.youtube('v3');
    service.search.list({
      key: API_KEY,
      maxResults: 25,
      part: 'snippet',
      q: searchText,
      type: ''
    }, function (err, response) {
      if (err) {
        console.log('The API searchVideo returned an error: ' + err);
        reject(err);
        return;
      }
      fulfill(response);
    });
  });

};

FacebookApi.prototype.searchVideo = function (auth, searchText, nextToken) {

  return new Promise(function (fulfill, reject) {

    var service = google.youtube('v3');
    service.search.list({
      key: API_KEY,
      maxResults: 25,
      part: 'snippet',
      q: searchText,
      type: ''
    }, function (err, response) {
      if (err) {
        console.log('The API searchVideo returned an error: ' + err);
        reject(err);
        return;
      }
      fulfill(response);
    });
  });

};

FacebookApi.prototype.getComments = function (videoId) {

  return new Promise(function (fulfill, reject) {

    videoId = "36m1o-tM05g";
    var service = google.youtube('v3');
    service.commentThreads.list({
      key: API_KEY,
      part: 'snippet,replies',
      videoId: videoId,
    }, function (err, response) {
      if (err) {
        console.log('The API getComments returned an error: ' + err);
        reject(err);
        return;
      }
      fulfill(response);
    });
  });

};


// ============================================ //
// ============= CONVERT METHOD =============== //
// ============================================ //

module.exports = FacebookApi;
