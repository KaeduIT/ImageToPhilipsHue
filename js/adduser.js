function addUser() {

	var bridgeIpAddress   	= "192.168.1.144";
	var apiUrl 		= "http://" + bridgeIpAddress + "/api";
	var data 		= '{"devicetype": "KaeduITDevice", "username": "KaeduITUser"}';

	//create a new XML Http Request object for performing an AJAX call.
	var xmlhttp=new XMLHttpRequest();

	xmlhttp.open("POST", apiUrl, false);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");
	xmlhttp.send(data);

	//check HTTP status of the response
	if (xmlhttp.status == 200) {
	
	alert('200');

	  //a successful response - though this doesn't mean the device was successful executing the command

	  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
	  var response = JSON.parse(xmlhttp.response);
	  
	  console.log(response);	  
	  var respDiv = document.getElementById("resp");
          respDiv.innerHTML = "adding User";
	  
	  
	  
	  if(response[0].success) {
	    respDiv.innerHTML = "User Added";
	    respDiv.innerHTML += xmlhttp.response;
	  }
	  else {
	    respDiv.innerHTML = "Error adding user";
	    respDiv.innerHTML += xmlhttp.response;
	  }
	}
	else {
	  respDiv.innerHTML = "Error " + xmlhttp.status + " during request: " + xmlhttp.statusText;
	  respDiv.innerHTML += xmlhttp.response;
	}

}