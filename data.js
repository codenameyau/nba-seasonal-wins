/*!
 * nba-seasonal-wins
 * MIT License (c) 2015
 * https://github.com/codenameyau/nba-seasonal-wins
 *
 * Description:
 * Run this nodejs script to grab and clean the seasonal team data.
 */
'use strict';


/***************************************************************
* Dependencies
***************************************************************/
var request = require('request');


/***************************************************************
* Globals
***************************************************************/
var API_ENDPOINT = 'https://erikberg.com/nba/team-stats/';
var API_FORMAT = '.json';

// Create an environment variable with your API key.
var ACCESS_KEY = process.env.XMLSTATS_API_KEY;
var USER_AGENT = 'NBAStatsBot/6.9';


/***************************************************************
* Functions
***************************************************************/
var getUrl = function(resource) {
  return API_ENDPOINT + resource + API_FORMAT;
};

var getOptions = function(resourceURL) {
  return {
    url: resourceURL,
    headers: {
      'Authorization': 'Bearer ' + ACCESS_KEY,
      'User-Agent': USER_AGENT
    }
  };
};

var requestGetStandings = function() {
  var resource = 'standings';
  var options = getOptions(getUrl(resource));

  // On hiatus until I get an API KEY.
  request.get(options, function(err, res) {
    console.log(res);
    if (!err && res.statusCode === 200) {
      console.log('Yay!');
    }
  });
};

requestGetStandings();
