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
  LEGEND_BG_CLASS = "#{LEGEND_CLASS}-bg"
  LEGEND_DEPT_CLASS = "#{LEGEND_CLASS}-departement"
  LEGEND_VALUE_CLASS = "#{LEGEND_CLASS}-value"
  LEGEND_COLOR_CLASS = "#{LEGEND_CLASS}-color"
  # GROUP_CLASS = "#{COMPONENT_CLASS}__group"
  # BIGGEST_GROUP_CLASS = "#{GROUP_CLASS}--biggest"
  # LABEL_CLASS = "#{COMPONENT_CLASS}__label"
  # BAR_CLASS = "#{COMPONENT_CLASS}__bar"
  # VALUE_CLASS = "#{COMPONENT_CLASS}__value"
  # DIVIDER_CLASS = "#{COMPONENT_CLASS}__divider"

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

  legendSelection = svgSelection.append 'g'
  .classed LEGEND_CLASS, true
  .attr 'transform', "translate(#{margins.left}, #{margins.top})"

  legendSelection.append 'text'
  .classed LEGEND_DEPT_CLASS, true

  legendSelection.append 'rect'
  .classed LEGEND_COLOR_CLASS, true
  .attr
    x: -15
    y: -15
    width: 8
    height: 20

  legendSelection.append 'text'
  .attr 'dy', '1.5em'
  .classed LEGEND_VALUE_CLASS, true

  lastSelection = undefined
  _updateLegend = (newSelection) ->
    unless newSelection
      legendSelection.select ".#{LEGEND_DEPT_CLASS}"
      .text 'Sélectionnez un département...'

      legendSelection.select ".#{LEGEND_VALUE_CLASS}"
      .text ''

      legendSelection.select ".#{LEGEND_COLOR_CLASS}"
      .style 'fill', 'transparent'

    else
      legendSelection.select ".#{LEGEND_DEPT_CLASS}"
      .text newSelection.departementName

      legendSelection.select ".#{LEGEND_VALUE_CLASS}"
      .text percentageFormatter newSelection.value

      legendSelection.select ".#{LEGEND_COLOR_CLASS}"
      .style 'fill', newSelection.color

    lastSelection = newSelection

  _updateLegend()

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
  idfWidth = 120
  idfHeight = 120
  idfOffset = left: 0, top: 300

  idfX = centroid[0]
  idfY = centroid[1]
  idfK = (idfWidth/2)/(bbox[1][0] - bbox[0][0])

  trStr = "translate(" + idfWidth / 2 + "," + idfHeight / 2 + ")" +
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
    baseColor = d3.rgb 'gray'

    d3.scale.linear()
      .domain d3.extent _.map data, config.value
      .range [baseColor, accentColor]

  _hasData = (d) -> d.data?

  departementsMap = (data) ->
    data = _.filter data, (d) -> _.includes departementList, config.departement d
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
    .on 'click', (d) -> _updateLegend
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
        _updateLegend lastSelection
      else _updateLegend()


window.DepartementsMap = DepartementsMap
