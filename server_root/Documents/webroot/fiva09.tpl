<!DOCTYPE HTML>
<html><head>

  
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>FI VA - v0.9.5</title>
	<style type="text/css">
	/* @import url("../style.css?1.10.0");
	@import url("../syntax.css?1.6.0");	*/
	@import url("/fiva09.css");
		
	</style>
	
	<script type="text/javascript">
		var username = "%(user)s";
		// document.writeln("username is (should be anything but blank or \"username\") " + username);
	</script>

	<script type="text/javascript" src="/lib/d3.js"></script>
	<script type="text/javascript" src="/lib/d3.csv.js"></script>
	<script type="text/javascript" src="/lib/d3.csv.extended.js"></script>
	<script type="text/javascript" src="/lib/myOther.js"></script>
	<script type="text/javascript" src="/actionHistory.js"></script>
	<script type="text/javascript" src="/actionHistoryFivaIntegration.js"></script>
	<script type="text/javascript" src="/loadData.js"></script>
</head>

<body style="background-color:#eeeeee;">

<table border="0" cellpadding="0" cellspacing="0" style="width: 5px;">
	<tbody>
		<tr>
			<td>
				<table border="0" cellpadding="0" cellspacing="3" style="width: 184px; height: 26px;">
					<tbody>
						<tr>
							<td>
								<button class="shortbutton" id="Search" onclick="searchOnClick()">Search</button>								
							</td>
							<td>
								<input maxlength="24" id="SearchBox" type="text" value="Client Name" />								
							</td>
							<td>
								<button id="ResetVisualization" onclick="location.reload(true)" class="longbutton">(Re)Load Data</button>
							</td>
							<td>
								<button id="UpdateVisualization" onclick="updateVisualization()" class="longbutton">Update Visualization</button>
							</td>
							<td>
								<button id="SaveDataOnDisk" onclick="saveDataOnDiskOnClick()" class="longbutton">Download Current Data</button>
							</td>
						</tr>
					</tbody>
				</table>
				<table border="0" cellpadding="0" cellspacing="0" style="width: 75px; height: 10px;">
					<tbody>
						<tr>
							<td>
								<table border="0" cellpadding="0" cellspacing="0" style="width: 75px; height: 10px;">
									<tbody>
										<tr>
											<td>
										
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>
								<table border="0" cellpadding="0" cellspacing="0">
									<thead>
										<tr>
											<th scope="col" class="size14head">
												Client</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<select name="Client File" id="ClientSelect" size="4" width="100" onChange="ClientSelectOnChange()"><option selected="selected" value="Uninitialized!">Uninitialized!</option></select>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td>
								<table border="0" cellpadding="0" cellspacing="0">
									<thead>
										<tr>
											<th scope="col" class="size14head">
												Account</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<select name="Account" id="AccountSelect" size="4" width="100" onChange="accountSelectOnChange()"><option selected="selected" value="Uninitialized!">Uninitialized!</option></select>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td>
								<td>&nbsp;&nbsp;&nbsp;</td>
								<td>
									<input alt="" src="/ZoomInButton.png" onclick="treemapZoomInOnClick()"  type="image" id="ZoomInButton" /></td>
								<td>&nbsp;</td>
								<td>
									<input alt="" src="/ZoomOutButton.png" onclick="treemapZoomOutOnClick()" type="image" id="ZoomOutButton" /></td>
								<td>&nbsp;&nbsp;</td>
								<td>
									<table border="0" cellpadding="0" cellspacing="0" style="width: 450px; height: 100px;">
										<tbody>
											<tr>
												<td>
													<!-- don't use the checked property, that is unreliable, just set in gInit -->
													<input type="checkbox" name="doesAutoUpdate" id="doesAutoUpdate" onChange="doesAutoUpdateOnChange()"><span class="size14text">Update Visualizations Automatically?</span></input>
												</td>
											</tr>
											<tr>
												<td>
													<span class="size14text" id="CurrentClientLabel"><strong>Current Client: Uninitialized!</strong></span>
												</td>
											</tr>
											<tr>
												<td>
													<span class="size14text" id="CurrentAccountLabel"><strong>Current Account: Uninitialized!</strong></span>
												</td>
											</tr>
											<tr>
												<td>
													<span class="size14text" id="TreeMapLabel"><strong>Surplus / Deficit Treemap: Zoom Level Uninitialized!</strong></span>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
			<td>
				<table style="width: 80px;">
				</table>
			</td>
			<td>
				<table>
					<tbody>
						<tr>
							<td>
								<!-- IMPORTANT LAYOUT TIP: if you make a table, then the size of the elements in the rows
									have to match up. If the upper and lower rows are different, it gives really strange
									rendering results in browsers that will be misleading, so use style="width: 770px" to
									pad the shorter rows. Put a new table into each cell whenever the cell is complex also
									mitigates other problems -->
								<table style="width: 770px;">
														<tbody>
															<tr>
																<td>

																	<td>
																		<span class="size12text" id="CurrentUsernameLabel">Current User: Uninitialized!</span>
																	</td>
																	<td>
																		<button id="Logout" onclick="logout()" class="shortbutton">Log Out</button>	
																	</td>
																	<!-- <td style="width: 65px;">

																	</td> -->
																	<!-- <td>
																		<button id="Undo" onclick="undo()" class="shortbutton">Undo &lt;&lt;</button>		
																	</td>
																	<td>
																		<button id="Redo" onclick="redo()" class="shortbutton">&gt;&gt; Redo</button>		
																	</td> -->
																	<td>
																		<input type="checkbox" name="showConfigurationActions" id="showConfigurationActions" onChange="showConfigurationActionsOnChange()"><span class="size12text">show configuration actions?</span></input>
																	</td>
																	<td>
																		<!-- don't use the checked property, that is unreliable, just set in gInit -->
																		<input type="checkbox" name="showNavigationalActions" id="showNavigationalActions" onChange="showNavigationalActionsOnChange()"><span class="size12text">show navigational actions?</span></input>
																	</td>
																	<td>
																		<!-- don't use the checked property, that is unreliable, just set in gInit -->
																		<input type="checkbox" name="showDataModifications" id="showDataModifications"><span class="size12text">show data modifications?</span></input>
																	</td>
																	<td style="width: 100px;">

																	</td>
																</td>
															</tr>
														</tbody>
													</table>
							</td>
						</tr>
						<tr>
							<td>
											<iframe frameborder="0" width="770" height="125" id="actionribbonframe" scrolling="no" src="/annotationInput.html"></iframe>
							</td>
						</tr>
					</tbody>
				</table>

			</td>
		</tr>
	</tbody>
