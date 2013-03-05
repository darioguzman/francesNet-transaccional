//baseUrl = 'http://localhost:8080/francesNet-transaccional/mod/mobile/';
//baseUrl = 'https://bbvawebqa.bancofrances.com.ar/fnet/mod/mobile/';
baseUrl = 'http://192.168.1.107:8080/francesNet-transaccional/mod/mobile/';
baseUrlLocal = 'http://192.168.1.107:8080/francesGo2-portal/';
//baseUrlLocal = 'http://localhost:8080/francesGo2-portal/';
//baseUrlLocal = 'https://bbvawebqa.bancofrances.com.ar/francesGo2-portal/
//	baseUrlLocal = 'http://m.francesgo.com.ar/francesNet-transaccional/mod/mobile/';

	
   	$( document ).bind( "mobileinit", function() {
	    // Make your jQuery Mobile framework configuration changes here!
   		$.support.cors = true;
	    $.mobile.allowCrossDomainPages = true;
	    $.mobile.page.prototype.options.addBackBtn = true;
		
	});
   	
 function bancaMovilRegisterEvents() {

	console.log('start bancaMovilRegisterEvents ');
	
	$('#cuentas').hide();
	$('#tarjetas').hide();
	$('#plazos-fijos').hide();
	$('#cuentas-custodios').hide();
	$('#prestamos').hide();

	var callback = function(data) {

		data.respuesta.tiposDocumento.forEach(function(tipoDocumento) {
			$('#login-tiposDocumento').append(
					"<option value='" + tipoDocumento.descripcionLarga + "'>"
							+ tipoDocumento.descripcionLarga + "</option>");
		});

		$("#login-tiposDocumento").selectmenu('refresh', true);
	};
	
	var url = baseUrlLocal + 'tipo-documento-listar.json';

	$.ajax({
		url : url,
		type : 'GET',
		cache : false,
		success : callback,
		error : function(jqXHR, textStatus, errorThrown) {
			$.mobile.hidePageLoadingMsg();
			console.log(textStatus, errorThrown);
		}
	});
	
	$("#login-confirmation-link").click(function(e){
		try {

			if (validateFormLogin()) {

				var url = baseUrl + 'loginMobile.do';

				 var callback = function(data){
					 
					 $.mobile.loading('hide');
					 
					 if(parseInt(data.codigo) == 0){
						 
						 	$.mobile.changePage("#posicion-global",  { transition: "slide"} );
						 	
						 	console.log(data.descripcion);
							
							var url = baseUrl + 'posicionGlobal.do';

							var postData = {};

							postData.method = 'recuperarProductos';

							recoveryData(url, postData);

					 }else if(parseInt(data.codigo) == 5){
						 
						 	$("#dialog-clave-vencida").trigger({type:"display-data", user:data});
						 	
						 	$.mobile.changePage("#dialog-clave-vencida",  {transition: "pop", role: "dialog", reverse: false} );
						 
					 }else{
						 
						 $("#dialog-error").trigger({type:"display-data", user:data});
						 	
						 $.mobile.changePage("#dialog-error",  {transition: "pop", role: "dialog", reverse: false} );
					 }
					 
				 };

				$.mobile.loading('show', {
					text : 'autenticando',
					textVisible : true
				});
				
				data = $('#login-form').serialize();
				
				callAjax(url,data,callback);
				
			}

		} catch (e) {
			$.mobile.loading('hide');
			console.log("error: " + e);
		}

	});
	
	$('#dialog-clave-vencida').bind('display-data',function(e){
		
		var user = e.user;
		
		console.log(user);
		
		$('#datos-usuario').html("<h6>" + user.descripcion + "</h6>");
		
		$('#datos-usuario').append("" + 
				"<a data-role='button' class='boton' id='link-gestion-clave'>Cambiar Clave</a> " +
				"<a data-role='button' class='boton' >Cancelar</a>");
		
		$('#link-gestion-clave').click(function(e){
			$.mobile.changePage("#gestion-clave-vencida",  { transition: "slide"} );
		});
	});
	
	$('#dialog-error').bind('display-data', function(e){
		
		var user = e.user;
		
		console.log(user);
		
		$('#error').html("<h5>" + user.descripcion + "</h5>");
		
		$('#error').append("" + 
				"<a data-role='button' class='boton' id='link-login'>Aceptar</a>");
		
		$('#link-login').click(function(e){
			$.mobile.changePage("#login",  { transition: "slide"} );
		});
		
	});
	
	$('#cambio-clave-link').click(function(e){
		try{
			
			if(validateFormCambioClave(null,null)){
				
				var url = baseUrl + "autenticacion.do";
				
				var data = $('#gestion-nueva-clave-form').serialize();
				
				data += "&method=cambiarClave";
				
				var callback = function(data){
					
					$("#dialog-mensaje-cambio-clave").trigger({type:"display-data", user:data});
					
					$.mobile.changePage("#dialog-mensaje-cambio-clave",  {transition: "pop", role: "dialog", reverse: false} );
					
					$.mobile.loading('hide');
				};
				
				$.mobile.loading('show', {
					text : 'Espere un momento por favor...',
					textVisible : true
				});

				callAjax(url,data,callback);
				
				
			}
			
		}catch(e){
			alert("error: " + e);
			console.log("error: " + e);
		}

	});
	
	$('#cambio-clave-vencida-link').click(function(e){
		try{
			
			if(validateFormCambioClave('vencida', null)){
				
				var url = baseUrl + "autenticacion.do";
				
				var data = $('#gestion-nueva-clave-vencida-form').serialize();
				
				data += "&method=cambiarClave";
				
				var callback = function(data){
					
					$("#dialog-mensaje-cambio-clave-vencida").trigger({type:"display-data", user:data});
					
					$.mobile.changePage("#dialog-mensaje-cambio-clave-vencida",  {transition: "pop", role: "dialog", reverse: false} );
					
					$.mobile.loading('hide');
				};
				
				$.mobile.loading('show', {
					text : 'Espere un momento por favor...',
					textVisible : true
				});
				
				callAjax(url,data,callback);
				
				
			}
			
		}catch(e){
			console.log("error: " + e);
		}
		
	});
	
	$('#cambio-clave-PMC-link').click(function(e){
		try{
			
			if(validateFormCambioClave(null,'PMC')){
				
				var url = baseUrl + "autenticacion.do";
				
				var data = $('#gestion-nueva-clave-PMC-form').serialize();
				
				data += "&method=cambiarClavePin8";
				
				var callback = function(data){
					
					$("#dialog-mensaje-cambio-clave-PMC").trigger({type:"display-data", user:data});
					
					$.mobile.changePage("#dialog-mensaje-cambio-clave-PMC",  {transition: "pop", role: "dialog", reverse: false} );
					
					$.mobile.loading('hide');
				};
				
				$.mobile.loading('show', {
					text : 'Espere un momento por favor...',
					textVisible : true
				});

				callAjax(url,data,callback);
				
				
			}
			
		}catch(e){
			console.log("error: " + e);
		}
	});
	
	$("#dialog-mensaje-cambio-clave").bind('display-data', function(e){
		
		var data = e.user;
		
		if(data.codigo == 0){
			$('#datos-cambio-clave').html("" + 
					"<h5>"+ data.comprobante.campos[0].valor +" confirmada.</h5>" + 
					"<h5>Número de referencía: " + data.comprobante.referencia + "</h5>" + 
					"<h3>Puede visualizar su comprobante en Francés Net</h3>"
			);
			$('#datos-cambio-clave').append("<a data-role='button' class='boton' id='link-posicion-global'>Aceptar</a>");

			$('#link-posicion-global').click(function(e){
				$.mobile.changePage("#posicion-global",  { transition: "slide"} );
			});
			
		}else{
			$('#datos-cambio-clave').html("" + 
					"<h5>Cambio de Clave Francés fallido.</h5>" + 
					"<h5> " + data.descripcion + "</h5>" 
			);
			$('#datos-cambio-clave').append("<a data-role='button' class='boton' id='link-gestion-claves'>Aceptar</a>");

			$('#link-gestion-claves').click(function(e){
				$.mobile.changePage("#gestion-clave",  { transition: "slide"} );
			});

		}
		
		
	});
	
	$("#dialog-mensaje-cambio-clave-vencida").bind('display-data', function(e){
		
		var data = e.user;
		
		if(data.codigo == 0){
			$('#datos-cambio-clave-vencida').html("" + 
					"<h5>"+ data.comprobante.campos[0].valor +" confirmada.</h5>" + 
					"<h5>Número de referencía: " + data.comprobante.referencia + "</h5>" + 
					"<h3>Puede visualizar su comprobante en Francés Net</h3>"
			);
			$('#datos-cambio-clave-vencida').append("<a data-role='button' class='boton' id='link-login'>Aceptar</a>");

			$('#link-login').click(function(e){
				$.mobile.changePage("#login",  { transition: "slide"} );
			});
			
		}else{
			$('#datos-cambio-clave-vencida').html("" + 
					"<h5>Cambio de Clave Francés fallido.</h5>" + 
					"<h5> " + data.descripcion + "</h5>" 
			);
			$('#datos-cambio-clave-vencida').append("<a data-role='button' class='boton' id='link-login'>Aceptar</a>");

			$('#link-login').click(function(e){
				$.mobile.changePage("#login",  { transition: "slide"} );
			});

		}
		
	});
	
	

	$("#dialog-mensaje-cambio-clave-PMC").bind('display-data', function(e){
		
		var data = e.user;
		
		if(data.codigo == 0){
			$('#datos-cambio-clave').html("" + 
					"<h5>"+ data.comprobante.campos[0].valor +" confirmada.</h5>" + 
					"<h5>Número de referencía: " + data.comprobante.referencia + "</h5>" + 
					"<h3>Puede visualizar su comprobante en Francés Net</h3>"
			);
			$('#datos-cambio-clave').append("<a data-role='button' class='boton' id='link-posicion-global'>Aceptar</a>");

			$('#link-posicion-global').click(function(e){
				$.mobile.changePage("#posicion-global",  { transition: "slide"} );
			});
			
		}else{
			$('#datos-cambio-clave').html("" + 
					"<h5>Cambio de Clave Francés fallido.</h5>" + 
					"<h5> " + data.descripcion + "</h5>" 
			);
			$('#datos-cambio-clave').append("<a data-role='button' class='boton' id='link-gestion-claves'>Aceptar</a>");

			$('#link-gestion-claves').click(function(e){
				$.mobile.changePage("#gestion-clave",  { transition: "slide"} );
			});

		}
		
		
	});
	
	
	
	$('#ver-movimientos-cuenta').bind('display-data',function(e) {
		
		try{
			$('#link-ver-mas-movimientos-cuenta').hide();
			
			$('#link-ver-movimientos-anteriores-cuenta').hide();
			
			var cuenta = e.cuenta;
			
			var movimientos = e.movimientos;
			
			var cuentaAlias = (cuenta.alias) ? cuenta.alias : " Sin alias";
			 
			$("#ul-movimientos-cuenta").empty();
			
			$('#ul-movimientos-cuenta').append(""+
					"<li> " +
							"<h2 class='ui-li-heading-big'>Cuentas</h2>" +
							"<h2 class='ui-li-aside ui-li-desc-big'>" + cuenta.moneda + " "+ cuenta.saldo  + "</h2>" +
							"<p>" + cuenta.descripcion + " " + cuentaAlias    +"</p>" +
					"</li>"
			);
			
			movimientos.movimientos.forEach(function(movimiento) {
				
				var fecha = extractDate(movimiento.fecha);

				$('#ul-movimientos-cuenta').append("" + 
						"<li>" +
							"<a id='movimiento-" + movimiento.saldo + "' >" +
								"<span class=''>" +
									"<h7 class='ui-li-heading'>" + movimiento.concepto + "</h7>" +
									"<p id='movimiento-" + movimiento.concepto + "-importe' class='ui-li-aside ui-li-desc'>" + movimiento.importe + "</p>" +
									"<p>" + fecha  +"</p>" +
								"</span>" +
								"</a>" +
						"</li>"
				);
			
			
			
				$("#movimiento-" + movimiento.saldo).click(function(e) {
					
					var url = baseUrl + "cuenta.do";
					
					var data = {};
					
					switch(movimiento.tipoDetalle){
						case 1:{
							data.method=consultarDetalleBanelco;
							break;
						}
						case 2:{
							data.method=consultarDetalleBanelco;
							break;
						}
						case 3:{
							data.method=consultarDetalleBanelco;
							break;
						}
						case 4:{
							data.method=consultarDetalleTranferencia;
							break;
						}
						case 5:{
							data.method=consultarDetalleTranferencia;
							break;
						}
						case 6:{
							data.method=consultarDetallePagoDirecto;
							break;
						}
						case 7:{
							data.method=consultarDetallePagoDirecto;
							break;
						}
						case 8:{
							data.method=consultarDetalleAutoservicio;
							break;
						}
						case 9:{
							data.method=consultarDetalleAutoservicio;
							break;
						}
						default:{
							alert("Este movimiento no tiene detalles");
							break;
						}
					}
					
					var callback = function(data){
						
						$.mobile.loading('hide');
						
						movimientosCuentas = data;

						$("#ver-movimientos-cuenta").trigger({type:"display-data", cuenta:cuenta, movimientos: movimientosCuentas});
						
						$.mobile.changePage("#ver-movimientos-cuenta",  { transition: "slide"} );
					};
					
					$.mobile.loading('show');
					
					callAjax(url,data,callback);
						
				});
			
			});
			if(movimientos.existenMovimientosSiguientes == true){
				$('#link-ver-mas-movimientos-cuenta').show();
			}
			
			if(movimientos.existenMovimientosAnteriores == true){
				$('#link-ver-movimientos-anteriores-cuenta').show();
			}
			
			$('#link-ver-mas-movimientos-cuenta').unbind();
			
			$('#link-ver-mas-movimientos-cuenta').die('click').live('click', function(e){
				
				var url = baseUrl + 'cuenta.do';
				
				var movimientosCuentas;
				
				var callback = function(data){
					
					$.mobile.loading('hide');
					
					movimientosCuentas = data;

					$("#ver-movimientos-cuenta").trigger({type:"display-data", cuenta:cuenta, movimientos: movimientosCuentas});
					
					$.mobile.changePage("#ver-movimientos-cuenta",  { transition: "slide"} );
				};
				
				var data = {};
				
				data.method = 'consultarMovimientos';
				
				data.indiceProducto = cuenta.indice;
				
				data.cantidadMovimientos = 50;
				
				data.movimientosPosteriores = true ;
				
				data.ultimoMovimiento = movimientos.movimientoSiguiente;
				
				$.mobile.loading('show');
				
				callAjax(url,data,callback);
				
			});
			
			$('#link-ver-movimientos-anteriores-cuenta').unbind();
			
			$('#link-ver-movimientos-anteriores-cuenta').die('click').live('click' , function(e){
				
				var url = baseUrl + 'cuenta.do';
				
				var movimientosCuentas;
				
				var callback = function(data){
					
					$.mobile.loading('hide');
					
					movimientosCuentas = data;

					$("#ver-movimientos-cuenta").trigger({type:"display-data", cuenta:cuenta, movimientos: movimientosCuentas});
					
					$.mobile.changePage("#ver-movimientos-cuenta",  { transition: "slide"} );
				};
				
				var data = {};
				
				data.method = 'consultarMovimientos';
				
				data.indiceProducto = cuenta.indice;
				
				data.cantidadMovimientos = 50;
				
				data.movimientosPosteriores = false ;
				
				data.ultimoMovimiento = movimientos.movimientoAnterior; 
				
				$.mobile.loading('show');
				
				callAjax(url,data,callback);
			});
			
			
			$("#ul-movimientos-cuenta").listview('refresh');
			
		}catch(e){
			console.log('error ' + e);
		}
		
	});
	
   		
}//bancaMovilRegisterEvents
   	
 function recoveryData(url,data){
	 
	 $.mobile.loading('show', {
			text : 'recuperando datos',
			textVisible : true
		});

	 
	 var callback = function(data){
		 
		data.productos.forEach(function(item) {
			switch (item.grupo) {
				case 0: {
					console.log('Show this item (cuenta): ' + item.nombre);
					$('#cuentas').show();
					showCuenta(item);
					break;
				}
				case 1: {
					if(item.nombre != 'Visa Mini'){
						console.log('Show this item (tarjeta): ' + item.nombre);
						$('#tarjetas').show();
						showTarjeta(item);
						break;
					}else{
						console.log("Don't show this tarjeta " + item.nombre + " because our client say");
						break;
					}
				}
				case 2: {
					console.log('Show this item (plazo fijo): ' + item.nombre);
					$('#plazos-fijos').show();
					showPlazoFijo(item);
					break;
				}
				case 3: {
					console.log('Show this item (cuenta custodio): ' + item.nombre);
					$('#cuentas-custodios').show();
					showCuentaCustodio(item);
					break;
				}
				case 4: {
					console.log('Show this item (prestamo): ' + item.nombre);
					$('#prestamos').show();
					showPrestamo(item);
					break;
				}
	
			}

		});
		
		$("#ul-cuentas").listview('refresh');
		$('#ul-tarjetas').listview('refresh');
		$('#ul-plazos-fijos').listview('refresh');
		$('#ul-cuentas-custodios').listview('refresh');
		$('#ul-prestamos').listview('refresh');
		
		$.mobile.loading('hide');
		
		 
	 };
	 
	 console.log('recovering data to the user');
	 
	 callAjax(url,data,callback);
	 
}
 
