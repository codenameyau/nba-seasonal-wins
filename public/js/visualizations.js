'use strict';

var shapeData = function(data) {
  var standings = {};
};

var generateChart = function(data) {
  var standings = shapeData(data);
  var chart = c3.generate({
    data: {
      columns: [
        ['spurs', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
  });
};

d3.json('../data/standings.json', function(error, data) {
  if (error) {
    console.log(error);
  } else {
    generateChart(data);
  }
});
