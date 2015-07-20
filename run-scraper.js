/*!
 * Description:
 * Run this script to create the JSON data from basketball-reference.
 */
'use strict';

/***************************************************************
* Dependencies
***************************************************************/
var scraper = require('basketball-reference');
var async = require('async');
var fs = require('fs');
var format = require('util').format;


/***************************************************************
* Scrape and Save JSON
***************************************************************/
var DATA_DIR = 'public/data/';

var range = function(start, stop, step) {
  step = step || 1;
  var list = [];
  for (var i=start; i<=stop; i+=step) {
    list.push(i);
  }
  return list;
};

var sortByProperty = function(object, criteria) {
  return object.sort(function(left, right) {
    return (left[criteria] < right[criteria]) ? -1 :
           (left[criteria] > right[criteria]) ?  1 : 0;
  });
};

var checkCallback = function(callback, args) {
  if (callback && typeof(callback) === 'function') {
    callback.apply(args);
  }
};

var saveData = function(filename, data) {
  var filepath = DATA_DIR + filename;
  data = JSON.stringify(data, null, '');
  fs.writeFile(filepath, data, function(error) {
    if (error) {
      console.log(format('Could not save: %s', filepath));
    } else {
      console.log(format('Created: %s', filepath));
    }
  });
};

var saveDataSeries = function(standings, parameter) {
  // First save series data in associative array.
  var teams = {};
  standings.forEach(function(standing) {
    var year = standing.year;
    standing.standings.forEach(function(team) {
      // Create team associative array to store data.
      if (!teams.hasOwnProperty(team.id)) {
        teams[team.id] = [];
      }

      // Push series data in teams.
      teams[team.id].push([year, team[parameter]]);
    });
  });

  // Next format data for nvd3 series.
  var series = [];
  for (var team in teams) {
    if (teams.hasOwnProperty(team)) {
      series.push({
        'key': team,
        'values': teams[team]
      });
    }
  }

  // Lastly save the formatted data.
  var filename = 'standings_' + parameter + '.json';
  saveData(filename, series);
};

var saveLeagueStandings = function(startYear, endYear) {
  var standings = [];
  async.each(range(startYear, endYear),
    function(year, callback) {
      scraper.getLeagueStandings(year, function(data) {
        standings.push(data);
        checkCallback(callback);
      });
    }, function() {
      var sortedStandings = sortByProperty(standings, 'year');
      saveData('standings.json', sortedStandings);
    });
};


/***************************************************************
* Main Program
***************************************************************/
(function() {
  var start = parseInt(process.argv[2], 10);
  var end = parseInt(process.argv[3], 10);
  if (start && end) {
    console.log(format('Scraping league data for: %d - %d', start, end));
    saveLeagueStandings(start, end);
  } else {
    console.log('Please specify a start and end year.');
  }
})();
