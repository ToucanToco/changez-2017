---
---

# Map = (DOMElement, config) ->
#   element = [DOMElement]
#
#   config = _.assign config,
#     rayonMini: 10
#     rayonMaxi: 50
#     margin:
#       left: 0, top: 0, bottom: 0, right: 0
#     fixedScale : true
#     padding: 20
#
#   svg = d3.select(element[0]).append("svg")
#
#   colors = ['#66436d','#9B68A6','#9B68A6','#c99ad2']
#   firstAppearance = true
#   path = d3.geo.path()
#   kCarto = 1
#   projection = undefined
#
#   width = d3.select(element[0]).node().offsetWidth - (config.margin.left + config.margin.right)
#   height = d3.select(element[0]).node().offsetHeight - (config.margin.bottom + config.margin.top);
#
#   svg = svg
#   .append 'g'
#   .attr 'transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')'
#
#   label = 'departement';
#   cartofile = 'depts-details-topojson.json';
#
#   projection = d3.geo.conicConformal()
#   .center([2.454071, 47.279229])
#   .scale(3500)
#   .translate([width / 2 , height / 2 -50])
#
#   path.projection(projection)
#
#   computeScales = (data) ->
#      scale = d3.scale.quantile()
#       .domain(_.pluck(data,scope.chartController.filters.value))
#       .range(d3.range(colors.length))
#
#   d3.json '/data/'+ cartofile, (req, geojson) ->
#     cartoData = geojson
#     render data
#
#
#
#       scope.$watch('data', function(newVals, oldVals) {
#         if (!_.isUndefined(newVals)) {
#           // convert string to numbers
#           _.each(newVals, function(d) {
#             _.each(d, function(value, key) {
#               if (key != label && key !='lib_dept' && key != 'nom_dep') {
#                 d[key] = +value;
#               }
#             });
#           });
#           computeScales(newVals);
#           return scope.render(newVals);
#         }
#       }, true);
#
#       scope.$watch('chartController.filters', function(newVals, oldVals) {
#         if (!_.isUndefined(newVals)) {
#           computeScales(scope.data);
#           scope.render(scope.data);
#         }
#       },true);
#
#
#       function drawIDF (data) {
#         var _data = topojson.feature(cartoData, cartoData.objects['departements-details']).features;
#         _data = _data.filter(function (d) {
#           return _.contains([ "75", "92", "94", "93"],d.properties.CODE_DEPT );
#         });
#
#         var x
#          , y
#          , k
#          , d = _data [0];
#
#         var centroid = path.centroid(d);
#         var bbox = path.bounds(d)
#         var _width = 120;
#         var _height = 120;
#         var offset = {left: 0, top: 300}
#
#         if (mobilecheck()) {
#          _width = 60;
#          _height = 60;
#          offset.left = -5;
#          offset.top = 170;
#         }
#
#         x = centroid[0];
#         y = centroid[1];
#         k = (_width/2)/(bbox[1][0] - bbox[0][0]) ;
#         centered = d;
#
#         var trStr = "translate(" + _width / 2 + "," + _height / 2 + ")" +
#           "scale(" + k + ")translate(" + -x + "," + -y + ")";
#         var features = svg
#         .append('g')
#         .attr("transform", 'translate('+offset.left+','+offset.top+')')
#         .append('g')
#         .attr("transform", trStr)
#
#
#         var areas = features.selectAll("idf")
#         .data(_data);
#
#         areas = areas.enter()
#           .append("path")
#           .attr("class", 'idf')
#           .attr("d", path)
#         .attr('class', function(d) {
#           var c = 'entity';
#           var selected, cur;
#           if (d.properties.CODE_DEPT[0] == '0') {
#             selected = d.properties.CODE_DEPT[1]
#           } else {
#             selected = d.properties.CODE_DEPT
#           }
#           cur = _.findWhere(data, { departement: selected });
#            c += ' carto-cat'+scale(cur[scope.chartController.filters.value]);
#
#           return c;
#         })
#         .on('click', function(d) {
#           scope.$apply(function() {
#             scope.chartController.selected = d.properties.CODE_DEPT;
#             console.log('select', scope.chartController.selected);
#           });
#         })
#
#         //var _cartoData = cartoData.objects['departements-details'].filter(function (d) {
#           //return _.contains([ "75", "92", "94", "93"],d.properties.CODE_DEPT );
#         //});
#         _data = topojson.mesh(cartoData, cartoData.objects['departements-details'], function(a, b) { return _.contains([ "75", "92", "94", "93"],a.properties.CODE_DEPT ) && (a !== b); })
#
#         features
#          .append("path")
#           .datum(_data)
#           .attr("class", "entity-borders-zoomidf")
#           .attr("d", path);
#       }
#
#   scope.render = function(inputData) {
#     var benchmarkData, data;
#
#     console.log('Render carto');
#     svg.selectAll('*').remove();
#     //legendSvg.selectAll('*').remove();
#
#     if (!inputData || !cartoData) return;
#
#     var data = inputData
#       , cur;
#
#     var _data = topojson.feature(cartoData, cartoData.objects['departements-details']).features;
#     /************ CARTO **********/
#     var features = svg
#     .selectAll("path")
#     .data(_data);
#
#
#     features = features.enter()
#     .append("path")
#     .attr('class', function(d) {
#       var c = 'entity';
#       var selected, cur;
#       if (d.properties.CODE_DEPT[0] == '0') {
#         selected = d.properties.CODE_DEPT[1]
#       } else {
#         selected = d.properties.CODE_DEPT
#       }
#       cur = _.findWhere(data, { departement: selected });
#       if (cur) {
#          c += ' carto-cat'+scale(cur[scope.chartController.filters.value]);
#       }
#
#       return c;
#     })
#     .on('click', function(d) {
#       scope.$apply(function() {
#         if (d.properties.CODE_DEPT == '2A' || d.properties.CODE_DEPT == '2B') {
#           scope.chartController.selected = d.properties.CODE_DEPT;
#         } else {
#           scope.chartController.selected = parseInt(d.properties.CODE_DEPT);
#         }
#         console.log('select', scope.chartController.selected);
#       });
#     })
#
#     /******** LEGEND ***********/
#
#
#     var quantiles = scale.quantiles()
#       , legendRectHeight = 8
#       , legendRectWidth = 15
#       , interLegendSpace = 20
#       , groups = quantiles.map(function (d,i) {
#       if (i === 0) {
#         return '< à ' + helpers.formatNumber(d,1) ;
#       } else {
#         return 'de ' + helpers.formatNumber(quantiles[i-1],1) + ' à ' + helpers.formatNumber(d,1) ;
#       }
#     });
#
#     groups.push('> à ' +  helpers.formatNumber(quantiles[quantiles.length-1],1));
#
#     if (firstAppearance) {
#       features.transition()
#       .delay(function(d,i) {return 10*i;})
#       .attr("d", path)
#       firstAppearance = false;
#
#     } else{
#       features
#       .attr("d", path)
#     }
#     svg
#      .append("path")
#       .datum(topojson.mesh(cartoData, cartoData.objects['departements-details'], function(a, b) { return a !== b; }))
#       .attr("class", "entity-borders")
#       .attr("d", path);
#
#     drawIDF(inputData);
#   }


