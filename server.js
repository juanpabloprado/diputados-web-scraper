var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var datosDiputado=require('./datosDiputado');


app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2
	//url = 'http://www.imdb.com/title/tt1229340/';
    datosDiputado(430);

/*	url= 'http://sitl.diputados.gob.mx/LXII_leg/asistencias_por_pernplxii.php?iddipt=430&pert=11';
	

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var meses={asistencias:[]};
			var title, release, rating;
			
			var text='';


			$("table [bgcolor='#F2F2F2']").each(function(i, elem) {
				var json = { mes : "", dias :""};
				var titulo=$(this).find('.TitulosVerde').html();
				if(titulo!=null){
					console.log(titulo);
					json.mes=titulo;	
					var contDias=0;
					var jsonTemp=[];
					$(this).find("td [bgcolor='#D6E2E2']").each(function(i, elem) {
						var datos=$(this).find("font").html();
						datos=datos.split("<br>");
						console.log(datos);
						var dia={dia:datos[0],concepto:datos[1]};
						jsonTemp[contDias]=dia;
						contDias++;
						//text=text+datos;
					});
					json.dias=jsonTemp;
				}
				if(json.mes!=""){
					meses.asistencias.push(json);	
				}
				
			});
				        
		}  
     res.send('Check your console!'+meses)

       
	})*/

 

});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app; 	