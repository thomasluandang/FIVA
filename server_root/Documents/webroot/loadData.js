var gClientList;
var gConstClientListFile = "/data/clientlist.json";

var gPriceData;
var gConstPriceDataFile = "/data/prices.csv";

var gActionHistory;
var gActionHistoryFile = "/data/login.json";

var gAccountData;
var gConstAcctFileFormat = "csv";

var gStartYear = 2012;
var gEndYear = 2026;
var gPriceSheetStartYear = 2012;

var gPriceTablePageCompleted = false;
var gIncomeGoalTablePageCompleted = false;
var gBulletChartPageCompleted = false;
var gTreemapPageCompleted = false;

// 0: all clients with all accounts; 1: one client with all accounts; 2: currently selected account only
var gTreemapZoomLevel = 0; 
var gTreemapDataPointer;
var gTreemapOneClientCache;
var gTreemapOneAcctCache;
var gTreemapFirstLoad = true;


function getTreemapDataOneAccount(clientName, accountName) {
	
	var tempOneAccountJSONString = "{ \"root\": { "; // Must convert from the [{}] JSON style to the {{}}
	var tempAccountRowJSON;
	var tempYear = 0;
	var tempCOI = 0;
	
	tempOneAccountJSONString += "\"" + clientName + "\": { " + "\"" + accountName + "\": { ";
	
	
	for (i = 0; i < gAccountData.length; i++) {
		tempAccountRowJSON = gAccountData[i];
		
		tempYear = tempAccountRowJSON["year"];
		
		if (isNaN(tempYear)) {
			tempCOI = -parseInt(gAccountData[i]["coi"]);
		} else if (parseInt(tempYear) < gPriceSheetStartYear) {
			tempCOI = calculatePastCOI(parseInt(tempYear));
		} else {
			tempCOI = calculateCOI(parseInt(tempYear));
		}
		
		if (tempCOI == 0) {
			tempCOI = 1;
		}
		
		tempOneAccountJSONString += ("\"" + tempYear + "\"" + ":" + parseInt(tempCOI));
		
		if (i < (gAccountData.length - 1)) {
			tempOneAccountJSONString += ",";
		}
	
	}
	
	tempOneAccountJSONString +=  " }}}}";
	//document.writeln(tempOneAccountJSONString);
	gTreemapOneAcctCache = JSON.parse(tempOneAccountJSONString);
	/*d3.json("data/oldData/accountdata.json", function (json) {
			gTreemapOneAcctCache = json;
		}
	);*/
}

function getTreemapDataOneClient(clientName) {
	
	updateCurrentTotalCOI();
	
	gTreemapOneClientCache = JSON.parse("{ \"root\": { \"" + clientName + "\":" + JSON.stringify(gClientList["root"][clientName]) + "}}");
	/*d3.json("data/oldData/oneClientSample1.json", function (json) {
			gTreemapOneClientCache = json;
		}
	);*/
}

function getTreemapDataAllClients() {
	
	if (gTreemapFirstLoad) {
		readClientList();
		gTreemapFirstLoad = false;
	}
	
	for (obj in gClientList) {
	// ignore root node
	
		for (client in gClientList[obj]) {
			
			for (account in gClientList[obj][client]) {
				
				setAccountTotalCOI (client, account, calculateTotalCOI(client, account));
			}
		}
	}
	
	updateCurrentTotalCOI();
}

function readActionHistory () {
	d3.json(gActionHistoryFile, function (json) {
			gActionHistory = json;
		}
	);
}

function readClientList ()
{
	// gClientList = eval(requestHTTP(gConstClientListFile));
	d3.json(gConstClientListFile, function (json) {
			gClientList = json;
		}
	);
}

function readPriceData ()
{
	gPriceData = eval(csv2json(requestHTTP(gConstPriceDataFile)));
}


function loadAccountData (clientDirName, acctFileName) {
	
	gAccountData = readAccountDataHelper(clientDirName, acctFileName);
	
}

function readAccountDataHelper (clientDirName, acctFileName) {
	var filePathStr = "/data/" + clientDirName + "/" + acctFileName + "." + gConstAcctFileFormat;
	
	//alert(filePathStr);
	return eval(csv2json(requestHTTP(filePathStr)));
}

