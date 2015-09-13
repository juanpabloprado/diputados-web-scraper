var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var asistencias = require('./asistencias');

			function limpiar(text){
			      var text = text; // a minusculas
			      text = text.replace(/[áàäâå]/, 'a');
			      text = text.replace(/[éèëê]/, 'e');
			      text = text.replace(/[íìïî]/, 'i');
			      text = text.replace(/[óòöô]/, 'o');
			      text = text.replace(/[úùüû]/, 'u');
			      text = text.replace(/[ýÿ]/, 'y');
			      text = text.replace(/[ñ]/, 'n');
			      text = text.replace(/[ç]/, 'c');
			      text = text.replace(/['"]/, '');
			      text = text.replace(/[^a-zA-Z0-9-]/, ''); 
			      text = text.replace(/\s+/, '-');
			      text = text.replace(/' '/, '-');
			      text = text.replace(/(_)$/, '');
			      text = text.replace(/^(_)/, '');
			      //text = text.replace(/[^\w\s]/gi, '');
			      text = text.replace('Correoelectrnico','');
			      text = text.replace('-',' ');
			      text = text.replace('�','');
			      return text;
			   }
			  function limpiar1(text){
			      var text = text; // a minusculas
			      text = text.replace(/[^\w\s]/gi, '');
			      return text;
			   } 

function datosDiputado(id, json){
	url='http://sitl.diputados.gob.mx/LXII_leg/curricula.php?dipt='+id;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var  academicos=[];
			$('table').find('table').each(function(i, elem) {				  
				var dato1={};
			  	$(this).find('tr').each(function(z, elem) {
			  		var jsonTemp={};
			  		
			  		$(this).find('td').each(function(y, elem) {			  			
			  			var texto=$(this).text();
			  			jsonTemp[y]=limpiar(texto);		
			  			  			
			  		});
					dato1[z]=jsonTemp[1];
					if(jsonTemp[1]==''){
						dato1[z]=jsonTemp[0];
					}							  			
			  		
			  	});
			  	json.tipoEleccion = dato1[1];
			  	json.entidad = dato1[2];
			  	json.circunscripcion = dato1[3];
			  	json.cabecera = dato1[4];
			  	json.curul = dato1[5];
			  	json.correo = dato1[8];
			  	
			});
			
			$('table').next().children().each(function(i, elem) {
				var contGrup=0;var cont=0;
				var titulo='';
				//var acaTemp={};
				$(this).find('tr').each(function(z, elem) {
					var jsonTemp= {};
					var num=0;
					var esc={};
					
					$(this).find('td').each(function(y, elem) {
						var texto=$(this).text();
						jsonTemp[y]=limpiar1(texto);
						num=num+1;
					});
						
						if(num==1){	
							//academicos[cont]=esc;							
							contGrup++;
							
							titulo=jsonTemp[0];
							
						}else{
							
							
								esc.grupo=titulo;
								esc.concepto=jsonTemp[0];
								esc.descripcion=jsonTemp[1];
								esc.tiempo=jsonTemp[2];
								academicos.push(esc);
								cont++;


						}


				});
			});

			json.academicos = academicos;

			var ultimoPeriodo = 11;
			asistencias(id, ultimoPeriodo, json);
		}

	});
}

module.exports = datosDiputado;