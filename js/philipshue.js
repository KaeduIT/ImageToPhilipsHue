function button2() {
	var resp = '{"1": {"name": "Bedroom"},"2": {"name": "Kitchen"}}';

//	console.log(JSON.parse(resp));
//	console.log(Object.keys(JSON.parse(resp)).length);

	var lightcountCtl   = document.getElementById("lightcount");
	lightcountCtl.value = Object.keys(JSON.parse(resp)).length;

	var respDiv = document.getElementById("sendimageresp");
	respDiv.innerHTML = resp;
	return resp;
}


