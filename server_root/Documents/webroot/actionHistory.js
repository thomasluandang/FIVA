// IMPORTANT: remember to include the date.js library before using this library
// Include /lib/date.js/date.js from the HTML file that refers to this js file.

// Library for working with the actionHistory file format

// creator function that returns an actionNode json object
function newActionNode(name, user, oldVal, newVal, year, client, account, comment, attachments, isCurrent, isCritical) {
		
		var tempActionNodeJSONString = "{";

		tempActionNodeJSONString += "\"actionName\":\"" + name + "\"" + ",";
		tempActionNodeJSONString += "\"Timestamp\":\"" + getCurrentTimeAsString() + "\"" + ",";
		tempActionNodeJSONString += "\"User\":\"" + user + "\"" + ",";
		tempActionNodeJSONString += "\"OldValue\":\"" + oldVal + "\"" + ",";
		tempActionNodeJSONString += "\"NewValue\":\"" + newVal + "\"" + ",";
		tempActionNodeJSONString += "\"Year\":\"" + year + "\"" + ",";
		tempActionNodeJSONString += "\"Client\":\"" + client + "\"" + ",";
		tempActionNodeJSONString += "\"Account\":\"" + account + "\"" + ",";
		tempActionNodeJSONString += "\"TextComment\":\"" + comment + "\"" + ",";
		tempActionNodeJSONString += "\"Attachments\":\"" + attachments + "\"" + ",";
		tempActionNodeJSONString += "\"CurrentNode\":\"" + isCurrent + "\"" + ",";
		tempActionNodeJSONString += "\"CriticalNode\":\"" + isCritical + "\"" + ",";
		tempActionNodeJSONString += "\"Unsaved\":\"" + 1 + "\"";

		// Comment out because a new node cannot have a children
		//tempActionNodeJSONString += "," + "\"children\":\"\"";

		tempActionNodeJSONString += "}";

		return JSON.parse(tempActionNodeJSONString);

	}

// Unit test for the newActionNode
/* document.writeln(JSON.stringify(newActionNode
		("name", "user", "oldval", "newval", "year", 
			"client", "acct", "cmmt", "attm", 1, 1))); */

// insert newNode into the children array of targetNode, so that newNode
// begins a new branch out of targetNode
function insertActionNode(newNode, targetNode) {
	
	if (targetNode) {
		if (hasChildren(targetNode)) {

			//newWindowPrint(JSON.stringify(targetNode));

			targetNode.children.push(newNode);
			newNode.parent = targetNode;
		} 
		else
		{
			targetNode.children = new Array();
			targetNode.children.push(newNode);
			newNode.parent = targetNode;
			

		}
	}
	else
	{
		window.alert("insertActionNode: targetNode is null");
	}
}

function insertAtCurrentNode(newNode, jsonTree) {
		
		// TODO: prompt here to ask for informations not provided from the program
		// such as comment and attachments

		// In the generalized actiontree library the events have all unstructured text
		// names and params. The enumeration of event types is something that should
		// be done at the application integration level, such as in 
		// actionHistoryFivaIntegration.js
		gCurrentNodeData = null;
		findCurrentNodeRecursive(jsonTree);

		insertActionNode(newNode, gCurrentNodeData); 

		return newNode;
	}

// follow the critical path, find the current node, given the root node of an action tree
function getCurrentActionNode (rootNode) {

}

function getCriticalPathHelperRecursive (rootNode, returnArray) {

	// base case
	if (!isCritical(rootNode)) {
		return;
	} else {
		returnArray.push(rootNode);
	}

	// recursive case
	if (hasChildren(rootNode)) { 
		for (var i=0; i<rootNode.children.length; i++) {
			getCriticalPathHelperRecursive(rootNode.children[i], returnArray);
		}
	}
}

// construct an array that is just the critical path from a source tree
function getCriticalPath (rootNode) {

	if (rootNode) {
		var returnArray = new Array();

		getCriticalPathHelperRecursive(rootNode, returnArray); 

		return returnArray;

	} else {
		window.alert("getCriticalPath: rootNode is null");
	}
}

