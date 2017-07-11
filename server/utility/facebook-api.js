/* eslint-disable promise/param-names */
/* eslint-disable strict */

var fbGraph = require('fbgraph');
var logger = require('./logger');

var CLIENT_ID = '113106169105867';
var CLIENT_SECRET = 'd436a7c8422e37a7a273566ce850f1bb';
var CLIENT_REDIRECT = '/facebook/auth';

// Some API need authentication

function FacebookApi () {
  this.token = '';
  this.user = '';
}

FacebookApi.prototype.requestOAuth = function (baseUrl) {
  var redirectUrl = baseUrl + CLIENT_REDIRECT;
  return fbGraph.getOauthUrl({
    'client_id':    CLIENT_ID,
    'redirect_uri': redirectUrl
  });
};

FacebookApi.prototype.verifyOAth = function (baseUrl, authenCode) {
  var redirectUrl = baseUrl + CLIENT_REDIRECT;

  return new Promise(function (fulfill, reject) {
    fbGraph.authorize({
      'client_id':     CLIENT_ID,
      'redirect_uri':  redirectUrl,
      'client_secret': CLIENT_SECRET,
      'code':          authenCode
    }, function (err, response) {
      // Store to database
      logger.debug(response);
      if (err) {
        logger.error(err);
        reject(err);
        return;
      }
      fulfill(response);
    });
  });
};

FacebookApi.prototype.setToken = function (user, token) {
  this.token = token;
};

FacebookApi.prototype.getSelfInfo = function (token) {
  return new Promise(function (fulfill, reject) {
    fbGraph.get('/me?access_token=' + token, function (err, res) {
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

};

FacebookApi.prototype.getFriends = function (auth, searchText, nextToken) {

};

FacebookApi.prototype.searchPost = function (auth, searchText, nextToken) {

};

FacebookApi.prototype.getComments = function (videoId) {

};

// ============================================ //
// ============= CONVERT METHOD =============== //
// ============================================ //

// End and exports
module.exports = FacebookApi;
