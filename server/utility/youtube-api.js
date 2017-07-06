var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var API_KEY = "AIzaSyAPck9T0HWtOh2eaVT7s2mtVAuw_rpY8a0";

// Some API need authentication

function YoutubeApi() {

};

YoutubeApi.prototype.searchVideo = function (auth, searchText, nextToken) {

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

YoutubeApi.prototype.getComments = function (videoId) {

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

module.exports = YoutubeApi;