function showCuenta(cuenta){

	 var cuentaAlias = (cuenta.alias) ? cuenta.alias : " Sin alias";
	 
	 var cuentaDescripcion = cuenta.descripcion.replace("/","");
	 
	 console.log(cuentaDescripcion);
	 $("#ul-cuentas").append("" +
				"<li>" +
					"<a id='cuenta-" + cuentaDescripcion + "' >" +
							"<span class=''>" +
								"<h7 class='ui-li-heading'>" + cuenta.nombre + "</h7>" +
								"<p id='cuenta-" + cuentaDescripcion + "-saldo' class='ui-li-aside ui-li-desc'>" + cuenta.moneda + " "+ cuenta.saldo + "</p>" +
								"<p>" + cuenta.descripcion + " " + cuentaAlias  +"</p>" +
							"</span>" +
					"</a>" +
				"</li>") ;
	 
	 
		$("#cuenta-" + cuentaDescripcion).data("cuenta", cuenta);

		$("#cuenta-" + cuentaDescripcion).click(function(e) {
			
			var movimientosCuentas;
			
			var callback = function(data){
				
				$.mobile.loading('hide');
				
				movimientosCuentas = data;

				$("#ver-movimientos-cuenta").trigger({type:"display-data", cuenta:cuenta, movimientos: movimientosCuentas});
				
				$.mobile.changePage("#ver-movimientos-cuenta",  { transition: "slide"} );
			};
			
			var url = baseUrl + 'cuenta.do';
			
			var data = {};
			
			data.method = 'consultarMovimientos';

			data.indiceProducto = cuenta.indice;
			
			data.cantidadMovimientos = 50;
			
			data.movimientosPosteriores = true ;
			
			data.ultimoMovimiento = 0;
			
			$.mobile.loading('show');
			
			callAjax(url,data,callback);
			
		});
	 
 }
 
 function showTarjeta(tarjeta){
	 
	 var tarjetaDescripcion = tarjeta.descripcion.replace("/","");
	 
	 var tarjetaAlias = (tarjeta.alias) ? tarjeta.alias : "Sin alias";
	 
	 $("#ul-tarjetas").append("" +
				"<li>" +
					"<a id='tarjeta-" + tarjetaDescripcion + "' >" +
							"<span class=''>" +
								"<h7 class='ui-li-heading'>" + tarjeta.nombre +"</h7>" +
								"<p id='tarjeta-" + tarjetaDescripcion + "-saldoPesos' class='ui-li-aside ui-li-desc'> $ " +  tarjeta.saldoPesos  + "</p>" +
								"<p>" + tarjeta.descripcion +"-"+ tarjetaAlias + "</p>"+
								"<p id='tarjeta-" + tarjetaDescripcion + "-saldoDolar' class='ui-li-aside-style ui-li-desc-style'> U$S " +  tarjeta.saldoDolar  + "</p>" +
							"</span>" +
					"</a>" +
				"</li>") ;
		$("#tarjeta-" + tarjetaDescripcion).data("tarjeta", tarjeta);

		$("#tarjeta-" + tarjetaDescripcion).click(function(e) {
			
			$("#ver-tarjeta").trigger({type:"display-data", tarjeta:$(this).data("tarjeta")});
			
			$.mobile.changePage("#ver-tarjeta",  { transition: "slide"} );
		});
 }


 function showPlazoFijo(plazoFijo){
	
	var plazoFijoDescripcion = plazoFijo.descripcion.replace("/","");
	
	var plazoFijoAlias = (plazoFijo.alias) ? plazoFijo.alias : "Sin alias";
	
	var vencimiento = extractDate(plazoFijo.vencimiento);
	
	$("#ul-plazos-fijos").append("" +
			
			"<li>" +
			"<a id='plazo-fijo-" + plazoFijoDescripcion + "' >" +
					"<span class=''>" +
						"<h7 class='ui-li-heading'>" + plazoFijo.nombre + " " + plazoFijo.moneda + "</h7>" +
						"<p id='plazo-fijo-" + plazoFijoDescripcion + "-vencimiento' class='ui-li-aside ui-li-desc'> Vto: " +  vencimiento + "</p>" +
						"<p>" + plazoFijo.descripcion +"-"+ plazoFijoAlias + "</p>"+
						"<p id='plazo-fijo-" + plazoFijoDescripcion + "-capitalOrigen' class='ui-li-aside-style ui-li-desc-style'> Capital Origen " + plazoFijo.moneda +  plazoFijo.capitalOrigen + "</p>" +
					"</span>" +
			"</a>" +
		"</li>") ;

	$("#plazo-fijo-" + plazoFijoDescripcion).data("plazoFijo", plazoFijo);

	$("#plazo-fijo-" + plazoFijoDescripcion).click(function(e) {
		
		$("#ver-plazo-fijo").trigger({type:"display-data", plazoFijo:$(this).data("plazoFijo")});
		
		$.mobile.changePage("#ver-plazo-fijo",  { transition: "slide"} );
	});
	
	$()
}

