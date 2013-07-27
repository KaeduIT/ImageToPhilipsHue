//Description: sets a light's state to specific parameters and reports the outcome to the user

var geocoder;
var map;
var loaded;
var loadedSendIcon;
var intervalID, fourDayIntervalID;

var IconToHue =
{
	mostlysunny: 	'{"on":true, "sat":110, "bri":110,  "hue":10000,  "effect":"none",  "transitiontime":2}',
	partlysunny: 	'{"on":true, "sat":110, "bri":110,  "hue":14000,  "effect":"none",  "transitiontime":2}',
	sunny:	 		'{"on":true, "sat":255, "bri":255,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancerain: 	'{"on":true, "sat":100, "bri":110,  "hue":46920,  "effect":"none",  "transitiontime":2}',
	rain: 			'{"on":true, "sat":255, "bri":110,  "hue":46920,  "effect":"none",  "transitiontime":2}',
	clear: 			'{"on":true, "sat":0,   "bri":255,  "hue":0,      "effect":"none",  "transitiontime":2}',
	fog: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	hazy: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chanceflurries: '{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	flurries: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancetstorms:  '{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	tstorms: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	mostlycloudy: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	partlycloudy: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	cloudy: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancesnow: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	snow: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancesleet: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	sleet: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}'
};

function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {zoom: 12,center: new google.maps.LatLng(-34.397, 150.644),mapTypeId: google.maps.MapTypeId.ROADMAP}
  	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  	codeAddress();
}


function codeAddress() {
	var address = document.getElementById('userpostcode').value;
	if (address == undefined || address == '') {
		alert('Please enter postcode');
		return false;
	}

  	geocoder.geocode( { 'address': address}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
      		map.setCenter(results[0].geometry.location);
      		var marker = new google.maps.Marker({map: map,position: results[0].geometry.location});
			getWeatherData(results[0].geometry.location);
    	} else {
      		alert('Geocode was not successful for the following reason: ' + status);
    	}
  	});

 	var weatherLayer = new google.maps.weather.WeatherLayer({ temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS });
  	weatherLayer.setMap(map);
}


function loadGoogleAPIs() {

	if(loaded != undefined) {
	  	codeAddress();
	  	return false;
	}

	var address = document.getElementById('userpostcode').value;
	if (address == undefined || address == '') {
		alert('Please enter postcode');
		return false;
	}

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?libraries=weather&key=AIzaSyAzXTZuQDR7IrRkIbdDbK3ifa6rfMey6_4&sensor=false&callback=initialize";
	document.body.appendChild(script);

	loaded = true;
}

function loadToSendIcon() {

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "go.js";
	document.body.appendChild(script);

	loadedSendIcon = true;
}

var getWeatherData = function(location) {

		var weatherApiUrl = "http://api.wunderground.com/api/bd1c30b5b39f3dce/geolookup/conditions/forecast/lang:EN/q/"+location.lat()+","+location.lng()+".json";
		var jqxhr = $.ajax({
					async: 			true,
					type: 			"GET",
					dataType: 		"jsonp",
					crossDomain:	true,
					contentType: 	"application/javascript",
					url: 			weatherApiUrl,
					jsonpCallback: 	"callback"
		});
}

function callback(result) {

	for (var i=0; i<result.forecast.txt_forecast.forecastday.length; i++) {
		intervalID = setInterval(sendImage(result.forecast.txt_forecast.forecastday[i]), 43200000);	//every 12HRS
	}
	//
	//set interval for the reminders, call the server for the new data every 4 days
	//
	fourDayIntervalID = setInterval(codeAddress, 345600000);	//every 4Days

}

var sendImage = function(forecastdayresult) {

	document.getElementById('origin').src = forecastdayresult.icon_url;
	var data = IconToHue[forecastdayresult.icon];

	//create variables to store the IP address of the bridge, username and the light id that will be changed
	if(document.getElementById("lightcount").value != '')
		alert('Please click on the \'Get All Lights button\' to detect the connected lights.');
	var lightcount = document.getElementById("lightcount").value != '' ? document.getElementById("lightcount").value : 3;

	var username = document.getElementById("addusername").value;
	if ( username.length < 10 || username.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	//build a variable for the API URL
	var apiUrl = "http://" + bridgeIpAddress + "/api";
	//contact the weather service and get the current weather information

	// if there are enough lights for the weather.com icon grid, send the icon
	if (lightcount >= 2500) {
		if(loadedSendIcon == undefined) { loadToSendIcon(); }
		go();
		return false;
	}

	for(var lightid = 1; lightid <=lightcount; lightid++) {

		//create a new XML Http Request object for performing an AJAX call.
		var xmlhttp=new XMLHttpRequest();

		//build the URL require to set the light's state
		var commandUrl= apiUrl + "/" + username + "/lights/" + lightid + "/state";
		//build a data object for setting the light's state
		//var data = '{"on":true, "sat":255, "bri":110,"hue":46920,"effect":"none","transitiontime":2}';

		//Alternative values for the light state
		//var data = '{"on":true, "effect":"colorloop"}';

		//Send a PUT request to the specified URL, sending the data object in the request
		xmlhttp.onload = function(e)  {

			//alert('done');
			  var respDiv = document.getElementById("weatherserviceresp");

			//check HTTP status of the response
			if (xmlhttp.status == 200) {
			  //a successful response - though this doesn't mean the device was successful executing the command

			  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
			  var response = JSON.parse(xmlhttp.response);
//			  console.log(response);
			  respDiv.innerHTML = "updating weather information";


			  if(response[0].success) {
			    respDiv.innerHTML = "updated weather information";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			  else {
			    respDiv.innerHTML = "Error";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			}
			else {
			  respDiv.innerHTML = "Error " + xmlhttp.status + " during request: " + xmlhttp.statusText;
			  respDiv.innerHTML += xmlhttp.response;
			}

		}

		xmlhttp.open("PUT", commandUrl, true);
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(data);
	}
}


var stopAlerts = function() {
	clearInterval(intervalID);
	clearInterval(fourDayIntervalID );
	intervalID 		  = undefined;
	fourDayIntervalID = undefined;
}


