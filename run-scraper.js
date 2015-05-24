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

var saveData = function(filename, data) {
  var filepath = DATA_DIR + filename;
  fs.writeFile(filepath, data, function(error) {
    if (error) {
      console.log(format('[-] Could not save: %s', filepath));
    } else {
      console.log(format('[+] Created: %s', filepath));
    }
  });
};

var saveLeagueStandings = function(startYear, endYear) {
  async.each(range(startYear, endYear), function(year) {
    scraper.getLeagueStandings(year, function(data) {
      var filename = format('%s-%d.json', 'standings', year);
      saveData(filename, data);
    });
  });
};


/***************************************************************
* Main Program
***************************************************************/
(function() {
  var start = parseInt(process.argv[2], 10);
  var end = parseInt(process.argv[3], 10);
  if (start && end) {
    saveLeagueStandings(start, end);
  } else {
    console.log('Please specify a start and end year.');
  }
})();
