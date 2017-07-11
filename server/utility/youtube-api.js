/* eslint-disable promise/param-names */
/* eslint-disable strict */

let fs = require('fs');
let readline = require('readline');
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let logger = require('./logger');

let API_KEY = 'AIzaSyAPck9T0HWtOh2eaVT7s2mtVAuw_rpY8a0';
let OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];
let CLIENT_ID = '871697944833-nc91lsthdjii1io8ctqviavimftro1kt.apps.googleusercontent.com';
let CLIENT_SECRET = 'A-A4ZsIzmxJkxPmRl9dzm5EW';
let CLIENT_REDIRECT = '/youtube/auth';

let PATH_TO_PRIVATE = '../private/';

// Some API need authentication

function YoutubeApi() {
    this.token = '';
    this.user = '';
    // Start read client secret from file
    // this.credential = JSON.parse(fs.readFileSync(PATH_TO_PRIVATE + 'google_client_secret.json'));
}

YoutubeApi.prototype.requestOAuth = function (baseUrl) {
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        baseUrl + CLIENT_REDIRECT
    );

    let url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: OAUTH2_SCOPES

        // Optional property that passes state parameters to redirect URI
        // state: { foo: 'bar' }
    });

    return url;
};

YoutubeApi.prototype.verifyOAth = function (baseUrl, authenCode) {
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        baseUrl + CLIENT_REDIRECT
    );

    return new Promise(function (fulfill, reject) {
        oauth2Client.getToken(authenCode, function (err, tokens) {
            // Store to database
            logger.debug(tokens);
            if (err) {
                logger.error(err);
                reject(err);
                return;
            }
            fulfill(tokens);
        });
    });
};

YoutubeApi.prototype.getChannel = function (authenCode) {

    let OAuth2 = google.auth.OAuth2;
    let oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET
    );
    oauth2Client.setCredentials(authenCode);

    return new Promise(function (fulfill, reject) {

        let service = google.youtube('v3');
        service.channels.list({
            auth: oauth2Client,
            mine: 'true',
            part: 'snippet,contentDetails,statistics'
        }, function (err, response) {
            if (err) {
                logger.error(['The API channels.list error ', err]);
                reject(err);
                return;
            }
            if (Array.isArray(response.items) && response.items.length > 0) {
                fulfill(convertChannel(response.items[0]));
            } else {
                fulfill({});
            }
        });
    });
};

YoutubeApi.prototype.searchVideo = function (auth, searchText, nextToken) {
    return new Promise(function (fulfill, reject) {
        let service = google.youtube('v3');
        service.search.list({
            key: API_KEY,
            maxResults: 25,
            part: 'snippet',
            q: searchText,
            type: ''
        }, function (err, response) {
            if (err) {
                logger.error(err);
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
        videoId = '36m1o-tM05g';
        let service = google.youtube('v3');
        service.commentThreads.list({
            key: API_KEY,
            part: 'snippet,replies',
            videoId: videoId
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

function convertChannel (channelData) {
    var convertData = {};
    convertData.id           = channelData.id;
    convertData.channelName  = channelData.snippet.title;
    convertData.description  = channelData.snippet.description;
    convertData.publishedAt  = channelData.snippet.publishedAt;
    convertData.thumbnails   = channelData.snippet.thumbnails;
    convertData.commentCount = channelData.statistics.commentCount;
    convertData.videoCount   = channelData.statistics.videoCount;
    convertData.viewCount    = channelData.statistics.viewCount;
    return convertData;
}

function convertVideos (rawVideoList) {
    var convertData = {};
    return convertData;
}

function convertComments (rawCommentList) {
    var convertData = {};
    return convertData;
}

// Exports
module.exports = YoutubeApi;
