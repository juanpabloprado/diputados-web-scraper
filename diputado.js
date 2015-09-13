var Parse = require('parse/node');

var Diputado = Parse.Object.extend('Diputado', {
	create: function(number, name, party) {
		this.save({
			'number': number,
			'name': name,
			'party': party
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