function gInit () // the initial data read, populating lists, etc.
{
	document.getElementById("doesAutoUpdate").checked = true;

	document.getElementById("showConfigurationActions").checked = true;
	document.getElementById("showNavigationalActions").checked = true;
	document.getElementById("showDataModifications").checked = true;

	readClientList();
	 
	readPriceData();

	readActionHistory();
	
	populateClientSelect();
	
	var ClientSelect =  document.getElementById("ClientSelect");

	var UsernameField = document.getElementById("CurrentUsernameLabel");

	UsernameField.innerHTML = "CurrentUser: " + username;
	
	populateAccountSelect(ClientSelect.options[ClientSelect.selectedIndex].value);
	
	firstDraw();

	// DEMO!
	loginDemo();
		
}

function saveDataOnDiskOnClick () {
	var newWindow = window.open('/current.zip','');
	window.focus();
	/*var now = new Date();
	var saveDir = "\"/data/saves/" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "/\"";
	alert ("File list being saved to " + saveDir + "\n\nError: Feature currently disabled due to security issues with browser");
	*/
	/*var destinationFile = saveDir + "/test.json";
	
	var file = fopen(destinationFile, 3);
	fwrite (file, JSON.stringify(gClientList));
	
	document.getElementById("epic4thWallBreaking").innerHTML = 
	"<applet code=\"writeFileHelperApplet.class\" width=\"350\" height=\"350\"></applet>";
	
	document.getElementById("accountDataHiddenText").innerHTML = JSON.stringify(gAccountData);*/
}

function searchOnClick (isUserInduced) {

	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	var searchBox = document.getElementById("SearchBox");
	var ClientSelect = document.getElementById("ClientSelect");
	var clientName = searchBox.value;

	if (isUserInduced) {
		insertSearchAction(searchBox.value);
	}

	for (i=0; i<ClientSelect.options.length; i++) {
		if (clientName == ClientSelect.options[i].value) {
			ClientSelect.selectedIndex = i;
			ClientSelectOnChange(isUserInduced);
			return i;
		}
	}
	window.alert("client " + clientName + " not found");
}

function getClientListJson ()
{
	if (gClientList == null) {
		// TODO: deal with this case
	}
	
	return gClientList;
}

function getActionHistoryJson () {
	if (gActionHistory == null) {} else return gActionHistory;
}

/* function actionHistory_getArrayContainingCriticalPath () {
	var retArray = new Array();
	var tempLevel;
	var currentAction = null;

	// first, find the current
	for (obj in gActionHistory) { // ignore root node
		tempLevel = gActionHistory[obj]; // tempLevel begins as one of the actions right below the root node (if there is any)

		do {
				// get the parameter in the current JSON object of the current level (which is always an action)
				for (tempParameter in tempLevel) {
					if (tempParameter == "CurrentNode") {
						if (tempLevel[tempParameter] == 1) {
							currentAction = tempLevel;
						}
					}
				}			
			}
		} while (currentAction == null);
	}
} */

function getArrayOfClientStrings () {
	var retArray = new Array();
	for (obj in gClientList) {
		// ignore root node
		for (client in gClientList[obj]) {
			retArray.push(client);
		}
	}
	return retArray;
}

function getArrayOfClientObjects () {
	var retArray = new Array();
	for (obj in gClientList) {
		// ignore root node
		for (client in gClientList[obj]) {
			retArray.push(gClientList[client]);
		}
	}
	return retArray;
}

function getArrayOfAccountStrings (clientName) {
	var retArray = new Array();
	for (obj in gClientList) {
		// ignore root node
		for (client in gClientList[obj]) {
			if (client == clientName) {
				for (account in gClientList[obj][client]) {
					retArray.push(account);
				}
			}
		}
	}
	return retArray;
}

function getArrayOfAccountObjects (clientName) {
	for (obj in gClientList) {
		// ignore root node
		for (client in gClientList[obj]) {
			if (client == clientName) {
				return gClientList[client];
			}
		}
	}
	return null;
}

