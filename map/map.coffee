---
---
departementFeaturesData = undefined
d3.json 'map/departements-details.json', (req, json) ->
  departementFeaturesData = json.features


DepartementsMap = (DOMElement, config) ->
  svgSelection = d3.select DOMElement

  COMPONENT_CLASS = 'departements-map'

  MAP_CLASS = "#{COMPONENT_CLASS}__map"
  FEATURE_CLASS = "#{COMPONENT_CLASS}__feature"
  MISSING_CLASS = "#{FEATURE_CLASS}--missing"
  IDF_CLASS = "#{FEATURE_CLASS}--idf"

  LEGEND_CLASS = "#{COMPONENT_CLASS}__legend"

  SELECTION_CLASS = "#{COMPONENT_CLASS}__selection"
  SELECTION_BG_CLASS = "#{SELECTION_CLASS}-bg"
  SELECTION_DEPT_CLASS = "#{SELECTION_CLASS}-departement"
  SELECTION_VALUE_CLASS = "#{SELECTION_CLASS}-value"
  SELECTION_COLOR_CLASS = "#{SELECTION_CLASS}-color"

  margins =
    top: 30
    bottom: 30
    left: 20
    right: 20

  legendHeight = 100
  legendWidth = $(DOMElement).width() / 4

  percentageFormatter = d3.format '.1%'

  mapSelection = svgSelection.append 'g'
  .classed MAP_CLASS, true
  .attr 'transform', "translate(0, #{legendHeight})"

  selectionSelection = svgSelection.append 'g'
  .classed SELECTION_CLASS, true
  .attr 'transform', "translate(#{margins.left}, #{margins.top})"

  legendSelection = svgSelection.append 'g'
  .classed LEGEND_CLASS, true

  selectionSelection.append 'text'
  .classed SELECTION_DEPT_CLASS, true

  selectionSelection.append 'rect'
  .classed SELECTION_COLOR_CLASS, true
  .attr
    x: -15
    y: -15
    width: 8
    height: 20

  selectionSelection.append 'text'
  .attr 'dy', '1.5em'
  .classed SELECTION_VALUE_CLASS, true

  lastSelection = undefined
  _updateSelection = (newSelection) ->
    unless newSelection
      selectionSelection.select ".#{SELECTION_DEPT_CLASS}"
      .text 'Sélectionnez un département...'

      selectionSelection.select ".#{SELECTION_VALUE_CLASS}"
      .text ''

      selectionSelection.select ".#{SELECTION_COLOR_CLASS}"
      .style 'fill', 'transparent'

    else
      selectionSelection.select ".#{SELECTION_DEPT_CLASS}"
      .text newSelection.departementName

      selectionSelection.select ".#{SELECTION_VALUE_CLASS}"
      .text "#{percentageFormatter newSelection.value} #{config.valueText}"

      selectionSelection.select ".#{SELECTION_COLOR_CLASS}"
      .style 'fill', newSelection.color

    lastSelection = newSelection

  _updateSelection()

  projection = d3.geo.conicConformal()
  .center [2.454071, 47.279229]
  .scale 3500
  .translate [$(DOMElement).width() / 2 , $(DOMElement).height() / 2 - 150]

  path = d3.geo.path()
  .projection projection

  features = mapSelection
  .append 'g'
  .selectAll ".#{FEATURE_CLASS}"
  .data departementFeaturesData

  newFeatures = features.enter()
  .append 'path'
  .classed FEATURE_CLASS, true
  .attr 'd', path
  .attr 'opacity', 0
  .transition()
  .delay (d, i) -> 10 * i
  .attr 'opacity', 1

  departementList = _.map departementFeaturesData, (d) -> d.properties.CODE_DEPT

  # Draw IDF
  idfFeaturesData = _.filter departementFeaturesData, (d) ->
    _.includes ["75", "92", "94", "93"], d.properties.CODE_DEPT

  centroid = path.centroid idfFeaturesData[0]
  bbox = path.bounds idfFeaturesData[0]
  if window.innerWidth < 767
    idfSize = 80
    idfOffset = left: 300, top: -100
  else
    idfSize = 120
    idfOffset = left: 50, top: 300

  idfX = centroid[0]
  idfY = centroid[1]
  idfK = (idfSize/2)/(bbox[1][0] - bbox[0][0])

  trStr = "translate(" + idfSize / 2 + "," + idfSize / 2 + ")" +
    "scale(" + idfK + ")translate(" + -idfX + "," + -idfY + ")";
  idfFeatures = mapSelection
  .append 'g'
  .attr 'transform', 'translate('+idfOffset.left+','+idfOffset.top+')'
  .append 'g'
  .attr 'transform', trStr

  idfFeatures.selectAll ".#{FEATURE_CLASS}#{IDF_CLASS}"
  .data idfFeaturesData
  .enter()
  .append 'path'
  .classed FEATURE_CLASS, true
  .classed IDF_CLASS, true
  .attr 'd', path

  _computeScale = (data) ->
    accentColor = d3.rgb 234, 46, 46
    baseColor = d3.rgb '#dddddd'

    colorInterpolator = d3.scale.linear()
      .domain [0, 3]
      .range [baseColor, accentColor]

    dataExtent = d3.extent _.map data, config.value
    colorScale = d3.scale.quantile()
      .domain d3.extent _.map data, config.value
      .range _.map d3.range(4), colorInterpolator

    colorRects = legendSelection.selectAll 'rect'
    .data _.zip colorScale.domain(), colorScale.range()

    colorRects.enter()
    .append 'rect'
    .attr 'x', (d, i) -> i * 70
    .attr 'width', 70
    .attr 'height', 4

    colorRects
    .attr 'fill', (d) -> d[1].toString()

    colorRects.exit().remove()

    thresholdsData = _.concat dataExtent[0], colorScale.quantiles(), dataExtent[1]
    thresholds = legendSelection.selectAll 'text'
    .data thresholdsData

    thresholds.enter()
    .append 'text'
    .attr 'x', (d, i) -> i * 70
    .attr 'y', 8
    .attr 'dy', '1em'
    .style 'text-anchor', 'middle'

    thresholds
    .text (d) -> percentageFormatter d

    thresholds.exit().remove()

    legendSelection
    .attr 'transform', "translate(#{($(DOMElement).width() - margins.right - thresholdsData.length / 2 * 70 )/ 2}, #{$(DOMElement).height() - margins.bottom})"

    colorScale

  _hasData = (d) -> d.data?

  departementsMap = (data) ->
    data = _.filter data, (d) ->
      _.includes departementList, config.departement d
    scale = _computeScale data

    colorAccessor = (d) ->
      if _hasData d
        (scale config.value d.data).toString()
      else
        ''

    mapSelection.selectAll ".#{FEATURE_CLASS}"
    .each (d) ->
      d.data = _.find data, (dd) ->
        d.properties.CODE_DEPT is config.departement dd
    .classed MISSING_CLASS, (d) -> not _hasData d
    .style 'fill', colorAccessor
    .on 'click', (d) -> _updateSelection
      departement: config.departement d.data
      departementName: d.properties.NOM_DEPT
      value: config.value d.data
      color: colorAccessor d

    if lastSelection
      newSelection = _.find data, (d) ->
        lastSelection?.departement is config.departement d

      if newSelection and config.value newSelection
        lastSelection.value = config.value newSelection
        lastSelection.color = colorAccessor data: newSelection
        _updateSelection lastSelection
      else _updateSelection()


window.DepartementsMap = DepartementsMap
