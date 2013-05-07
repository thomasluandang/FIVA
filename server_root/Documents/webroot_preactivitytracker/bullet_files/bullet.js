var w = 850,
    h = 21,
    m = [2, 547, 0, 50]; // top right bottom left

var chart = d3.chart.bullet()
    .width(w - m[1] - m[3])
    .height(h - m[0] - m[2]);

function reRender () {
	chart.duration(1000);
	renderCurrentAccount();
	parent.gBulletChartPageCompleted = true;

}

function renderCurrentAccount() {
	readDataAndRender(parent.gAccountData);
}

function readDataAndRender(data) {

  var vis = d3.select("#chart").selectAll("svg")
      .data(data)
    .enter().append("svg:svg")
      .attr("class", "bullet")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
      .call(chart);

  var title = vis.append("svg:g")
      .attr("text-anchor", "end")
      .attr("transform", "translate(-6," + (h - m[0] - m[2] + 8) / 2 + ")");

  title.append("svg:text")
      .attr("class", "title")
      .text(function(d) { return d.year; });

 /* title.append("svg:text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.subtitle; }); */

  window.transition = function() {
    vis.call(chart);
	parent.gBulletChartPageCompleted = true;
  };
}


function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  d.ranges = d.ranges.map(d.randomizer);
  d.markers = d.markers.map(d.randomizer);
  d.measures = d.measures.map(d.randomizer);
  return d;
}

function randomizer(d) {
  var k = d3.max(d.ranges) * .2;
  return function(d) {
    return Math.max(0, d + k * (Math.random() - .5));
  };
}


if (!parent.gBulletChartPageCompleted) {
	reRender();
}