function EmptyAccountSelect() {
	var AccountSelect = document.getElementById("AccountSelect");
	
	while (AccountSelect.length > 0) {
		AccountSelect.remove(0);
	}
}

function EmptyClientSelect() {
	var ClientSelect = document.getElementById("ClientSelect");
	
	while (ClientSelect.length > 0) {
		ClientSelect.remove(0);
	}
}


function ClientSelectOnChange(isUserInduced) {

	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	var ClientSelect = document.getElementById("ClientSelect");
	// alert(ClientSelect.options[ClientSelect.selectedIndex].value);
	populateAccountSelect (ClientSelect.options[ClientSelect.selectedIndex].value);
	
	if (isUserInduced) {
		insertChangeClientAction("unused", ClientSelect.options[ClientSelect.selectedIndex].value);
	}

	// AccountSelectOnChange called too, because the account list has changed entirely, so update and rerender needed
	accountSelectOnChange(false);

	
}


function populateAccountSelect(client) {

	EmptyAccountSelect();
	
	var AccountSelect = document.getElementById("AccountSelect");
	
	var AccountList = getArrayOfAccountStrings(client);
	
	for (i=0;i<AccountList.length;i++) { 
		AccountSelect.add(new Option(AccountList[i], AccountList[i]),null);
	}
	
	// reset selected index to 0 because the client selected must have change (or just init'ed) for this
	// to be called
	AccountSelect.selectedIndex = 0;
	
}

function populateClientSelect() {
	EmptyClientSelect();
	
	var ClientSelect = document.getElementById("ClientSelect");
	
	var ClientList = getArrayOfClientStrings();
	
	for (i=0; i<ClientList.length; i++) {
		ClientSelect.add(new Option(ClientList[i], ClientList[i]),null);
	}
	ClientSelect.selectedIndex = 0;
	
}

function updateTreemapLabel (client, account)
{
	var currClientLabel = document.getElementById("CurrentClientLabel");
	var currAcctLabel = document.getElementById("CurrentAccountLabel");
	var treemapLabel = document.getElementById("TreeMapLabel");
	
	var zoomLevelStr;
	
	if (gTreemapZoomLevel == 0) {
		zoomLevelStr = "All clients";
	} else if (gTreemapZoomLevel == 1) {
		zoomLevelStr = "One client";
	} else {
		zoomLevelStr = "One account in one client";
	}
	
	currClientLabel.innerHTML = "<span class=\"size14text\" id=\"CurrentClientLabel\">Current Client: <strong>" +  getCurrentClient().value + "</strong></span> ";
	currAcctLabel.innerHTML = "<span class=\"size14text\" id=\"CurrentClientLabel\">Current Account: <strong>" +  getCurrentAccount().value + "</strong></span> ";
	treemapLabel.innerHTML = "<span class=\"size14text\" id=\"CurrentClientLabel\">Surplus / Deficit Treemap: Zoom Level: <strong>" + zoomLevelStr + "</strong></span> ";	
}

function firstDraw(){
	// Update the text label on the treemap
	var AccountSelect =  document.getElementById("AccountSelect");
	var ClientSelect =  document.getElementById("ClientSelect");
	updateTreemapLabel(ClientSelect.options[ClientSelect.selectedIndex],AccountSelect.options[AccountSelect.selectedIndex]);

	// Reload Account Data to the gCurrAcctData variable
	loadAccountData(ClientSelect.options[ClientSelect.selectedIndex].value,AccountSelect.options[AccountSelect.selectedIndex].value); 

	//document.writeln(JSON.stringify (gAccountData));

	// Update global state starting year and ending year
	// gStartingYear = smaller between start of incomegoaltable and price table (always preloaded)
	// gEndingYear = smaller between start of incomegoaltable and price table
	updateStartEndYear();
	
	// render all the first time
	renderAll();
	

}

function updateVisualization() {
	reRenderAll();
}

