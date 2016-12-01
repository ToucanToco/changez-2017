---
---

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

yesNoChart = YesNoChart selection.node(), config
d3.csv '../question5.csv', (d) ->
  label: d.answer
  value: +d.value
, (err, data) ->
  yesNoChart data