function showCuentaCustodio(cuentaCustodio){
	
	var cuentaCustodioDescripcion = cuentaCustodio.descripcion.replace("/","");
	
	var cuentaCustodioAlias = (cuentaCustodio.alias) ? cuentaCustodio.alias : "Sin alias" ;
	
	$("#ul-cuentas-custodios").append("" +
			
			"<li>" +
			"<a id='cuenta-custodio-" + cuentaCustodioDescripcion + "' >" +
					"<span class=''>" +
						"<h7 class='ui-li-heading'>" + cuentaCustodio.nombre +"</h7>" +
						"<p>" + cuentaCustodio.descripcion +"-"+ cuentaCustodioAlias + "</p>" +
					"</span>" +
			"</a>" +
			"</li>") ;
			
	$("#cuenta-custodio-" + cuentaCustodioDescripcion ).data("cuentaCustodio", cuentaCustodio);

	$("#cuenta-custodio-" + cuentaCustodioDescripcion ).click(function(e) {
		
		$("#ver-cuenta-custodio").trigger({type:"display-data", cuentaCustodio:$(this).data("cuentaCustodio")});
		
		$.mobile.changePage("#ver-cuenta-custodio",  { transition: "slide"} );
	});
}

function showPrestamo(prestamo){
	
	var prestamoAlias = (prestamo.alias) ? prestamo.alias : "Sin alias";
	
	var vencimiento = extractDate(prestamo.vencimiento);
	
	 $("#ul-prestamos").append("" +
			 
			 "<li>" +
			 "<a id='prestamo-" + prestamo.descripcion + "' >" +
						"<span class=''>" +
							"<h7 class='ui-li-heading'>" + prestamo.nombre +"</h7>" +
							"<p id='prestamo-" + prestamo.descripcion + "-monto' class='ui-li-aside ui-li-desc'> " + prestamo.moneda +" "+  prestamo.montoCuota +"</p>" +
							"<p>" + prestamo.descripcion +"-"+ prestamoAlias + "</p>" + 
							"<p id='prestamo-" + prestamo.descripcion + "-vencimiento' class='ui-li-aside-style ui-li-desc-style'>  Cuota " + prestamo.cuota +"/"+ prestamo.cantCoutas + " - Vencimiento " + vencimiento + "</p>" +
						"</span>" +
				"</a>" +
			"</li>") ;
			 
		$("#prestamo-" + prestamo.descripcion).data("prestamo", prestamo);

		$("#prestamo-" + prestamo.descripcion).click(function(e) {
			
			$("#ver-prestamo").trigger({type:"display-data", tarjeta:$(this).data("prestamo")});
			
			$.mobile.changePage("#ver-prestamo",  { transition: "slide"} );
		});
}

