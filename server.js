var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var Parse = require('parse/node');

var requestDiputados = require('./requestDiputados');

Parse.initialize("yNNYWc4bNyk1okUlCQfO81QJ2r0WQk78MieWtJuS", "tHr3JKcmhxVLTClvUQ9LOjxxvfx99zA3Pb1HkEl4");



app.get('/scrape', function(req, res){

	// Let's scrape diputados
	url = 'http://sitl.diputados.gob.mx/LXII_leg/listado_diputados_gpnp.php';
	requestDiputados(url);

	res.send('Check your console!');
	console.log("debe terminar");
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app; 	