function accountSelectOnChange(isUserInduced) {

	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	var AccountSelect =  document.getElementById("AccountSelect");
	var ClientSelect =  document.getElementById("ClientSelect");

	updateTreemapLabel(ClientSelect.options[ClientSelect.selectedIndex],AccountSelect.options[AccountSelect.selectedIndex]);

	loadAccountData(ClientSelect.options[ClientSelect.selectedIndex].value,AccountSelect.options[AccountSelect.selectedIndex].value); 

	updateStartEndYear();
	
	renderAll();

	if (isUserInduced) {
		insertChangeAccountAction("unused", AccountSelect.options[AccountSelect.selectedIndex].value);
	}
		
}

function showConfigurationActionsOnChange() {
	// DEMO!
	setAutoRedrawDemo();
}

function showNavigationalActionsOnChange() {
	// DEMO!
	filterOutNavigationsDemo();
}

function doesAutoUpdateOnChange(isUserInduced) {

	var AutoUpdateBox = document.getElementById("doesAutoUpdate");

	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	if (isUserInduced) {
		insertChangeAutoUpdateAction(AutoUpdateBox.checked);
	}	
}

function updateStartEndYear () {
	updateStartEndYearHelper(gAccountData);
}

function updateStartEndYearHelper (accountData) {
	var startYearInAccount = accountData[0]["year"];
	var startYearInPrices = gPriceData[0]["year"];
	
	
	var endYearInAccount = startYearInAccount;
	var tempValue = 0;
	for (i=0; i<accountData.length; i++) {
		
		tempValue = accountData[i]["year"];
		
		if (!isNaN(tempValue)) { 
				endYearInAccount = tempValue;
			}
		else {
			break;
		}
	}
	
	var endYearInPrices = gPriceData[gPriceData.length - 1]["year"];
	
	gStartYear = startYearInAccount;
	gEndYear = endYearInAccount;
	
	// NOTE: should not change regardless of the account
	gPriceSheetStartYear = startYearInPrices;
	
}

function renderAll () {

	if (gIncomeGoalTablePageCompleted) {
		getIncomeGoalTableUI().reRender();
	}
	
	if (gBulletChartPageCompleted) {
		gBulletChartPageCompleted = false;
		getBulletChartUI().location.reload();
	}
	
	if (gPriceTablePageCompleted) { 
		getPriceTableUI().reRender();
	}

	treemapReload();
}

function reRenderAll () {

	// TODO: BUG here, the gAccountData pointer currently points to the newest file that is loaded
	// so whenever accountSelectOnChange is called, with a new account loaded, any changes on the old
	// account is lost. Should be persistent here.
	if (gIncomeGoalTablePageCompleted) {
		getIncomeGoalTableUI().reRender();
	}
	
	if (gBulletChartPageCompleted) {
		gBulletChartPageCompleted = false;
		getBulletChartUI().transition();
	}
	
	if (gPriceTablePageCompleted) { 
		getPriceTableUI().reRender();
	}

	treemapReload();
}

function treemapZoomInOnClick (isUserInduced) {

	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	// Disable the zoomInButton if the zoomLevel maxed out
	if (gTreemapZoomLevel < 2) {
		
		if (isUserInduced) {
			insertZoomInAction(gTreemapZoomLevel, (gTreemapZoomLevel+1));
		}

		// Update the zoomLevel state variable
		gTreemapZoomLevel++;
		
		// Update treemap label
		var AccountSelect =  document.getElementById("AccountSelect");
		var ClientSelect =  document.getElementById("ClientSelect");
		updateTreemapLabel(ClientSelect.options[ClientSelect.selectedIndex],AccountSelect.options[AccountSelect.selectedIndex]);

		// Reload the whole treemap with appropriate level of data
		// Rerender treemap, this should be its own function because it depends on the level of zoom
		treemapReload();
	}
}


