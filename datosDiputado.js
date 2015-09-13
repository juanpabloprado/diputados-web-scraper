var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var asistencias=require('./asistencias');

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

function datosDiputado(id){
	url='http://sitl.diputados.gob.mx/LXII_leg/curricula.php?dipt='+id;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title, release, rating;
			var json = { title : "", release : "", rating : ""};
			var vista='';
			var tabla=$('table').html();
			var numTables="";
			var tablas={};
			var dato={
			  		TipoEleccion:"",
			  		Entidad:"",
			  		Circunscripcion:"",
			  		Cabecera:"",
			  		Curul:"",
			  		Correo:"",
			  		datos:{}};
			var  academicos= { 
					escolaridad : {}, 
					trayectoriaPol : {}, 
					experienciaLeg : {},
					admPublicaFed:{},
					asoc:{},
					cargoLeg:{}};  		
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
			  	//console.log(dato1)
			  	dato.TipoEleccion=dato1[1];
			  	dato.Entidad=dato1[2];
			  	dato.Circunscripcion=dato1[3];
			  	dato.Cabecera=dato1[4];
			  	dato.Curul=dato1[5];
			  	dato.Correo=dato1[8];
			  	//console.log(dato);
			  	
			  	
			});
			
			$('table').next().children().each(function(i, elem) {
				var contGrup=0;var cont=0;
				$(this).find('tr').each(function(z, elem) {
					var jsonTemp= {};
					var num=0;
					
					$(this).find('td').each(function(y, elem) {
						var texto=$(this).text();
						jsonTemp[y]=limpiar1(texto);
						num=num+1;
					});
						//console.log(jsonTemp);
						
						if(num==1){								
							contGrup++;
							console.log("separador : "+contGrup);
							cont=0;
						}else{
							
							if(contGrup==1){
								academicos.escolaridad[cont]=jsonTemp[0]+":"+jsonTemp[1];
								cont++;
							}
							if(contGrup==2){
								academicos.trayectoriaPol[cont]=jsonTemp[0]+":"+jsonTemp[1]+":"+jsonTemp[2];
								cont++;
							}	
							if(contGrup==3){
								academicos.experienciaLeg[cont]=jsonTemp[0]+":"+jsonTemp[1]+":"+jsonTemp[2];
								cont++;
							}
							if(contGrup==4){
								academicos.admPublicaFed[cont]=jsonTemp[0]+":"+jsonTemp[1]+":"+jsonTemp[2];
								cont++;
							}
							if(contGrup==5){
								academicos.asoc[cont]=jsonTemp[0]+":"+jsonTemp[1]+":"+jsonTemp[2];
								cont++;
							}
							if(contGrup==6){
								academicos.cargoLeg[cont]=jsonTemp[0]+":"+jsonTemp[1]+":"+jsonTemp[2];
								cont++;
							}																														
						}
											
						
				});
			});
			dato.datos=academicos;
			asistencias(430,11,dato);        
		}
	});
}

module.exports = datosDiputado;