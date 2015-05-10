/*!
 * nba-seasonal-wins
 * MIT License (c) 2015
 * https://github.com/codenameyau/nba-seasonal-wins
 *
 * Description:
 * Run this nodejs script to scrape basketball-reference data.
 * It is nightmare to parse, but very efficient,
 */
'use strict';


/***************************************************************
* Dependencies
***************************************************************/
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');


/***************************************************************
* Globals
***************************************************************/
var SCRAPE_URL = 'http://www.basketball-reference.com/leagues/';


/***************************************************************
* Functions
***************************************************************/
var getURL = function(resource) {
  return SCRAPE_URL + resource;
};

var parseDivision = function($row) {
  return $row.find('.black_text')[0].children[0].data;
};

var parseTeamStanding = function($row, divison) {
  var teamStanding = {
    'wins': 0,
    'loses': 0,
    'win_lose_percent': 0.0,
    'games_behind': 0.0,
    'points_per_game': 0.0,
    'points_allowed': 0.0,
    'simple_rating_sysmte': 0.0,
  };
  debugger;
  $row.children().each(function(i, col) {

  });
};

var parseConference = function($, conference) {
  var currentDivision;
  var nbaTeams = [];
  $(conference).find('tbody tr').each(function(i, row) {
    var $row = $(row);

    // Table header for Division.
    if ($row.hasClass('partial_table')) {
      currentDivision = parseDivision($row);
    }

    // Table row for team standings.
    else if ($row.hasClass('full_table')) {
      nbaTeams.push(parseTeamStanding($row, currentDivision));
    }
  });
  return nbaTeams;
};

var parseStandings = function(body) {
  var teamData = [];
  var $ = cheerio.load(body);
  teamData.concat(parseConference($, '#E_standings'));
  // teamData.concat(parseConference($, '#W_standings'));
  return teamData;
};

var getRequestStandings = function(year) {
  var url = getURL(util.format('NBA_%d.html', year));

  // Scrape and parse the response data.
  request.get(url, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var data = parseStandings(body);
    }
  });
};


/***************************************************************
* Main Program
***************************************************************/
(function() {
  getRequestStandings(2013);
})();