function treemapReload () {

		var ClientSelect = document.getElementById("ClientSelect");
		var AccountSelect =  document.getElementById("AccountSelect");
		var selectedClient = ClientSelect.options[ClientSelect.selectedIndex].value;
		var selectedAccount = AccountSelect.options[AccountSelect.selectedIndex].value;

		// procuring the data
		if (gTreemapZoomLevel == 0) {
		
			getTreemapDataAllClients();
			gTreemapDataPointer = gClientList;
		} else if (gTreemapZoomLevel == 1) {
		
			getTreemapDataOneClient(selectedClient);
			gTreemapDataPointer = gTreemapOneClientCache;
		} else if (gTreemapZoomLevel == 2) {
		
			getTreemapDataOneAccount(selectedClient, selectedAccount);
			gTreemapDataPointer = gTreemapOneAcctCache;
			//document.writeln(JSON.stringify(gTreemapDataPointer));
		}
	
	// reloading the treemap
	if (gTreemapPageCompleted) {
	    gTreemapPageCompleted = false;
		getTreemapUI().location.reload();
	}
}

function treemapZoomOutOnClick (isUserInduced) {
	
	isUserInduced = (typeof isUserInduced !== 'undefined' ? isUserInduced : true);

	// Disable the zoomOutButton if zoomLevel maxed Out
	if (gTreemapZoomLevel > 0) {
	
		if (isUserInduced) {
			insertZoomOutAction(gTreemapZoomLevel, (gTreemapZoomLevel+1));
		}

		// TODO: Button states in graphics 
		
		// Update the zoomLevel state variable
		gTreemapZoomLevel--;
		
		// Update treemap label
		var AccountSelect =  document.getElementById("AccountSelect");
		var ClientSelect =  document.getElementById("ClientSelect");
		updateTreemapLabel(ClientSelect.options[ClientSelect.selectedIndex],AccountSelect.options[AccountSelect.selectedIndex]);

		// Reload the whole treemap with appropriate level of data
		// Rerender treemap, this should be its own function because it depends on the level of zoom
		treemapReload();
	}
}

// Functions for getting the various elements
function getTreemapUI () {
	return document.getElementById('Cifer').contentWindow;
}

function getIncomeGoalTableUI () {
	return document.getElementById('Cifer2').contentWindow;
}

function getBulletChartUI () {
	return document.getElementById('Cifer3').contentWindow;
}

function getPriceTableUI () {
	return document.getElementById('Cifer4').contentWindow;
}

// Functions for editing the current JSON data in memory
function getCurrentClient () {

	var ClientSelect = document.getElementById("ClientSelect");
	
	return ClientSelect.options[ClientSelect.selectedIndex];
}

function getCurrentAccount () {
	
	var AccountSelect = document.getElementById("AccountSelect");
	
	return AccountSelect.options[AccountSelect.selectedIndex];
}

function calculateCurrentTotalOI () {
	
	var totalOI = 0;
	var tempGoal = 0;
	var tempHoldings = 0;
	for (i=0; i<gAccountData.length; i++) {
		
		tempGoal = gAccountData[i]["goal"];
		tempHolding = gAccountData[i]["holdings"];
		
		totalOI += (tempGoal - tempHolding);		
	}
	return totalOI;
}

function calculateCurrentTotalCOI () {
	return calculateTotalCOIHelper (gAccountData);
}

function calculateTotalCOI (clientName, accountName) {
	var accountData = readAccountDataHelper (clientName, accountName);
	return calculateTotalCOIHelper (accountData);
}

