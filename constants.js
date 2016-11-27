// *********
// CONSTANTS
// *********
// var SECTIONS = ['intro', 'les-causes'];

var SEGMENTS = [
  {id: 'age', label: 'Par âge', question: 'Quel âge avez-vous ?'},
  {id: 'sexe', label: 'Par sexe', question: 'Vous êtes :'},
  {id: 'tendance', label: 'Par tendance politique', question: 'A quelle tendance politique vous identifiez-vous ?'},
]

var QUESTIONS = [
  {text:"Quelles est la cause qui vous tient le plus à coeur ?", type: "leaderboard"},
  {text:"Quelle est la cause qui selon vous est la plus traitée dans les médias mais est la moins importante", type: "leaderboard"},
  {text:"Quelle est la cause qui selon vous est la plus traitée par les politiques mais est la moins importante", type: "leaderboard"},
  {text:"Si vous deviez juger un candidat sur les solutions qu'il propose sur une seule cause, quelle serait-elle ?", type: "leaderboard"},
  {text:"Pensez-vous qu'un sujet mériterait plus de place dans les médias et dans les programmes politiques ?", type: "leaderboard"},
  {text:"Pensez-vous que les programmes politiques des candidats ou partis politiques : [correspondent aux attentes des Français ?]", type: "leaderboard"},
  {text:"Pensez-vous que les programmes politiques des candidats ou partis politiques : [permettraient d'améliorer la vie des Français ?]", type: "leaderboard"},
  {text:"Selon vous, un candidat à l'élection présidentielle devrait :", type: "leaderboard"},
  {text:"Préférez-vous voter pour : ", type: "leaderboard"},
  {text:"Seriez-vous prêt à voter pour un candidat indépendant?", type: "leaderboard"},
  {text:"Pour vous le plus important pour un candidat à la présidentielle c'est : ", type: "leaderboard"},
  {text:"Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?", type: "wordcloud"},
  {text:"Pensez-vous que nos présidents successifs ont su utiliser internet pour écouter l'opinion des Français ?", type: "leaderboard"},
  {text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Intégrer internet pour déterminer leur ligne politique]", type: "leaderboard"},
  {text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Prendre en compte les pétitions en ligne dans le processus démocratique]", type: "leaderboard"},
  {text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Prendre en compte les pétitions en ligne au même titre que les sondages d'opinion]", type: "leaderboard"},
  {text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Faire en sorte que les plus populaires fassent l'objet de débats parlementaires]", type: "leaderboard"},
  {text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Répondre directement aux pétitions en ligne]", type: "leaderboard"},
]