'use strict';

var chart = c3.generate({
    data: {
      url: '../data/standings_wins.json',
      type: 'line'
    }
});