function calculateTotalCOIHelper (accountData) {
	
	
	updateStartEndYearHelper(accountData);
	var startYear = parseInt(gStartYear);
	var endYear = parseInt(gEndYear);
	
	var totalCOI = 0;
	var totalProceedFromCouponSale = 0;
	var totalCOIforDeficitYears = 0;
	var totalMiscAssets = 0;
	
	var tempGoal = 0;
	var tempHoldings = 0;
	var tempCOI = 0;
	for (yearIndex=0; yearIndex<accountData.length; yearIndex++) {
		
		if ((startYear + yearIndex) < gPriceSheetStartYear) { // no price data to calculate from, take the COI value put there before
			
			tempCOI = (parseInt(accountData[yearIndex]["goal"]) - parseInt(accountData[yearIndex]["holdings"]));
			
			if (tempCOI > 0) { // deficit
				totalCOIforDeficitYears += tempCOI;
			} else { // surplus
				totalProceedFromCouponSale += tempCOI;
			}
			
			//document.writeln(tempCOI);
			continue;
		}
		
		if ((startYear + yearIndex) > endYear) { // no price data to calculate from, take the COI value put there before
			
			totalMiscAssets += parseInt(accountData[yearIndex]["coi"]);
			// document.writeln(parseInt(accountData[yearIndex]["coi"]));
			continue;
		}
		
		{
		
			tempGoal = parseInt(accountData[yearIndex]["goal"]);
			tempHolding = parseInt(accountData[yearIndex]["holdings"]);
			
			tempCOI = parseInt((tempGoal - tempHolding) * (parseFloat(getPrice(startYear + yearIndex)) / 100.0));
			
			if (tempCOI > 0) { // deficit
				totalCOIforDeficitYears += tempCOI;
			} else { // surplus
				totalProceedFromCouponSale += tempCOI;
			}
			
			//document.writeln(tempCOI);
			continue;
		}
						
	}
	
	totalProceedFromCouponSale = -(totalProceedFromCouponSale * 0.97); // commission, TODO: magic number
	 
	totalCOI += ((totalProceedFromCouponSale + totalMiscAssets) - totalCOIforDeficitYears);
	
	// document.writeln (clientName + " " + accountName + " " + gStartYear + " to " + gEndYear + ": " + parseInt(totalProceedFromCouponSale) + " " + parseInt(totalCOIforDeficitYears) + " " + parseInt(totalMiscAssets) + " " + " " + parseInt(totalCOI) + "<br>");
	
	return parseInt(-totalCOI); // NOTE: the logic in the excel sheets has all the sign flips like this, will figure out why later
}

function updateCurrentTotalCOI () {
	
	setAccountTotalCOI (getCurrentClient().value, getCurrentAccount().value, calculateCurrentTotalCOI());
}

function setAccountTotalCOI (clientName, accountName, value) {
	
	gClientList["root"][clientName][accountName] = value;
}

function getAccountTotalCOI (clientName, accountName) {
	
	return gClientList["root"][clientName][accountName];
}

function setAccountGoal (year, value) {
	
	var startYear = gAccountData[0]["year"];
	var yearIndex = year - startYear;
	gAccountData[yearIndex]["goal"] = value;
	
	//alert(JSON.stringify(gAccountData));
}

function setAccountHoldings (year, value) {
		
	var startYear = gAccountData[0]["year"];
	var yearIndex = year - startYear;
	
	gAccountData[yearIndex]["holdings"] = value;
}

function getAccountGoal (year) {
	
	var startYear = gAccountData[0]["year"];
	var yearIndex = year - startYear;
	
	return gAccountData[yearIndex]["goal"];	
}

function getAccountHoldings (year) {
	
	var startYear = gAccountData[0]["year"];
	var yearIndex = year - startYear;
	
	return gAccountData[yearIndex]["holdings"];
}

function setPrice (year, value) {
	var yearIndex = year - gPriceSheetStartYear;
	
	// alert (year + " " + gPriceSheetStartYear);
	
	gPriceData[yearIndex]["price"] = value; 
}

function getPrice (year) {

	var yearIndex = year - gPriceSheetStartYear;
	
	return gPriceData[yearIndex]["price"]; 
}

function setYield (year, value) {
	// TODO: nothing for now because this value is not used yet
}

function getYield (year) {
	// TODO: nothing for now because this value is not used yet
}

function calculateOutstandingIncome (year) {
	return parseInt(getAccountGoal(year)) - parseInt(getAccountHoldings(year));
	
	// TODO: deal with not a number case
}

function getExistingCOI (year) {
	for (i=0; i<gAccountData.length; i++) {
	
		if (gAccountData[i]["year"] == year) {
			return parseInt(gAccountData[i]["coi"]);
		}
	}
	return -1;
}

function calculatePastCOI (year) {
	
	return (calculateOutstandingIncome(year));
	
	// TODO: deal with not a number case
}

function calculateCOI (year) {
	
	return (parseFloat(getPrice(year) / 100.0) * calculateOutstandingIncome(year));
	
	// TODO: deal with not a number case
} 

function logout() {

}

function undo() {

}

function redo() {

}
