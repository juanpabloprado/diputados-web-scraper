var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var Parse = require('parse/node');

Parse.initialize("yNNYWc4bNyk1okUlCQfO81QJ2r0WQk78MieWtJuS", "tHr3JKcmhxVLTClvUQ9LOjxxvfx99zA3Pb1HkEl4");

app.get('/scrape', function (req, res) {
	// Let's scrape diputados
	url = 'http://sitl.diputados.gob.mx/LXII_leg/listado_diputados_gpnp.php';

	request(url, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);

			var diputados =[];

			//Selectors $( selector, [context], [root] )
			$('table').filter(function () {
				var data = $(this);
				var tables = data.find('table').each(function (i, element) {
					console.log("i = " + i);
					// get the second table wich has the list of representatives
					if (i === 1) {
						var dumped = $(this).find('tr');
						var party = "";
						dumped.each(function (i, element) {
							var json = {id: 0, name: "", party: ""}; // missing { entity: "", district: "" }
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
									console.log("PVEM"  + imgSrc);
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
							if(uri !== undefined) {
								var id = parseInt(uri.replace("curricula.php?dipt=", ""), 10);
								var name = $(this).find("a").text().replace(/(\d+) +/, "");
								json.id = id;
								json.name = name;
								json.party = party;
								diputados.push(json);
							}
						})
					}
				});
			});

			//$('.star-box-giga-star').filter(function () {
			//	var data = $(this);
			//	json.district = data.text();
			//})
		}

		fs.writeFile('output.json', JSON.stringify(diputados, null, 4), function (err) {
			console.log('File successfully written! - Check your project directory for the output.json file');
		});

		var TestObject = Parse.Object.extend("TestObject");
		var testObject = new TestObject();
		testObject.save({foo: "bar"}).then(function(object) {
			console.log("yay! it worked");
		});

		res.send('Check your console!')
	})
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app; 	