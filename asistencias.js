var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

   
function  asistencias(idDip,id,dato){


	var datoDiputado={datosDiputado:dato,asistencia:{}};

	url='http://sitl.diputados.gob.mx/LXII_leg/asistencias_por_pernplxii.php?iddipt='+idDip+'&pert='+id;
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
					//console.log(titulo);
					json.mes=titulo;	
					var contDias=0;
					var jsonTemp=[];
					$(this).find("td [bgcolor='#D6E2E2']").each(function(i, elem) {
						var datos=$(this).find("font").html();
						datos=datos.split("<br>");
						//console.log(datos);
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
		datoDiputado.asistencia=meses;
	 //fs.writeFile('output.html', JSON.stringify(datoDiputado, null, 4), function(err){
      //  	console.log('File successfully written! - Check your project directory for the output.html file');
      //});
	});
}
   
module.exports = asistencias;