// find a Node based on its name and its time, starting from a root node
function findActionNode (jsonTree, name, timeStamp) {

}

// TODO: rework this properly.
function findCurrentNode() {
	gCurrentNodeData = null;
	findCurrentNodeRecursive(gActionTreeData);
	return gCurrentNodeData;
}

function findCurrentNodeRecursive(jsonTree) {
		
		if (jsonTree.CurrentNode == 1) {
			//window.alert("right3");
			gCurrentNodeData = jsonTree;
		}

		if (gCurrentNodeData) {
			return gCurrentNodeData;
		}

		// recurse for all children
		if (hasChildren(jsonTree)) {
			for (var i=0; i<jsonTree.children.length; i++) {
					findCurrentNodeRecursive(jsonTree.children[i]);
			}
		}
	}

function findCurrentNodeAndCurrentSelectedNodeRecursive(thisNodeInD3, jsonTree) {

		var thisNodeActionName = thisNodeInD3.select("text.actionNameLabel").text();
		var thisNodeActionTimestamp = thisNodeInD3.select("text.timestampLabel").text();

		var tempNodeActionName = jsonTree.actionName;
		var tempNodeTimestamp = jsonTree.Timestamp;

		// if found BOTH the current node and the node just clicked, return
		if (tempNodeActionName == thisNodeActionName && tempNodeTimestamp == thisNodeActionTimestamp) {
			//window.alert("right1");
			gCurrentlySelectedNodeData = jsonTree;
		}

		if (jsonTree.CurrentNode) {
			//window.alert("right2");
			gCurrentNodeData = jsonTree;
		}

		if (gCurrentNodeData && gCurrentlySelectedNodeData) {
			return;
		}

		// recurse for all children
		if (hasChildren(jsonTree)) {
			for (var i=0; i<jsonTree.children.length; i++) {
					findCurrentNodeAndCurrentSelectedNodeRecursive(
						thisNodeInD3, jsonTree.children[i]);
				}
		}
	}

function maxDepthCountRecursive(jsonTree, tempDepth) {

		var retVal = tempDepth;
		var tempRetVal = retVal;

		if (hasChildren(jsonTree)) {
			for (nodes in jsonTree.children) {
					//document.writeln(jsonTree.children[nodes].actionName + " " + jsonTree.children[nodes].Timestamp + " endNode \n");
					tempRetVal = maxDepthCountRecursive(jsonTree.children[nodes], tempDepth + 1);
					if (retVal < tempRetVal) {
						retVal = tempRetVal;
					}
				}
		}
		
		// document.writeln("returning " + retVal);
		return retVal;
		
	}

// trigger a change of current node but not starting from a user interface selection 
// (aka. a node in the D3 visualization) but from the back end (aka. a node in the data
// structure of the action history library)
function unsetAndSetNewCurrentNode(newCurrentNode) {

		gCurrentNodeData = newCurrentNode;
		gCurrentlySelectedNodeData = newCurrentNode;
		

		var tempCurrentNode = gCurrentNodeData;
		tempCurrentNode.CurrentNode = 0;
		while (tempCurrentNode.parent) {
			tempCurrentNode.CurrentNode = 0;
			tempCurrentNode.CriticalNode = 0;
			tempCurrentNode = tempCurrentNode.parent;
		}

		tempCurrentNode = gCurrentlySelectedNodeData;
		tempCurrentNode.CurrentNode = 1;
		while (tempCurrentNode.parent) {
			tempCurrentNode.CriticalNode = 1;
			tempCurrentNode = tempCurrentNode.parent;
		}
	}