</table>
<table>
	<tbody>
		<tr>
			<td>
				<table border="0" cellpadding="0" cellspacing="0" style="width: 60px;">
					<tbody>
						<tr>
							<!-- currently empty row between the listbox and ribbon area and the visualization area -->
							
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<tr>
			<td>
			
					<iframe frameborder="0" width="770" height="1800" longdesc="/treemap.html" id="Cifer" scrolling="no" src="/treemap.html"></iframe>
			
			</td>
			<td>
				<table border="0" cellpadding="0" cellspacing="0" style="width: 280px; height: 1800px;">
														<tbody>
															<tr>
																<td>
																	<iframe frameborder="0" width="280" height="1800" longdesc="/incomegoaltable.html" id="Cifer2" scrolling="no" src="/incomegoaltable.html"></iframe>
																</td>
															</tr>
														</tbody>
													</table>
			</td>
			<td>
				
																	<iframe frameborder="0" width="310" height="1800" longdesc="/bulletchart.html" id="Cifer3" scrolling="no" src="/bulletchart.html"></iframe>
				
			</td>
			<td>
				<table border="0" cellpadding="0" cellspacing="0" style="width: 150px; height: 600px;">
													<tbody>
														<tr>
															<td>
																<iframe frameborder="0" width="150" height="1800" longdesc="/pricetable.html" id="Cifer4" scrolling="no" src="/pricetable.html"></iframe>
															</td>
														</tr>
													</tbody>
												</table>		
			</td>
			<td>
				<table border="0" cellpadding="0" cellspacing="0" style="width: 150px; height: 600px;">
													<tbody>
														<tr>
															<td>
																<!-- <iframe frameborder="0" width="1025" height="550" longdesc="/actiontree.html" id="actiontreeframe" scrolling="auto" src="/actiontree.html"></iframe> -->
																<!-- use this for the action tree -->
															</td>
														</tr>
														<tr>
															<td>
																<!-- this blank cell will expand to offset the height differences of the different visualizations-->
																<iframe frameborder="0" width="0" height="1250"></iframe>
															</td>
														</tr>
													</tbody>
												</table>
			</td>
		</tr>
		<tr>
			<!-- currently empty row -->
		</tr>
	</tbody>
</table>
<script type="text/javascript">



// Init, this is the entry point of the app
gInit();


</script>

</body>
</html>