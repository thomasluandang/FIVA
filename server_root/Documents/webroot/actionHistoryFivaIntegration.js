// this is a library that integrates the action history visualization into FIVA
// it provides function for applying history nodes to a base data structure of fiva
// to create temporary states that would then be used by the visualizations in FIVA

// TODO: Eventually all the variables that data is loaded into in memory should be
// refactored into a separate .js file, and then included with the script tag inside
// the appropriate html file (fiva09.tpl etc.).

// Some constants, these are action types that is only related to FIVA
var gConstActionNames = JSON.parse("{ \"changeGoal\":\"changeGoal\",\"changeIncome\":\"changeIncome\",\"changeCouponPrice\":\"changeCouponPrice\",\"changeYield\":\"changeYield\",\"changeClient\":\"changeClient\",\"changeAccount\":\"changeAccount\",\"zoomIn\":\"zoomIn\",\"zoomOut\":\"zoomOut\",\"Save\":\"Save\",\"Search\":\"Search\",\"ChangeAutoUpdate\":\"setAutoRedraw\"}" );

// constructors for FIVA specific action types
function newChangeGoal(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeGoal, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangeIncome(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeIncome, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangePrice(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeCouponPrice, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangeYield(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeYield, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangeClient(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeClient, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangeAccount(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.changeAccount, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newZoomIn(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.zoomIn, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newZoomOut(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.zoomOut, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newSearch(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.Search, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newChangeAutoUpdate(user, oldval, newval, year, client, acct, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.ChangeAutoUpdate, user, oldval, newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function newSave(user, comment, attachments) {
	var newNode = newActionNode
		(gConstActionNames.Save, user, "unused", newval, year, 
			client, acct, comment, attachments, 1, 1);
	return newNode;
}

function submitAnnotation(AnnotationText) {
	forceNodeRefreshNextUpdate();

	var currentNode = getActionTreeUI().findCurrentNode();
	currentNode.TextComment = AnnotationText;
	getActionTreeUI().reRenderActionTree();
}

// TODO: remove all the demo hardcoded values, replace with real logic (in progress, some of this 
// are already integrated).

function insertChangeGoalAction(year, oldVal, newVal) {
	
	var testChangeGoal = newChangeGoal("Cifer", oldVal, newVal, year, "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeGoal, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangeIncomeAction(year, oldVal, newVal) {
	
	var testChangeIncome = newChangeIncome("Cifer", oldVal, newVal, year, "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeIncome, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangePriceAction(year, oldVal, newVal) {
	
	var testChangePrice = newChangePrice("Cifer", oldVal, newVal, year, "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangePrice, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangeYieldAction(year, oldVal, newVal) {
	
	var testChangeYield = newChangeYield("Cifer", oldVal, newVal, year, "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeYield, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangeClientAction(oldVal, newVal) {
	
	var testChangeClient = newChangeClient("Cifer", oldVal, newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeClient, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangeAccountAction(oldVal, newVal) {

	var testChangeAccount = newChangeAccount("Cifer", oldVal, newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeAccount, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertZoomInAction(oldVal, newVal) {

	var testZoomIn = newZoomIn("Cifer", oldVal, newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testZoomIn, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertZoomOutAction(oldVal, newVal) {

	var testZoomOut = newZoomOut("Cifer", oldVal, newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testZoomOut, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertSearchAction(newVal) {

	var testSearch = newSearch("Cifer", "unused", newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testSearch, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function insertChangeAutoUpdateAction(newVal) {

	var testChangeAutoUpdate = newChangeAutoUpdate("Cifer", "unused", newVal, "unused", "unused", "unused", "unused", "unused");
				
	var newNode = getActionTreeUI().insertAtCurrentNode(testChangeAutoUpdate, getActionTreeUI().gActionTreeData);

	getActionTreeUI().unsetAndSetNewCurrentNode(newNode);

	getActionTreeUI().loadDataAndRenderHelper(getActionTreeUI().gActionTreeData, true);		
}

function applyActionNode (actionNode) {
	// TODO:
}

// Apply critical path, given a root node of a critical path, apply every critical
// nodes sequentially onto the data until you get to the current states
function applyCriticalPath (rootNode) {
	// TODO: Similarly this is unused
}

// Hacks for demo purpose, just load hardcoded data for the state changes now because the actually 
// action history recovery code is very buggy.

var gActionTreeWindow = null;

function loginDemo() {

	// start a window for action tree.html and save the reference to the
	// DOM object so we can call functions in it
	gActionTreeWindow = window.open('/actiontree.html','test','width=1440,height=450,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes');

	setTimeout("getActionTreeUI().loadDataAndRender('/data/login.json')",1000);

}

function getActionTreeUI() {
	return gActionTreeWindow;
}

function forceNodeRefreshNextUpdate() {
	getActionTreeUI().gRemoveD3Nodes = true;
}

function zoomIn1Demo() {
	getActionTreeUI().loadDataAndRender('/data/zoomIn1.json');
}

function zoomIn2Demo() {
	getActionTreeUI().loadDataAndRender('/data/zoomIn2.json');
}

function applyCriticalPathDemo() {
	// must refer back to the top window and change something there
}

function changeClientDemo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/changeClient.json');
}

function changeAccountDemo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/changeAccount.json');
}

function zoomIn3Demo() {
	getActionTreeUI().loadDataAndRender('/data/zoomIn3.json');		
}

function zoomIn4Demo() {
	getActionTreeUI().loadDataAndRender('/data/zoomIn4.json');
}

function changeIncome2Demo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/changeIncome2.json');
}

function changeGoal2Demo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/changeGoal2.json');
}

// BONUS - these three actions corresponds to the checkboxes for
// Show Configurations, Show Navigations, Show Data Modifications
// Be sure to always set and unset these three boxes in THIS order
// to make sure that the visualization lines up correctly.
//
// Show Configurations by default is false

function setAutoRedrawDemo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/login.json');
}

function filterOutNavigationsDemo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/filterOutNavigations.json');
}

function submitAnnotationsDemo() {
	forceNodeRefreshNextUpdate();
	getActionTreeUI().loadDataAndRender('/data/submitAnnotations.json');
}	

