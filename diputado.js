var Parse = require('parse/node');

var Diputado = Parse.Object.extend('Diputado', {
	create: function(number, name, party,
					 cabezera, circunscripcion, correo,
					 curul, entidad, tipoEleccion,
					 academicos, asistencias) {
		this.save({
			'number': number,
			'name': name,
			'party': party,
			'cabezera': cabezera,
			'circunscripcion': circunscripcion,
			'correo': correo,
			'curul': curul,
			'entidad': entidad,
			'tipoEleccion': tipoEleccion,
			'academicos': academicos,
			'asistencias': asistencias
		}, {
			success: function(diputado) {
				console.log('You added a new diputado: ' + diputado.get('name'));
			},
			error: function(diputado, error) {
				console.log(diputado);
				console.log(error);
			}
		});
	}

});

module.exports = Diputado;