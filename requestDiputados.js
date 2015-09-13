var request = require('request');
var cheerio = require('cheerio');

var Parse = require('parse/node');
var Diputado = require('./diputado');

var datosDiputado = require('./datosDiputado');

function limpiar(text){
	var text = text.toLowerCase(); // a minusculas
	text = text.replace(/[באהגו]/, 'a');
	text = text.replace(/[יטכך]/, 'e');
	text = text.replace(/[םלןמ]/, 'i');
	text = text.replace(/[ףעצפ]/, 'o');
	text = text.replace(/[תשüû]/, 'u');
	text = text.replace(/[‎ÿ]/, 'y');
	text = text.replace(/[ס]/, 'n');
	text = text.replace(/[ח]/, 'c');
	text = text.replace(/['"]/, '');
	text = text.replace(/[^a-zA-Z0-9-]/, '');
	text = text.replace(/\s+/, '-');
	text = text.replace(/' '/, '-');
	text = text.replace(/(_)$/, '');
	text = text.replace(/^(_)/, '');
	return text;
}

function requestDiputados(url) {
	request(url, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);

			$('table').filter(function () {
				var data = $(this);
				var tables = data.find('table').each(function (i, element) {
					console.log("i = " + i);
					// get the second table wich has the list of representatives
					if (i === 1) {
						var dumped = $(this).find('tr');
						var party = "";
						dumped.each(function (i, element) {
							var json = {number: 0, name: "", party: ""}; // missing { entity: "", district: "" }
							var imgSrc = $(this).find("img").attr('src');
							if (imgSrc !== undefined) {
								if (imgSrc === 'images/pri01.png') {
									console.log("PRI " + imgSrc);
									party = "PRI";
								}
								if (imgSrc === 'images/pan.png') {
									console.log("PAN " + imgSrc);
									party = "PAN";
								}
								if (imgSrc === 'images/prd01.png') {
									console.log("PRD " + imgSrc);
									party = "PRD";
								}
								if (imgSrc === 'images/logvrd.png') {
									console.log("PVEM" + imgSrc);
									party = "PVEM";
								}
								if (imgSrc === 'images/logo_movimiento_ciudadano.png') {
									console.log("MOVCI  " + imgSrc);
									party = "MOVCI";
								}
								if (imgSrc === 'images/logpt.png') {
									console.log("PT " + imgSrc);
									party = "PT";
								}
								if (imgSrc === 'images/panal.gif') {
									console.log("PANAL " + imgSrc);
									party = "PANAL";
								}
							}

							var uri = $(this).find("a").attr('href');
							if (uri !== undefined) {
								var id = parseInt(uri.replace("curricula.php?dipt=", ""), 10);
								var name = $(this).find("a").text().replace(/(\d+) +/, "");
								json.number = id;
								json.name = limpiar(name);
								json.party = party;
								//// Create a new instance of Blog
								//var diputado = new Diputado();
								//// Call .create()
								//diputado.create(json.number, json.name, json.party);

								datosDiputado(id, json);
							}
						})
					}
				});
			});
		}
	});
}

module.exports = requestDiputados;