departementFeatures = undefined
d3.json 'departements-details.json', (req, json) ->
  departementFeatures = json.features


DepartementsMap = (DOMElement, config) ->
  svgSelection = d3.select DOMElement

  COMPONENT_CLASS = 'departements-map'

  MAP_CLASS = "#{COMPONENT_CLASS}__map"
  FEATURE_CLASS = "#{COMPONENT_CLASS}__feature"
  MISSING_CLASS = "#{FEATURE_CLASS}--missing"

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

  features = mapSelection.selectAll 'path'
  .data departementFeatures

  newFeatures = features.enter()
  .append 'path'
  .classed FEATURE_CLASS, true
  .attr 'd', path
  .attr 'opacity', 0
  .transition()
  .delay (d, i) -> 10 * i
  .attr 'opacity', 1

  # .classed
  # function(d) {
  #   var c = 'entity';
  #   var selected, cur;
  #   if (d.properties.CODE_DEPT[0] == '0') {
  #     selected = d.properties.CODE_DEPT[1]
  #   } else {
  #     selected = d.properties.CODE_DEPT
  #   }
  #   cur = _.findWhere(data, { departement: selected });
  #   if (cur) {
  #      c += ' carto-cat'+scale(cur[scope.chartController.filters.value]);
  #   }
  #
  #   return c;
  # })


  _computeScale = (data) ->
    accentColor = d3.rgb 234, 46, 46
    baseColor = d3.rgb 'gray'

    maxValue = d3.max _.map data, config.value

    d3.scale.linear()
      .domain [0, maxValue]
      .range [baseColor, accentColor]

  _hasData = (d) -> d.data?

  departementsMap = (data) ->
    scale = _computeScale data

    colorAccessor = (d) ->
      if _hasData d
        (scale config.value d.data).toString()
      else
        ''

    features.each (d) ->
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
        lastSelection?.departement is config.departement d.data

      if newSelection and config.value newSelection
        lastSelection.value = config.value newSelection.data
        lastSelection.color = colorAccessor data: newSelection
        _updateLegend lastSelection
      else _updateLegend()





window.DepartementsMap = DepartementsMap
