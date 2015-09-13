var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

   
function  asistencias(idDip ,id ,json){


	url='http://sitl.diputados.gob.mx/LXII_leg/asistencias_por_pernplxii.php?iddipt='+idDip+'&pert='+id;
	request(url, function(error, response, html){
		var asistencias = [];
		if(!error){
			var $ = cheerio.load(html);

			$("table [bgcolor='#F2F2F2']").each(function(i, elem) {
				var asistencia = { mes : "", dias :"" };
				var titulo=$(this).find('.TitulosVerde').html();
				if(titulo != null){
					//console.log(titulo);
					asistencia.mes = titulo;
					var contDias=0;
					var jsonTemp=[];
					$(this).find("td [bgcolor='#D6E2E2']").each(function(i, elem) {
						var datos=$(this).find("font").html();
						datos = datos.split("<br>");
						//console.log(datos);
						var dia = {dia: datos[0],concepto: datos[1]};
						jsonTemp[contDias] = dia;
						contDias++;
					});
					asistencia.dias=jsonTemp;
				}
				if(asistencia.mes!=""){
					asistencias.push(asistencia);
				}
				
			});				        
		}

		json.asistencias = asistencias;
	});
}
   
module.exports = asistencias;
