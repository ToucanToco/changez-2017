var filterSelection = {};
var sectionSelector = undefined;
var svgSelection = undefined;
var currentQuestion = undefined;
var currentQuestionIndex = 0;

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

function updateWordCloud(data, clear, label, value) {

  if (!!clear) {
    d3.selectAll(".chart *").remove();
  }
  if (!value) {
    value = 'value';
  }
  if (!label) {
    label = 'answer';
  }
  // debugger

  _data = data
    .filter(function(d){
      return d[label] != 'notaword'
    })
    .sortBy(value, true)
    .slice(0,50);

  var color = d3.scale.category20()
    .domain(_data.slice(0,20).map(function(d){return d[label];}));

  // var sizeScale = d3.scale.linear()
  //   .range([0, 100])
  //   .domain([0, d3.max(_data.map(function(d){return d[value];}))]);
  var sizeScale = d3.scale.log()
  //   .base(10)
    .range([2, 100])
    .domain([d3.min(_data.map(function(d){return d[value];})), d3.max(_data.map(function(d){return d[value];}))]);

  d3.select(".chart")
    .attr('width', chartConfig.width)
    .attr('height', chartConfig.height);

  d3.layout.cloud()
    .size([chartConfig.width -20, chartConfig.height - 30])
    .words(_data)
    .spiral('archimedean')
    .padding(5)
    .rotate(function() { return Math.round(Math.random() - 0.4) * 90; })
    .fontSize(function(d) { return sizeScale(d[value]); })
    .on("end", draw)
    .start();

    function draw(words) {
      if (!d3.select(".wordcloud").node()) {
        console.log('creating wordcloud')
        d3.select(".chart")
          .append("g")
          .classed("wordcloud", true)
          .classed('text-group', true)
          .attr("transform", "translate(" + chartConfig.width/2 + "," + chartConfig.height/2 + ")");
      }
      var text = d3.select(".text-group")
        .selectAll(".wordcloud-text")
        .data(words);

      text
        .enter()
        .append("text")
        .classed("wordcloud-text", true)
        .style("font-size", (function(d) { return sizeScale(d[value]) + 'px'; }))
        .style("fill", function(d, i) { return color(i); })
        .attr("transform", function(d) {
            return "translate(0,0)rotate(0)";
        })
        .text(function(d) { return d.answer; })
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })

      text
        .transition()
        .duration(1000)
        .style("font-size", (function(d) { return sizeScale(d[value]) + 'px'; }))
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        });

      text.exit().remove();
  }
}

var updateBarChart = function(data, clear, label, value) {
  var reverse = 1;
  if (!value) {
    value = 'value';
  }
  if (!label) {
    label = 'answer';
  }
  console.log('Update barchart', data, label, value);
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

  if (!!clear) {
    d3.select(".chart > *").remove();
  }

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
function updateChartType(data, type, clear) {
  if (type == 'leaderboard') {
    updateBarChart(data, clear);
  } else {
    updateWordCloud(data, clear);
  }

}
function fillInfoSegment(segment, section) {
  var info = '';
  if (segment) {
    info = "<div class='info-segment__label'>Catégorie : "+ segment.label +"</div>"
    info += "<div class='info-segment__question'>Question posée : <i>"+ segment.question +"</i></div>"
  }
  d3.select(section + ' .info-segment')
    .html(info)
}

function fillQuestion(indexQuestion, section) {
  if (indexQuestion == undefined) {
    d3.select(section + ' .question-label')
      .html("");
    return;
  }
  d3.select(section + ' .question-label')
    .html(QUESTIONS[indexQuestion].text);
}

function filterDataBy(segment, segmentSelector) {
  d3.selectAll('.segment')
    .classed('selected', false)
    .filter(function() {
      return segment == d3.select(this).attr('data-segment')
    })
    .classed('selected', true);

  filtered = currentData.filter(function(d) {
    return d[segmentSelector] == segment
  });

  updateChartType(filtered, currentQuestion.type)
  // updateBarChart(filtered);
}

function chooseSegment(data, group) {
  d3.select(sectionSelector + ' .choose-segment *').remove();
  d3.select(sectionSelector + ' .choose-segment').html('');
  if (!data) {
    d3.select(sectionSelector + ' .choose-segment')
    .html("Cliquez sur l'un des boutons de catégorie au dessus pour filtrer les données")
    return;
  }
  var uniques = data.unique(function(d){
    return d[group]
  }).map(function(d){
    return d[group]
  })


  var segments = d3.select(sectionSelector + ' .choose-segment')
    .selectAll('.segment')
    .data(uniques)
    // .data(d3.map(nestedData[0].values, function(d){return d[group];}).keys());

  segments.enter()
    .append('div')
    .classed('segment', true)
    .attr('data-segment', function(d){return d;})
    .html(function(d){return d;})
    .on('click', function(d){
      filterDataBy(d, group);
    });

  segments
    .attr('data-segment', function(d){return d;})
    .html(function(d){return d;})
    .on('click', function(d){
      filterDataBy(d, group);
    });

  segments.exit().remove();

}

function segmentBy(category) {
  d3.selectAll('.segment-controls span')
    .classed('selected', false)
    .filter(function(){
      return category == d3.select(this).attr('data-segment');
    })
    .classed('selected', true);

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
      // nestedData = d3.nest()
      //   .key(function(d) { return d['answer']; })
      //   .entries(data);
      // console.log('nested', nestedData, category);

      chooseSegment(data, category);
      fillInfoSegment(SEGMENTS.filter(function(d){return d.id == category})[0], sectionSelector);
      updateChartType(totalData, currentQuestion.type);
      // updateBarChart(totalData);
      // updateMultiBarChart(data, category);
    });
  // Update
}

