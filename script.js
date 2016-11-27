var filterSelection = {};
var sectionSelection = undefined;
var svgSelection = undefined;
// CONSTANTS
var SECTIONS = ['intro', 'les-causes'];
var all_data = 'change2017_full-extract_clean.csv';
var q1_data = 'question1.csv';

var chartConfig = {
    'width': 600,
    'height': 600,
    margin: {
      'top': 15,
      'right': 15,
      'left': 15,
      'bottom': 15
    }
  };

var updateBarChart = function(data, label, value) {
  var reverse = 1;
  if (!value) {
    value = 'value';
  }
  if (!label) {
    label = 'answer';
  }
  data.sort(function(a, b) {
    return reverse*(b[value] - a[value]);
  });

  var yScale = d3.scale.ordinal()
    .domain(d3.map(data, function(d){return d[label];}).keys())
    .rangeRoundBands([0, chartConfig.height], 0.1, 0.1);

  var xScale = d3.scale.linear()
    .domain(d3.extent(data, function(d){return d[value];}))
    .range([0, chartConfig.width]);

  svgSelection = d3
    .select("." + sectionSelection + " .chart")
    .attr('width', chartConfig.width)
    .attr('height', chartConfig.height);

  var selection = svgSelection
    .selectAll(".bar-group")
    .data(data);

  _selection = selection.enter()
    .append('g')
    .classed('bar-group', true);

  _selection
    .append('rect')
    .classed('bar', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', yScale.rangeBand())
    .attr('width', 0)
    .transition()
    .duration(600)
    .attr('y', function(d) {return yScale(d[label]);})
    .attr('width', function(d) {return xScale(d[value]);});

  selection
    .transition()
    .duration(600)
    .attr('y', function(d) {return yScale(d[label]);})
    .attr('width', function(d) {return xScale(d[value]);});

  selection.exit().remove();
}


function load(section) {
  sectionSelection = section;

  var bounds = d3.select("." + sectionSelection + " .chart-container")
    .node()
    .getBoundingClientRect()

  chartConfig.width = bounds.width;
  chartConfig.height = bounds.height;

  d3.csv(q1_data)
    .row(function(d) { return {answer: d.answer, value: +d.value}; })
    .get(function(error, data) {
      if (error) {
        console.error(error);
      };
      console.log(data);
      updateBarChart(data);
    });

}

function filter(letters, inverse) {
  selection
  .filter(function(d) {
    return inverse ?
      letters.indexOf(d.letter) === -1
    : letters.indexOf(d.letter) !== -1;
  })
  .attr("class", "exit")
  .transition()
  .duration(750)
  .style("opacity", 0)
  .style("width", "0px")
  .remove()
}

load('les-causes');
