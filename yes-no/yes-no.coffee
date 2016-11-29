---
---

# YesNoChart = (DOMElement, accessors) ->
#
#
#
# d3.csv 'yes-no.csv', (err, data) ->
#   YesNoChart d3.select('#yes-no').node(), data

selection = d3.select '#yes-no'

config =
  label: (d) -> d.label
  value: (d) -> d.value
  sentiments: [
    label: 'Non pas du tout'
    sentiment: 'very-negative'
  ,
    label: 'Non pas complètement'
    sentiment: 'quite-negative'
  ,
    label: 'Oui plutôt'
    sentiment: 'quite-positive'
  ,
    label: 'Oui complètement'
    sentiment: 'very-positive'
  ]
  divider: before: 'Oui plutôt'

COMPONENT_CLASS = 'yes-no'
GROUP_CLASS = "#{COMPONENT_CLASS}__group"
LABEL_CLASS = "#{COMPONENT_CLASS}__label"
BAR_CLASS = "#{COMPONENT_CLASS}__bar"
VALUE_CLASS = "#{COMPONENT_CLASS}__value"
DIVIDER_CLASS = "#{COMPONENT_CLASS}__divider"

margins =
  top: 30
  bottom: 30
  left: 10
  right: 10

barHeight = 50

_computeScales = (element, data) ->
  total = _ data
    .map config.value
    .sum()

  percentageScale = d3.scale.linear()
    .domain [0, total]
    .range [0, 1]

  widthScale = percentageScale.copy()
    .range [margins.left, $(element).width() - margins.right]

  percentage: percentageScale
  width: widthScale

stackedLayout = d3.layout.stack()
  .values (d) -> d.values
percentageFormatter = d3.format '.1%'

d3.csv '../question5.csv', (d) ->
  label: d.answer
  value: +d.value
, (err, data) ->
  scales = _computeScales selection.node(), data

  layeredData = _ data
  .map (d) ->
    label: config.label d
    value: config.value d
    values: [
      x: 0
      y: config.value d
    ]
  .sortBy (d) -> _.indexOf (_.map config.sentiments, (e) -> e.label), d.label
  .value()
  stackedData = stackedLayout layeredData

  groups = selection.selectAll ".#{GROUP_CLASS}"
  .data stackedData, (d) -> d.label

  newGroups = groups.enter()
  .append 'g'
  .classed GROUP_CLASS, true
  .attr 'data-sentiment', (d) ->
    (_.find config.sentiments, (e) -> e.label is d.label).sentiment

  newGroups.append 'text'
  .classed LABEL_CLASS, true
  .text (d) -> d.label
  .attr 'y', 20

  newGroups.append 'text'
  .classed VALUE_CLASS, true
  .text (d) -> percentageFormatter d.value
  .attr 'y', 50 + barHeight + 20

  newGroups.append 'rect'
  .classed BAR_CLASS, true
  .attr 'height', barHeight
  .attr 'y', 50

  groups
  .attr 'transform', (d) -> "translate(#{scales.width d.values[0].y0}, 0)"

  groups.selectAll ".#{BAR_CLASS}"
  .attr 'width', (d) -> scales.width d.value

  divider = selection.selectAll ".#{DIVIDER_CLASS}"
  .data [_.find layeredData, (d) -> config.divider.before is d.label], (d) -> d.label

  divider.enter()
  .append 'line'
  .classed DIVIDER_CLASS, true

  divider
  .attr 'x1', (d) -> scales.width d.values[0].y0
  .attr 'y1', 50 - 10
  .attr 'x2', (d) -> scales.width d.values[0].y0
  .attr 'y2', 50 + barHeight + 10
