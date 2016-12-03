// *********
// CONSTANTS
// *********
// var SECTIONS = ['intro', 'les-causes'];

var SEGMENTS = [
  {id: 'age', label: 'Par âge', question: 'Quel âge avez-vous ?'},
  {id: 'sexe', label: 'Par sexe', question: 'Vous êtes :'},
  {id: 'tendance', label: 'Par tendance politique', question: 'A quelle tendance politique vous identifiez-vous ?'},
  {id: 'taille_commune', label: 'Par taille de commune', question: 'Quelle est la taille de votre commune ?'},
  {id: 'revenu', label: 'Par revenu', question: 'Quelle est votre tranche de revenu annuel ?'},
  {id: 'profession', label: 'Par profession', question: 'Quelle est votre profession ?'},
]

var QUESTIONS = [
  {id: 0, text:"Quelles est la cause qui vous tient le plus à coeur ?", type: "leaderboard", theme: "cause"},
  {id: 1, text:"Quelle est la cause qui selon vous est la plus traitée dans les médias mais est la moins importante", type: "leaderboard", theme: "cause"},
  {id: 2, text:"Quelle est la cause qui selon vous est la plus traitée par les politiques mais est la moins importante", type: "leaderboard", theme: "cause"},
  {id: 3, text:"Si vous deviez juger un candidat sur les solutions qu'il propose sur une seule cause, quelle serait-elle ?", type: "leaderboard", theme: "cause"},
  {id: 4, text:"Pensez-vous qu'un sujet mériterait plus de place dans les médias et dans les programmes politiques ?", type: "leaderboard", theme: "cause"},
  {id: 5, text:"Pensez-vous que les programmes politiques des candidats ou partis politiques : [correspondent aux attentes des Français ?]", type: "yes-no", theme: "programme"},
  {id: 6, text:"Pensez-vous que les programmes politiques des candidats ou partis politiques : [permettraient d'améliorer la vie des Français ?]", type: "yes-no", theme: "programme"},
  {id: 7, text:"Selon vous, un candidat à l'élection présidentielle devrait :", type: "leaderboard", theme: "presidentielle"},
  {id: 8, text:"Préférez-vous voter pour : ", type: "leaderboard", theme: "presidentielle"},
  {id: 9, text:"Seriez-vous prêt à voter pour un candidat indépendant?", type: "yes-no", theme: "presidentielle", params: {
    sentiments: [{
      label: 'non',
      sentiment: 'very-negative'
    },{
      label: 'oui',
      sentiment: 'very-positive'
    }],
    divider: {before: 'oui'}
  }},
  {id: 10, text:"Pour vous le plus important pour un candidat à la présidentielle c'est : ", type: "leaderboard", theme: "presidentielle"},
  {id: 11, text:"Si vous deviez décrire en 1 mot votre président(e) idéal(e) quel serait-il ?", type: "wordcloud", theme: "presidentielle"},
  {id: 12, text:"Pensez-vous que nos présidents successifs ont su utiliser internet pour écouter l'opinion des Français ?", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
  {id: 13, text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Intégrer internet pour déterminer leur ligne politique]", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
  {id: 14, text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Prendre en compte les pétitions en ligne dans le processus démocratique]", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
  {id: 15, text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Prendre en compte les pétitions en ligne au même titre que les sondages d'opinion]", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
  {id: 16, text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Faire en sorte que les plus populaires fassent l'objet de débats parlementaires]", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
  {id: 17, text:"Dans le futur, pensez-vous que le/la président-e et son gouvernement devraient  : [Répondre directement aux pétitions en ligne]", type: "yes-no", theme: "internet", params: {
    sentiments: [{
      label: 'Non pas du tout',
      sentiment: 'very-negative'
    },{
      label: 'Non pas vraiment',
      sentiment: 'quite-negative'
    },{
      label: 'Oui plutôt',
      sentiment: 'quite-positive'
    },{
      label: 'Oui tout à fait',
      sentiment: 'very-positive'
    }],
    divider: {before: 'Oui plutôt'}
  }},
]

var THEMES = {
  'cause': 'Les causes',
  'programme': 'Les programmes politiques',
  'presidentielle': 'Les candidats à la présidentielle',
  'internet': "La démocratie en ligne"
}
