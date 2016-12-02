---
---
setTimeout ->
  selection = d3.select '#departements-map'
  departementsMap = DepartementsMap selection.node(),
    departement: (d) -> d.departement
    value: (d) -> d.value

  d3.csv 'sample-data.csv', (d) ->
    departement: d.departement
    value: +d.value
  , (err, data) -> departementsMap data
, 1000