function getCurrentTimeAsString () {
	var today = new Date();
	
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var hh = today.getHours();
	var mins = today.getMinutes();
	var secs = today.getSeconds();

	if(dd<10) {dd='0'+dd;} 
	if(mm<10) {mm='0'+mm;}
	if(hh<10) {hh='0'+hh;}
	if(mins<10) {mins='0'+mins;}
	if(secs<10) {secs='0'+secs;}

	today = mm+'/'+dd+'/'+yyyy+' '+hh+':'+mins+':'+secs;
	// document.write(today);

	return today;
}

function getName(actionNode) {
	return actionNode.actionName;
}

function getTime(actionNode) {
	return actionNode.Timestamp;
}

function getUser(actionNode) {
	return actionNode.User;
}

function getOldVal(actionNode) {
	return actionNode.OldValue;
}

function getNewVal(actionNode) {
	return actionNode.NewValue;
}

function getYear(actionNode) {
	return actionNode.Year;
}

function getClient(actionNode) {
	return actionNode.Client;
}

function getAccount(actionNode) {
	return actionNode.Account;
}

function getComment(actionNode) {
	return actionNode.TextComment;
}

function getAttachments(actionNode) {
	return actionNode.Attachments;
}

function isCurrent(actionNode) {
	return actionNode.CurrentNode;
}

function isCritical(actionNode) {
	return actionNode.CriticalNode;
}

function isUnsaved(actionNode) {
	return actionNode.Unsaved;
}

function hasChildren(actionNode) {
	return (actionNode != null && actionNode.children != null && 
		actionNode.children != "" && 
		actionNode.children != "unused");
}

function getChildrenAsArray(actionNode) {
	return actionNode.children;
}


////// BELOW THIS IS THE BASIC CODE OF THE VISUALIZATION ///////

