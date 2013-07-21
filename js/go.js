//Description: sets a light's state to specific parameters and reports the outcome to the user

var getHSV = function(lightid) { 

var c=document.getElementById("fini");
var ctx=c.getContext("2d");
var img=document.getElementById("origin");
//console.log(img);
ctx.drawImage(img,img.width,img.height);
//console.log(ctx);
var imgData=ctx.getImageData(0,0,img.width,img.height);
//console.log(imgData.data);
//return false;
var retVal  = '"sat":255, "bri":110,"hue":46920';

console.log('lightid='+lightid);
lightid -=1;
lightid *=4;

/*
if (lightid == 1)
	lightid=0;
if (lightid == 2)
	lightid=4;
if (lightid == 3)
	lightid=8;
if (lightid == 4)
	lightid=12;
if (lightid == 5)
	lightid=16;
*/

for (var i=lightid; i<30; i+=4)
  {
  
    imgData.data[i]=255-imgData.data[i];
    imgData.data[i+1]=255-imgData.data[i+1];
    imgData.data[i+2]=255-imgData.data[i+2];
    imgData.data[i+3]=255;

    var rVal=imgData.data[i];
    var gVal=imgData.data[i+1];
    var bVal=imgData.data[i+2];
    var alpha = imgData.data[i+3];
    console.log('R:'+rVal+'G:'+gVal+'B:'+bVal);

//return;
	  	var min, max, delta;
	  	var hVal, sVal, vVal;
	  	min   = Math.min( rVal, gVal, bVal );
	  	max   = Math.max( rVal, gVal, bVal );
	  	vVal  = max;				// v
	  	delta = max - min;
	  	if( max != 0 )
	  		sVal = delta / max;		// s
	  	else {
	  		// r = g = b = 0		// s = 0, v is undefined
	  		sVal = 0;
	  		hVal = -1;
	  	
	  		hVal *= alpha * 60;
	  		sVal = 255;
	  		retVal = '"sat":' + Math.ceil(sVal) + ', "bri": ' + Math.ceil(vVal) + ', "hue":' + Math.ceil(hVal);
	  		console.log(retVal);
		  	//return '"sat":' + sVal + ', "bri": ' + vVal + ', "hue":' + hVal;   
		  	break;
	  	}
	  	if( rVal == max )
	  		hVal = ( gVal - bVal ) / delta;		// between yellow & magenta
	  	else if( gVal == max )
	  		hVal = 2 + ( bVal - rVal ) / delta;	// between cyan & yellow
	  	else
	  		hVal = 4 + ( rVal - gVal ) / delta;	// between magenta & cyan
	  	hVal *= alpha * 60;				// degrees
	  	if( hVal < 0 )
	  		hVal += 360;

		sVal = 255;
  		retVal = '"sat":' + Math.ceil(sVal) + ', "bri": ' + Math.ceil(vVal) + ', "hue":' + Math.ceil(hVal);
  		console.log(retVal);
	  	//return retVal;   
		break;


  }

ctx.putImageData(imgData,0,0);
return retVal;

}	


function go() {


	for(var lightid = 1; lightid <=3; lightid++) {
	
		//create variables to store the IP address of the bridge, username and the light id that will be changed
		var bridgeIpAddress = "192.168.1.144";
		var username = "KaeduITUser";
		//var lightid = 3;

		//build a variable for the API URL
		var apiUrl = "http://" + bridgeIpAddress + "/api";
		//create a new XML Http Request object for performing an AJAX call.
		var xmlhttp=new XMLHttpRequest();

		//build the URL require to set the light's state
		var commandUrl= apiUrl + "/" + username + "/lights/" + lightid + "/state";
		//build a data object for setting the light's state
		var data = '{"on":true, ' + getHSV(lightid) + ',"effect":"none","transitiontime":2}';
//return true;
		//Alternative values for the light state
		//var data = '{"on":true, "effect":"colorloop"}';

		//Send a PUT request to the specified URL, sending the data object in the request
		xmlhttp.onload = function(e)  { 

			//alert('done'); 
			  var respDiv = document.getElementById("resp");

			//check HTTP status of the response
			if (xmlhttp.status == 200) {
			  //a successful response - though this doesn't mean the device was successful executing the command

			  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
			  var response = JSON.parse(xmlhttp.response);
			  console.log(response);	  
			  respDiv.innerHTML = "changing Color";


			  if(response[0].success) {
			    respDiv.innerHTML = "changed Color";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			  else {
			    respDiv.innerHTML = "Error changing Color";
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