var w = 750,
    h = 500,
    color = d3.scale.negativeZeroPositive,
	gradientAngle = d3.scale.negativeZeroPositiveGradient;

var mode = 0;
    
var treemap = d3.layout.treemap()
    .size([w, h])
    .children(function(d) { 
    		//document.writeln("d.value " + d.value + " - ");
    		return isNaN(d.value) ? d3.entries(d.value) : null; 
     })
    .value(function(d) { return Math.abs(d.value); })
    .sticky(true);
    
var div = d3.select("#chart").append("div")
    .style("position", "relative")
    .style("width", w + "px")
    .style("height", h + "px");

//readDataAndRender(eval(requestHTTP("data/clientlist.json")));

function reRender() {
	readDataAndRender(parent.gTreemapDataPointer);
	parent.gTreemapPageCompleted = true;
}

function readDataAndRender (json) 
	{
		div.data(d3.entries(json)).selectAll("div")
				.data(treemap)
					.enter().append("div")
					.attr("class", "cell")
					.style("background", 
						function(d) { 
							//document.writeln("d.data.key " + d.data.value + " - ");
							return (
										"-moz-linear-gradient(" +
										(!d.children ? gradientAngle(d.data.value) : "-75deg") + 
										", #d6d6d6 0%," +
										(!d.children ? color(d.data.value) : null) +
										" 100%)"
										);
						})
					.call(cell)
					.text(function(d) { return d.children ? null : 
																			(/* d.parent.data.key + ":" + */
																				d.data.key + ":" + Math.abs(d.data.value));  });
}

function zoom(inOut) {
  		if (mode == 1)
  		{
				div.selectAll("div")
						.data(treemap.value(function(d) { 
						// document.writeln("d.value " + d.value + " - "); 
						return Math.abs(d.value); }))
						.transition()
						.duration(1500)
						.call(cell);
				mode = 0;
			} else if (mode == 0) {
				
				div.selectAll("div")
        		.data(treemap.value(function(d) { return 1; }))
        		.transition()
        		.duration(1500)
        		.call(cell);
        mode = 1;
			}

    
}

function cell() {
  this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return d.dx - 1 + "px"; })
      .style("height", function(d) { return d.dy - 1 + "px"; });
}

if (!parent.gTreemapPageCompleted) {
	reRender();
}