function validateFormLogin() {

	var emptyFields = $("#login-form").find(":input.required,select.required")
			.filter(function() {
				return !$.trim($(this).val()).length;
			});

	if (emptyFields.length == 2) {
		emptyFields.css("border", "1px solid red");
		alert("Ingrese su n�mero de documento y clave Franc�s");
		return false;
	}

	var tipoDni = parseInt($('#login-tiposDocumento').val());

	if (!isNaN(tipoDni)) {
		alert("Debe seleccionar un tipo de documento");
		$('#login-tiposDocumento').css("border", "1px solid red");
		return false;
	}

	var dni = $('#login-dni').val();

	if (dni == '') {
		alert("Ingrese su documento");
		$('#login-dni').css("border", "1px solid red");
		return false;
	}

	dni = parseInt(dni);

	if (isNaN(dni)) {
		alert("El n�mero de documento debe ser n�merico");
		$('#login-dni').css("border", "1px solid red");
		return false;
	}

	var clave = $('#login-clave').val();

	if (clave == '') {
		alert("Ingrese su Clave Fr�nces");
		$('#login-clave').css("border", "1px solid red");
		return false;
	}

	clave = parseInt(clave);

	if (isNaN(clave)) {
		alert("La clave debe ser n�merica");
		$('#login-clave').css("border", "1px solid red");
		return false;
	}
	return true;
}

