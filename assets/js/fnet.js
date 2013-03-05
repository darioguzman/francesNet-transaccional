
   	baseUrl = '';
   	$( document ).bind( "mobileinit", function() {
	    // Make your jQuery Mobile framework configuration changes here!
   		$.support.cors = true;
	    $.mobile.allowCrossDomainPages = true;
	    $.mobile.page.prototype.options.addBackBtn = true;
		
	});
   	
function insertDataProv(data){
	
	$("#ul-prov").append("" +
			"<li>" +
				"<a id='provincia-" + data.id + "' >" +
						"<span class=''>" +
							"<h3 class='ui-li-heading'>" + data.nombre+ "</h3>" +
						"</span>" +
				"</a>" +
			"</li>");
   		
}
   	
function insertDataLoc(data){
   		
   		$("#ul-loc").append("" +
			"<li>" +
				"<a id='localidad-" + data.idLocalidad + "' >" +
						"<span class=''>" +
							"<h3 class='ui-li-heading'>" + data.nombre+ "</h3>" +
						"</span>" +
				"</a>" +
			"</li>");
   		
   	}


function insertDataBarrio(data){
	
	$("#ul-bar").append("" +
	"<li>" +
		"<a id='barrio-" + data.id + "' >" +
				"<span class=''>" +
					"<h3 class='ui-li-heading'>" + data.nombre+ "</h3>" +
				"</span>" +
		"</a>" +
	"</li>");
	
}

function sendRequest(url,callback,postData) {
	try{
	var req = createXMLHTTPObject();
	
	if (!req) return;
	
	var method = (postData) ? "POST" : "GET";
	
	req.overrideMimeType('application/json');

	req.open(method,url,true);
	
	//req.setRequestHeader('User-Agent','XMLHTTP/1.0');

	if (postData){
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	}
	req.onreadystatechange = function () {
		if (req.readyState == 4 && (req.status == 200 || window.location.href.indexOf ("http") == - 1)){
			
		//	console.log('datos: ' + JSON.parse(req.responseText));
			
			callback(req);
		}
	}
	
	req.send(postData);
	}catch(e){
		console.log('error ' + e);
	}
		
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function checkNavigator(url, callBack, postData){
	
	var ua = navigator.userAgent;

	if (ua.indexOf("BlackBerry") >= 0) {
        if (ua.indexOf("Version/") >= 0) { // ***User Agent in BlackBerry 6 and BlackBerry 7
            Verposition = ua.indexOf("Version/") + 8;
            TotLenght = ua.length;
            alert("BB OS Version: " + ua.substring(Verposition, Verposition + 3));
            alert("call $.ajax")
        }
        else {// ***User Agent in BlackBerry Device Software 4.2 to 5.0
            var SplitUA = ua.split("/");
            alert("BB OS Version: " + SplitUA[1].substring(0, 3));
            alert("call XMLHttp")
            sendRequest(url,callBack,postData);
            return ;
        }
    }

}