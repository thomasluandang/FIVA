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

function newWindowPrint (someText) {
  var newWin = window.open('','','width=640,height=480');
  newWin.document.writeln(someText);
}

function jsSleep(timeMillis) {
  setTimeout("jsSleep_helper",timeMillis);
}

function jsSleep_helper() {

}

function formatTreemapDataOneAccount() {

}

function formatTreemapDataOneClient(clientName) {

}

function formatTreemapDataAllClients() {

}