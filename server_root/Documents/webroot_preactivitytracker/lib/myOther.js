function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function requestHTTP (url) {
	var request = makeHttpObject();
	
	request.open("GET", url, false);
	request.send(null);
	return request.responseText;
}


function formatTreemapDataOneAccount() {

}

function formatTreemapDataOneClient(clientName) {

}

function formatTreemapDataAllClients() {

}