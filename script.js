var filterSelection = {};
var sectionSelection = undefined;
var svgSelection = undefined;

var all_data = 'change2017_full-extract_clean.csv';
var currentDataName = 'question0';
var currentData = [];
var totalData = [];
var chartConfig = {
    'width': 600,
    'height': 600,
    margin: {
      'top': 15,
      'right': 15,
      'left': 15,
      'bottom': 15
    },
    barHeight: 20,
    labelHeight: 20,
    labelPadding: 3,
    multiBarHeight: 8,
    multiBarPadding: 2,
    valueWidthThreshold: 50,
  };

var updateBarChart = function(data, label, value) {
  console.log('Update barchart', data, label, value);
  var reverse = 1;
  if (!value) {
    value = 'value';
  }
  if (!label) {
    label = 'answer';
  }
  // console.log(data[0]);
  data.sort(function(a, b) {
    return reverse*(b[value] - a[value]);
  });
  console.log(data[0]);
  var totalHeight = data.length * (chartConfig.barHeight + chartConfig.labelHeight);

  var yScale = d3.scale.ordinal()
    .domain(d3.map(data, function(d){return d[label];}).keys())
    .rangeRoundBands([0, totalHeight]);

  var xScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d[value];})])
    .range([0, chartConfig.width]);

  var svgSelection = d3
    .select(".chart")
    .attr('width', chartConfig.width)
    .attr('height', totalHeight);

  var selection = svgSelection
    .selectAll(".bar-group")
    .data(data, function(d){return d[label];});

  _selection = selection.enter()
    .append('g')
    .classed('bar-group', true);

  /*
  * BARS
  */
  _selection
    .append('rect')
    .classed('bar', true)
    .attr('x', 0)
    .attr('y', chartConfig.labelHeight)
    .attr('height', chartConfig.barHeight)
    .attr('width', 0)
    .transition()
    .duration(600)
    .attr('y', function(d) {return chartConfig.labelHeight + yScale(d[label]);})
    .attr('width', function(d) {return xScale(d[value]);});

  selection
    .select('.bar')
    .transition()
    .duration(600)
    .attr('width', function(d) {return xScale(d[value]);})
    .transition()
    .duration(600)
    .delay(600)
    .attr('y', function(d) {return chartConfig.labelHeight + yScale(d[label]);})

  /*
  * LABELS
  */
  _selection
    .append('text')
    .classed('bar-label', true)
    .attr('x', 0)
    .attr('y', chartConfig.labelHeight)
    .text(function(d) {
      return d[label]
    })
    .style('opacity', 0)
    .transition()
    .duration(600)
    .delay(600)
    .style('opacity', 1)
    .attr('y', function(d) {return chartConfig.labelHeight + yScale(d[label]) - chartConfig.labelPadding;});

  selection
    .select('.bar-label')
    .transition()
    .duration(600)
    .delay(600)
    .style('opacity', 1)
    .attr('y', function(d) {return chartConfig.labelHeight + yScale(d[label]) - chartConfig.labelPadding;});

  /*
  * VALUES
  */
  _selection
    .append('text')
    .classed('bar-value', true)
    .classed('bar-value--small', function(d){
      return xScale(d[value]) < chartConfig.valueWidthThreshold
    })
    .attr('x', 0)
    .attr('y', chartConfig.labelHeight + chartConfig.barHeight)
    .text(function(d) {
      return d3.format('.1%')(d[value]);
    })
    .transition()
    .duration(600)
    .attr('x', function(d) {return xScale(d[value]);})
    .transition()
    .delay(600)
    .duration(600)
    .attr('y', function(d) {return chartConfig.labelHeight + chartConfig.barHeight + yScale(d[label]);})

  selection
    .select('.bar-value')
    .classed('bar-value--small', function(d){
      return xScale(d[value]) < chartConfig.valueWidthThreshold
    })
    .text(function(d) {
      return d3.format('.1%')(d[value]);
    })
    .transition()
    .duration(600)
    .attr('x', function(d) {return xScale(d[value]);})
    .transition()
    .delay(600)
    .duration(600)
    .attr('y', function(d) {return chartConfig.labelHeight + chartConfig.barHeight + yScale(d[label]);})



  selection.exit().remove();
}

