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

var saveLeagueStandings = function(startYear, endYear) {
  var standings = [];
  async.each(range(startYear, endYear), function(year, cb) {
    scraper.getLeagueStandings(year, function(data) {
      standings.push(data);
      cb();
    });
    }, function() {
      saveData('nba-standings.json', sortByProperty(standings, 'year'));
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