var widthperlevel = 240;
	var maxLevel;
	var minLevel = 1;

	var width;
	var height;

	var cluster;
	var diagonal;
	var lastdiagonal;
	var diagonal_orig = d3.svg.diagonal()
		.projection(function(d) { return [0,0]; });

	var visSVG; 
	var visLink;
	var visNode;

	var currentLink = 0;
	var currentNode = 0;
	var definedDisplayArea = 0;
	
	var gActionTreeData;
	var gCurrentNodeData;
	var gCurrentlySelectedNodeData;

	function animateRepeatCurrentLink () { 
		var thisLink = d3.select(this);

		if (thisLink.attr("display") != "none") {
			thisLink.style("stroke-width", 24)
			.transition().delay(0).duration(1000)
			.style("stroke-width", 4)
			.each("end", animateRepeatCurrentLink);
		}
	}

	// does this type of looping animation cause stack space to slowly run out because it keep chaining functions
	// forever? I'm not sure.
	function animateRepeatCurrentNode () {
		var thisNode = d3.select(this);

		if (thisNode.attr("display") != "none") {
			thisNode.attr("r", 36)
			.transition().delay(0).duration(1000)
			.attr("r", 12)
			.each("end", animateRepeatCurrentNode);
		}
	}

	function initActionTree(json) {
		// Currently the viewing area is dynamically sized to the max depth of the tree, but
		// in production code this should be limited to 5, and the init should be done at the top
		// of the page for efficiency, make this modification at the end.
		//
		// There should be a checkbox to determine whether to show all the tree or not
		//
		// note: coding the maxdepth find is a good exercise and a nice design touch, but it was
		// not a critical feature. The critical path is not determined on the fly from the current node
		// but set and unset along with the current node, so at any given time, the JSON data will have
		// both the critical path and the current node.

		//document.writeln("maxdepth " + maxDepthCountRecursive(json, 1));
		maxLevel = maxDepthCountRecursive(json, 1);
		width = widthperlevel * maxLevel;
		height = 600;

		cluster = d3.layout.fiva_custom_cluster()
		.size([height, width - 230]);

		diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

		if (!definedDisplayArea) {

			lastdiagonal = diagonal_orig;

			visSVG = d3.select("#chart").append("svg")
				.attr("width", width)
				.attr("height", height);

			visLink = visSVG.append("g")
				.attr("class", "visLink")
				.attr("transform", "translate(120, 0)");

			visNode = visSVG.append("g")
				.attr("class", "visNode")
				.attr("transform", "translate(120, 0)");

			definedDisplayArea = 1;
		}
		else {
			visSVG = d3.select("#chart").select("svg").attr("width", width).attr("height", height);
			visSVG.select("g.visLink").attr("transform", "translate(120,0)");
			visSVG.select("g.visNode").attr("transform", "translate(120,0)");	
		}

	}

	function unsetAndSetNewCurrentD3NodeHelper(thisNodeInD3, jsonTree) {
		
		// get the current node in the JSON data
		// turn off the current flag, go up the parents until the root, turn off the critical flag

		// get the data bounded to this node in d3
		// there may be a straightforward call to do this in d3, like data() or d()?
		// or if not, then have to traverse the JSON file while matching the action name and timestamp
		// when found, set that node to current and go up the parents, set the critical flags
		findCurrentNodeAndCurrentSelectedNodeRecursive(thisNodeInD3, jsonTree);

		var tempCurrentNode = gCurrentNodeData;
		if (!tempCurrentNode) {
			window.alert("wrong1");
		}
		tempCurrentNode.CurrentNode = 0;
		while (tempCurrentNode.parent) {
			tempCurrentNode.CriticalNode = 0;
			tempCurrentNode = tempCurrentNode.parent;
		}

		tempCurrentNode = gCurrentlySelectedNodeData;
		if (!tempCurrentNode) {
			window.alert("wrong2");
		}
		tempCurrentNode.CurrentNode = 1;
		while (tempCurrentNode.parent) {
			tempCurrentNode.CriticalNode = 1;
			tempCurrentNode = tempCurrentNode.parent;
		}
	}

	function unsetAndSetNewCurrentD3Node(thisNodeInD3) {
		gCurrentNodeData = null;
		gCurrentlySelectedNodeData = null;
		unsetAndSetNewCurrentD3NodeHelper(thisNodeInD3, gActionTreeData);
	}

	function indexOf(AnElement, ACollection) {
	  for (var i=0;i<ACollection.length;i++)
	  {
	  	//window.alert(ACollection[i].value);
	  	if (ACollection[i].value == AnElement) return i;
	  }
	  return -1; 
	}

	function nodeMarkerOnActivate(evt) {

		//window.alert("how?");

		// get the current node in the D3 DOM 
		// (actually get the parentNode.parentNode because we need the text element, not the circle)
		var thisNodeInD3 = d3.select(evt.target.parentNode.parentNode);
		// thisNodeInD3.attr("r", 24);

		unsetAndSetNewCurrentD3Node(thisNodeInD3);

		// rebind the data and redraw, this will restablish a new current node and critical path.	
		loadDataAndRenderHelper(gActionTreeData, false);

		// Do a really cool effect where the fields are updated in a sequence!

		// Get critical path
		var critPathArray = getCriticalPath(gActionTreeData);

		var sourceWindow = this.window.opener;
		var tempNode = null;
		for (var i=0; i<critPathArray.length; i++) {
			//window.alert(critPathArray.length);
			tempNode = critPathArray[i];			
			
			if (tempNode.actionName == "changeGoal") {
				var fieldString = "goal%%" + tempNode.Year; 
				jsSleep(1000);
				sourceWindow.getIncomeGoalTableUI().changeTableField(fieldString, tempNode.NewValue);
			}
			else if (tempNode.actionName == "changeIncome") {
				var fieldString = "holdings%%" + tempNode.Year; 
				jsSleep(1000);
				sourceWindow.getIncomeGoalTableUI().changeTableField(fieldString, tempNode.NewValue);
			} else if (tempNode.actionName == "changePrice") {
				var fieldString = "price%%" + tempNode.Year; 
				jsSleep(1000);
				sourceWindow.getPriceTableUI().changeTableField(fieldString, tempNode.NewValue);
			} else if (tempNode.actionName == "changeYield") {
				var fieldString = "yield%%" + tempNode.Year; 
				jsSleep(1000);
				sourceWindow.getPriceTableUI().changeTableField(fieldString, tempNode.NewValue);
			} else if (tempNode.actionName == "zoomIn") {
				// false here means don't add another zoomIn event as you zoomIn
				jsSleep(1000);
				sourceWindow.treemapZoomInOnClick(false);
			} else if (tempNode.actionName == "zoomOut") {
				jsSleep(1000);
				sourceWindow.treemapZoomOutOnClick(false);
			} else if (tempNode.actionName == "changeClient") {
				// must first set the dropdown box to the right value
				jsSleep(1000);
				var ClientSelect = sourceWindow.document.getElementById("ClientSelect");

				var ClientIndex = indexOf(tempNode.NewValue, ClientSelect);

				if (ClientIndex < 0) { window.alert("No element: " + tempNode.NewValue); } 
				//else { window.alert("element found: " + i); }

				ClientSelect.selectedIndex = ClientIndex;

				// window.alert ("here " + isUserInduced);

				// then run ClientSelectOnChange
				sourceWindow.ClientSelectOnChange(false);
			} else if (tempNode.actionName == "changeAccount") {
				jsSleep(1000);
				var AccountSelect = sourceWindow.document.getElementById("AccountSelect");
				var AccountIndex = indexOf(tempNode.NewValue, AccountSelect);

				if (AccountIndex < 0) { window.alert("No element: " + tempNode.NewValue); }
				//else { window.alert("element found: " + i); }

				AccountSelect.selectedIndex = AccountIndex;
				
				sourceWindow.AccountSelectOnChange(false);
			} else if (tempNode.actionName == "search") {
				jsSleep(1000);
				var searchBox = sourceWindow.document.getElementById("SearchBox");
				searchBox.value = tempNode.NewValue;
				// not implemented
				sourceWindow.searchOnClick(false);
			} else if (tempNode.actionName == "setAutoRedraw") {
				jsSleep(1000);
				sourceWindow.document.getElementById("doesAutoUpdate").checked = tempNode.NewValue;
				sourceWindow.doesAutoUpdateOnChange(false);
			} else {
				window.alert("unknown action: " + tempNode.actionName + " " + tempNode.Timestamp);
			}
		
		}

	}

	var gRemoveD3Nodes = false;

	function reRenderActionTree() {
		loadDataAndRenderHelper(gActionTreeData);
	}

	function loadDataAndRenderHelper(json, removeD3Nodes) {

		removeD3Nodes = (typeof removeD3Nodes !== 'undefined' ? removeD3Nodes : false);

		if (gActionTreeData == null) {
			gActionTreeData = json;
		}

		initActionTree(json);

		// Calculate the node and link positions, this is the actual data that will be fed into the visualization
		var nodes = cluster.nodes(json);
		var clusterLinksPositions = cluster.links(nodes);

		// LINK SECTION BEGINS
		visLink.selectAll("path").remove();

		var link = visLink.selectAll("g.path1.link1")
		.data(clusterLinksPositions); // DATA CLAUSE FOR LINKS
		
		var linkEnter = link.enter().append("g")		// ENTER CLAUSE FOR LINKS
		.attr("class", "path1")
		.style("stroke-opacity", 1e-6);

		link.transition().duration(500)
		.style("stroke-opacity", 1);

		// Remove unbinded links
		var linksToRemove = link.exit().remove();

		// Draw new links
		var linksToDraw = linkEnter;

		// Decorative animation for the current link
		var currentLinkAnimation = linksToDraw.append("path")
		.attr("class", "link1")
		.attr("id", "CurrentLink")
		.attr("display", function(d) { return (d.target.CurrentNode) ? "inline" : "none"; })
		.style("stroke-width", 24)
		.style("stroke", "#fBB")
		.attr("d", lastdiagonal);

		currentLinkAnimation.transition().duration(1000).attr("d", diagonal);

		currentLinkAnimation.transition().delay(1000).duration(1000)
		.style("stroke-width", 4).each("end", animateRepeatCurrentLink);

		// drawing the actual paths
		var paths = linksToDraw.append("path")
		.attr("class", "link1")
		.attr("id", function(d) { currentLink++; return "link" + "_" + (currentLink - 1); })
		.style("stroke-width", function (d) { return (d.target.CriticalNode) ? 4 : 2.5; })
		.style("stroke", function (d) { return (d.target.CriticalNode) ? "#f99" : "#999"; })
		.attr("d", lastdiagonal);

		paths.transition().duration(1000)
		.attr("d", diagonal);

		linksToDraw.append("text")
		.attr("fill", "green")
		.attr("font-size", 10)
		.attr("dx", 45 )
		.attr("dy", 8)
		.style("alignment-baseline", "central")
		.append("textPath")
		.attr("xlink:href", function (d) { currentNode++; return "#" + "link" + "_" + (currentNode - 1); })
		.text(function(d) {
			return (d.target.Client != "unused" ? d.target.Client : "") + " " + (d.target.Account != "unused" ? d.target.Account : "") + " " + (d.target.Year != "unused" ? d.target.Year : "") + ((d.target.OldValue != "unused") ?  (" From " + d.target.OldValue) : "") + ((d.target.NewValue != "unused") ? (" To " + d.target.NewValue) : ""); 
		});

		// NODE SECTION BEGINS
		if (removeD3Nodes || gRemoveD3Nodes) {
			visNode.selectAll("g.node").remove();
			gRemoveD3Nodes = false;
		}

		var node = visNode.selectAll("g.node")
		.data(nodes);					// DATA CLAUSE FOR NODES
		
		var nodeEnter = node.enter().append("g")           // ENTER CLAUSE FOR NODES
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + 0 + "," + 600 + ")"; });
		//.append("text").text(function(d) { return "d.y: " + d.y + ", d.x: " + d.x;});

		// Commented out: don't put a transition in the middle of another in progress transition
		// Apparently this doesn't seems to work for certain attr, or perhaps doesn't work when the argument is
		// a functor
		//node.style("opacity", 1e-6).transition().duration(500).style("opacity", 1);

		node.transition().duration(1000)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		// Remove unbinded nodes
		var nodesToRemove = node.exit().remove();

		// Only draw anew nodes that are entering, the rest of the nodes, d3 is supposed to track and redraw
		var nodesToDraw = nodeEnter;

		visNode.selectAll("g.circleAnimationCover").remove();
		visNode.selectAll("g.currentNodeMarkerCircleCover").remove();
		visNode.selectAll("g.nodeMarkerCircleCover").remove();

		// "Magic": a "cover" g element is drawn once on enter to keep the place and to make the animation
		// looks right when the data changes, but the actual circle must be cleared and redrawn 
		// every time, because the data binding for trees in d3 has problems whenever the breadth of the tree
		// changes. The use of a cover also makes sure that the order of drawing is preserved between
		// data update so that the animation looks right and catches events right.
		//
		// this problem still exists in the link sections, where some links don't get deleted properly by d3
		// just not shown, but at least it doesn't add repeating nodes when data changes, just that existing
		// unbinded nodes don't get deleted properly. Leave the link section there for now.
		node.append("g")
		.attr("class", "circleAnimationCover");

		var circleAnimation = visNode.selectAll("g.circleAnimationCover").append("circle")
		.attr("class","circleAnimation")
		.attr("display", function(d) { return (d.CurrentNode) ? "inline" : "none"; })
		.attr("fill-opacity", 1e-6)
		.attr("opacity", 1e-6)
		.transition().delay(1000).duration(0)
		.attr("opacity", 1);
		
		circleAnimation.attr("r", 36)
		.transition().delay(1000).duration(1000)
		.attr("r", 12)
		.each("end", animateRepeatCurrentNode);

		node.append("g")
		.attr("class", "currentNodeMarkerCircleCover");

		visNode.selectAll("g.currentNodeMarkerCircleCover").append("circle")
		.attr("class", "currentNodeMarkerCircle")
		.attr("display", function(d) { 
			return (d.CurrentNode) ? "inline" : "none"; 
		})
		.attr("r", 12);
		
		node.append("g")
		.attr("class", "nodeMarkerCircleCover");

		visNode.selectAll("g.nodeMarkerCircleCover").append("circle")
		.attr("class", "nodeMarkerCircle")
		.style("fill", function(d) { 
			return (d.CurrentNode) ? "#9f9" : "#fff"; 
		})
		.attr("onclick", "nodeMarkerOnActivate(evt)")
		.attr("r", 6);

		nodesToDraw.append("image")
		.attr("width", 29)
		.attr("height", 29)
		.attr("display", function (d) { return (d.TextComment != "unused") ? "inline" : "none";})
		.attr("x", function(d) { return !hasChildren(d) ? -30 : 0; })
		.attr("y", 8)
		.attr("xlink:href", "noteicon.png")
		.append("title")
		.text(function(d) { return d.TextComment;});

		var AttachmentImage = nodesToDraw.append("a")
		.attr("xlink:href", function(d) { return "data/Attachments/" + d.User + "__" + (d.Timestamp.replace(/\//g, "_")).replace(/:/g, "_") + "__" + d.Attachments; });

		AttachmentImage.append("image")
		.attr("width", 29)
		.attr("height", 29)
		.attr("display", function(d) { return (d.Attachments != "unused") ? "inline" : "none";})
		.attr("x", function(d) { return !hasChildren(d) ? -30 : 0; })
		.attr("y", -8 - 29)
		.attr("xlink:href", "attachmenticon.png")
		.append("title")
		.text(function(d) { return d.Attachments;});

		nodesToDraw.append("text")
		.attr("class", "actionNameLabel")
		.attr("x", function(d) { return hasChildren(d) ? -8 : 8; })
		.attr("y", -3)
		.attr("text-anchor", function(d) { return hasChildren(d) ? "end" : "start"; })
		.text(function(d) { return d.actionName; });

		nodesToDraw.append("text")
		.attr("class", "userLabel")
		.attr("x", function(d) { return hasChildren(d) ? -8 : 8; })
		.attr("y", 15)
		.attr("fill", "red")
		.attr("text-anchor", function(d) { return hasChildren(d) ? "end" : "start"; })
		.attr("editable", "true")
		.text(function(d) { return d.User; });

		nodesToDraw.append("text")
		.attr("class", "timestampLabel")
		.attr("x", function(d) { return hasChildren(d) ? -8 : 8; })
		.attr("y", 27)
		.attr("fill", "blue")
		.attr("text-anchor", function(d) { return hasChildren(d) ? "end" : "start"; })
		.text(function(d) { return d.Timestamp; });

		lastdiagonal = diagonal;
		//newWindowPrint(JSON.stringify(gActionTreeData));

	}

	function loadDataAndRender(jsonFile) {
		gActionTreeData = null;
		d3.json(jsonFile, loadDataAndRenderHelper);
	}




/////////////////////// VISUALIZATION CODE /////////////////////

// TODO: Rework this. The better approach should be to use jQuery
// var newObject = jQuery.extend(true, {}, oldObject); // jquery clone
// but for now let's use this firefox specific method to clone a json object
// 
// the reason for doing this in the first place is because for some reasons
// d3 actually mangles your JSON data when you load it into the visualization engine
// so that if you stringify gActionTreeData after cluster.nodes(gActionTreeData) you	
// will get a "cyclic object value" error. That's why if you want to continue editing
// the data, you must clone a separate instance of gActionTreeData from the one taken
// over by d3.
function myClone(jsonObject) {
	return eval(uneval(jsonObject));
}