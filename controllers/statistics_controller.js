var models = require('../models/models.js');

exports.statistics = function(req, res, next){
  models.Quiz.findAll({
  	include: [{
  	  model: models.Comment
  	}]
  }).then(function(quizes){
  	var stats = {
	  numPreguntas: quizes.length,
	  numComentarios: 0,
	  comentariosPorPregunta: 0,
	  numPreguntasNoComentadas: 0,
	  numPreguntasComentadas: 0
	};
	if (quizes.length > 0) {		
	  for (var i = 0; i < quizes.length; i++) {
		if (quizes[i].Comments){
		  var preguntaConComentario = false;			   
		  for (var j = 0 ; j < quizes[i].Comments.length; j++)
	        if (quizes[i].Comments[j].publicado) {
	          stats.numComentarios++;
	          preguntaConComentario = true;
	        } 
		  if (preguntaConComentario)
		   	stats.numPreguntasComentadas++;
		}
	  }
	  stats.comentariosPorPregunta = (stats.numComentarios / stats.numPreguntas).toFixed(2);
	  stats.numPreguntasNoComentadas = stats.numPreguntas - stats.numPreguntasComentadas;
	}
  	res.render('quizes/statistics', {stats: stats, errors: []});
  }).catch(function(error){next(error);})
};