function loadQuestion(indexQuestion) {
  console.log('Loading quesiton ' + indexQuestion)
  currentDataName = 'question' + indexQuestion;
  currentQuestion = QUESTIONS[indexQuestion];
  currentQuestionIndex = indexQuestion;
  sectionSelector = ".chart-section.chart-section--" + currentQuestion.type
  // Hide home message
  d3.select('.intro').classed('u-hidden', true);
  d3.selectAll(".chart-section").classed("u-hidden", true);
  d3.select(".chart-section.chart-section--" + currentQuestion.type)
    .classed("u-hidden", false);
  // update container bounds?
  var bounds = d3.select(".chart-container")
    .node()
    .getBoundingClientRect()

  chartConfig.width = bounds.width;
  chartConfig.height = window.innerHeight*0.8;

  // Update infos
  chooseSegment(undefined, sectionSelector);
  fillInfoSegment(undefined, sectionSelector);
  fillQuestion(indexQuestion, sectionSelector);
  d3.csv(currentDataName + '.csv')
    .row(function(d) { return {answer: d.answer, value: +d.value}; })
    .get(function(error, data) {
      if (error) {
        console.error(error);
      };
      console.log(data);
      totalData = data;
      updateChartType(data, currentQuestion.type, true)
    });
}

function getMyGroupData(data, filters) {
  filteredData = data
    .filter(function(d){
      var hasValues = false;
      var keepValue = true;
      filters.map(function(v, k) {
        if (d[k]) {
          hasValues = true;
          if (d[k] != v) {
            keepValue = false;
          }
        }
      })
      return hasValues && keepValue
    });
  // console.log(filteredData);
  return filteredData;
}

// function loadQuestionAggregates(qIndex, value) {
//   if (!value) {
//     value = 'value';
//   }
//   d3.csv('q' + qIndex + '-aggregate.csv')
//     .row(function(d) {
//       d[value] = +d[value];
//       return d;
//     })
//     .get(function(error, data) {
//       if (error) {
//         console.error(error);
//       };
//       console.log(data);
//       totalData = data;
//       //
//       filterSelection = {
//         'age': '16- 20',
//         'sexe': 'Une femme',
//         'tendance': 'Centre'
//       }
//       //
//       _data = getMyGroupData(data, filterSelection);
//       updateBarChart(_data);
//     });
// }

function init(){
  Sugar.extend({
    objectPrototype: true
  });
  d3.selectAll(".chart-section").classed("u-hidden", true);
  // Init QUESTIONS
  nestedMenu = d3.nest()
    .key(function(d) { return d.theme; })
    .entries(QUESTIONS);

  var li = d3.select(".menu-question-list")
    .selectAll(".menu-question-theme")
    .data(nestedMenu);

  var _li = li
    .enter()
    .append('li')
    .classed('menu-question-theme', true)
    .attr('data-theme', function(d){return d.key;});

  _li
    .append('div')
    .classed('menu-question-theme--label', true)
    .html(function(q){
      console.log(q);
      return THEMES[q.key];
    });

  _li
    .selectAll('.menu-question-item')
    .data(function(d){return d.values})
    .enter()
    .append('div')
    .classed('menu-question-item', true)
    .html(function(q){
      return q.text
    })
    .on('click', function(d, i){loadQuestion(i)});


  //
  // loadQuestionAggregates(0);
}
init();

function next() {
  newIndex = currentQuestionIndex + 1;
  if (newIndex >= QUESTIONS.length) {
    newIndex = 0;
  }
  loadQuestion(newIndex);
}
function previous() {
  newIndex = currentQuestionIndex - 1;
  if (newIndex < 0) {
    newIndex = QUESTIONS.length - 1;
  }
  loadQuestion(newIndex);
}
function toggleMenu(mustOpen) {
  console.log(mustOpen);
  if (mustOpen == undefined) {
    mustOpen = !d3.select('.nav-menu')
    .classed('nav-menu--open');
  }

  d3.select('.nav-menu')
    .classed('nav-menu--open', mustOpen);
  d3.select('.menu-overlay')
    .classed('menu-overlay--open', mustOpen);

  this.event.preventDefault();
}
