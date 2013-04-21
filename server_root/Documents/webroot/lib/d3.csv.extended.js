function csv2json(csvString) {
	var jsonArray = d3.csv.parse(csvString);
	var jsonString = "[ ";
	if (jsonArray.length > 1)
	{
		var bodyLength = jsonArray.length;
		for (i=0;i<bodyLength;i++) {
			jsonString = jsonString + "{ ";
			var j = 0;
			for (json in jsonArray[i]) {
				jsonString = jsonString + ((j > 0) ? ", " : "");
				jsonString = jsonString + "\'" + json + "\'";
				jsonString = jsonString + " : \'" + jsonArray[i][json] + "\'";
				j++; 
			}
			jsonString = jsonString + (i < (bodyLength - 1) ? " }, " : " } ");
		}
	}
	else {
		// nothing to parse, either blank or just the header
	}
	jsonString = jsonString + " ]";
	return jsonString;
}