function validateFormCambioClave(vencida, PMC){
	
	var adicionalVencida = (vencida) ? vencida+"-" : '';
	
	var adicionalPMC = (PMC) ? PMC+"-" : '';
	
	var emptyFields = $("#gestion-nueva-clave-"+ adicionalVencida +adicionalPMC +"form").find(":input.required,select.required").filter(function() {
			return !$.trim($(this).val()).length;
		});

	if (emptyFields.length == 3) {
		emptyFields.css("border", "1px solid red");
		alert("Ingrese todos los datos solicitados");
		return false;
	}
	
	var claveFrancesActual = $('#clave-'+adicionalVencida+'actual');
	
	if(claveFrancesActual.val().length == 0){
		claveFrancesActual.css("border", "1px solid red");
		alert("Ingrese su Clave Francés actual");
		return false;
	}
	
	if(claveFrancesActual.val().length < 4){
		claveFrancesActual.css("border", "1px solid red");
		alert("La Clave Francés debe tener 4 dígitos");
		return false;
	}
	
	var claveFrancesNueva = $('#clave-'+adicionalVencida+'nueva');
	
	if(claveFrancesNueva.val().length == 0){
		claveFrancesNueva.css("border", "1px solid red");
		alert("Ingrese su nueva Clave Francés");
		return false;
	}
	
	if(claveFrancesNueva.val().length < 4){
		claveFrancesNueva.css("border", "1px solid red");
		alert("La Clave Francés debe tener 4 dígitos");
		return false;
	}
	
	var claveFrancesReingreso = $('#clave-reingreso-'+adicionalVencida+'nueva');
	
	if(claveFrancesReingreso.val().length == 0){
		claveFrancesReingreso.css("border" , "1px solid red");
		alert("Ingrese todos los datos solicitados");
		return false;
	}
	
	if(claveFrancesReingreso.val().length < 4){
		claveFrancesReingreso.css("border", "1px solid red");
		alert("La Clave Francés debe tener 4 dígitos");
		return false;
	}
	
	if(claveFrancesNueva.val() != claveFrancesReingreso.val()){
		claveFrancesNueva.css("border", "1px solid red");
		claveFrancesReingreso.css("border" , "1px solid red");
		alert("Las Claves ingresadas no coinciden");
		return false;
	}
	
	claveFrancesActual = parseInt(claveFrancesActual.val());
	
	if(isNaN(claveFrancesActual)){
		$('#clave-actual').css("border", "1px solid red");
		alert("La Clave Francés debe ser númerica");
		return false;
	}
	
	claveFrancesNueva = parseInt(claveFrancesNueva.val());
	
	if(isNaN(claveFrancesNueva)){
		$('#clave-nueva').css("border", "1px solid red");
		alert("La Clave Francés debe ser númerica");
		return false;
	}
	
	claveFrancesReingreso = parseInt(claveFrancesReingreso.val());
	
	if(isNaN(claveFrancesReingreso)){
		$('#confirm-clave-nueva').css("border", "1px solid red");
		alert("La Clave Francés debe ser númerica");
		return false;
	}
	
	return true;
	
}

function callAjax(url, data, callback){
	 
	$.ajax({
			url : url,
			type : 'POST',
			data : data,
			crossDomain : true,
			cache : false,
			dataType : "json",
			beforeSend: function(xhr){
				xhr.setRequestHeader('User-Agent', 'Jakarta Commons-HttpClient/3.1');
				xhr.setRequestHeader('accept', "application/json");
			},
			success : callback,
			error : function(jqXHR, textStatus,	errorThrown) {
				$.mobile.loading('hide');
				alert("textStatus: "+ textStatus+ ", errorThrown: "+ errorThrown);
				console.log("textStatus: "+ textStatus+ ", errorThrown: "+ errorThrown);
			}
		});
}

function extractDate(date){
    
	if(date){
		var year = date.substring(0,4);
		
		var month = date.substring(4,6);
		
		var day = date.substring(6,8);
		
		console.log("The date is: " + day + "/" + month +"/" + year);
		
		return day + "/" + month +"/" + year;
		
	}else{
		return ' ';
	}
}