var updateMultiBarChart = function(data, group, label, value) {
  var reverse = 1;
  if (!value) {
    value = 'value';
  }
  if (!label) {
    label = 'answer';
  }

  var xScale = d3.scale.linear()
    .domain(d3.extent(data, function(d){return d[value];}))
    .range([0, chartConfig.width]);

  data = d3.nest()
    .key(function(d) { return d[label]; })
    .entries(data);

  var numGroupBars = data[0].values.length;

  // data.sort(function(a, b) {
  //   return reverse*(b[value] - a[value]);
  // });
  var groupHeight = chartConfig.labelHeight + numGroupBars * (chartConfig.multiBarHeight + chartConfig.multiBarPadding);

  var totalHeight = data.length * groupHeight;

  var yScale = d3.scale.ordinal()
    .domain(d3.map(data, function(d){return d.key;}).keys())
    .rangeRoundBands([0, totalHeight]);

  var groupScale = d3.scale.ordinal()
    .domain(d3.map(data[0].values, function(d){return d[group];}).keys())
    .rangeRoundBands([0, groupHeight - chartConfig.labelHeight]);


  var svgSelection = d3
    .select(".chart")
    .attr('width', chartConfig.width)
    .attr('height', totalHeight);

  var selection = svgSelection
    .selectAll(".bar-group")
    .data(data, function(d){return d.key;});

  /*
  * GROUPS
  */
  _selection = selection.enter()
    .append('g')
    .classed('bar-group', true)

  _selection
    .transition()
    .duration(600)
    .attr("transform", function(d) { return "translate(0," + yScale(d.key) + ")" });

  selection
    .transition()
    .duration(600)
    .attr("transform", function(d) { return "translate(0," + yScale(d.key) + ")" });

  /*
  * BARS
  */
  var bars = _selection
    .selectAll('.bar');

  bars
    .data(function(d) {return d.values})
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('x', 0)
    .attr('y', chartConfig.labelHeight)
    .attr('height', chartConfig.multiBarHeight)
    .attr('width', 0)
    .attr('data-group', function(d){return d[group];})
    .transition()
    .duration(600)
    .attr('y', function(d) {
      console.log(d[group],groupScale(d[group]));
      return chartConfig.labelHeight + groupScale(d[group]);
    })
    .attr('width', function(d) {return xScale(d[value]);});

  bars
    .transition()
    .duration(600)
    .attr('y', function(d) {return chartConfig.labelHeight + groupScale(d[group]);})
    .attr('width', function(d) {return xScale(d[value]);});

  /*
  * BAR LABELS
  */
  var labels = _selection
    .selectAll('.group-bar-label');

  labels
    .data(function(d) {return d.values})
    .enter()
    .append('text')
    .classed('group-bar-label', true)
    .attr('x', 0)
    .attr('y', chartConfig.labelHeight)
    .attr('width', 0)
    .attr('data-group', function(d){return d[group];})
    .transition()
    .duration(600)
    .attr('y', function(d) {
      return chartConfig.labelHeight + groupScale(d[group]);
    })

  labels
    .transition()
    .duration(600)
    .attr('y', function(d) {return chartConfig.labelHeight + groupScale(d[group]);})

  selection.exit().remove();
}

function fillInfoSegment(segment) {
  var info = '';
  if (segment) {
    info = "<div class='info-segment__label'>Catégorie : "+ segment.label +"</div>"
    info += "<div class='info-segment__question'>Question posée : <i>"+ segment.question +"</i></div>"
  }
  d3.select('.info-segment')
    .html(info)
}

function fillQuestion(indexQuestion) {
  if (indexQuestion == undefined) {
    d3.select('.question-label')
      .html("");
    return;
  }
  d3.select('.question-label')
    .html("Question : " + QUESTIONS[indexQuestion].text);
}

function filterDataBy(segment, segmentSelector) {
  filtered = currentData.filter(function(d) {
    return d[segmentSelector] == segment
  });
  updateBarChart(filtered);
}

function chooseSegment(nestedData, group) {
  var segments = d3.select('.choose-segment')
    .selectAll('.segment')
    .data(d3.map(nestedData[0].values, function(d){return d[group];}).keys());

  segments.enter()
    .append('div')
    .classed('segment', true)
    .html(function(d){return d;})
    .on('click', function(d){
      filterDataBy(d, group);
    });

  segments
    .html(function(d){return d;})
    .on('click', function(d){
      filterDataBy(d, group);
    });

  segments.exit().remove();

}

function segmentBy(category) {
  // Get csv data
  d3.csv(currentDataName + '-' + category + '.csv')
    .row(function(d) {
      var _d = {
        answer: d.answer,
        value: +d.value,
        total: +d.total
      };
      _d[category] = d[category];
      return _d;
    })
    .get(function(error, data) {
      if (error) {
        console.error(error);
      };
      console.log(data);
      currentData = data;
      nestedData = d3.nest()
        .key(function(d) { return d['answer']; })
        .entries(data);

      chooseSegment(nestedData, category);
      fillInfoSegment(SEGMENTS.filter(function(d){return d.id == category})[0]);
      updateBarChart(totalData);

      // updateMultiBarChart(data, category);
    });
  // Update
}

function loadQuestion(indexQuestion) {
  currentDataName = 'question' + indexQuestion;
  // Hide home message
  d3.select('.intro').classed('u-hidden', true);
  d3.select(".chart-section").classed("u-hidden", false);
  // update container bounds?
  var bounds = d3.select(".chart-container")
    .node()
    .getBoundingClientRect()

  chartConfig.width = bounds.width;
  chartConfig.height = bounds.height;

  // Update infos
  fillInfoSegment();
  fillQuestion(indexQuestion);
  d3.csv(currentDataName + '.csv')
    .row(function(d) { return {answer: d.answer, value: +d.value}; })
    .get(function(error, data) {
      if (error) {
        console.error(error);
      };
      console.log(data);
      totalData = data;
      updateBarChart(data);
    });
}

function init(){
  d3.select(".chart-section").classed("u-hidden", true);
  // Init QUESTIONS
  d3.select(".menu-question-list")
    .selectAll(".menu-question-item")
    .data(QUESTIONS)
    .enter()
    .append('li')
    .classed('menu-question-item', true)
    .html(function(q){
      return q.text
    })
    .on('click', function(d, i){loadQuestion(i)});

}
init();
