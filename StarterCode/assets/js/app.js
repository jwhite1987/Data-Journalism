// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  left: 60,
  bottom: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(data => {
  data.forEach(d => {
    d.id = +d.id;
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe;
    d.age = +d.age;
    d.ageMoe = +d.ageMoe;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe;
    d.healthcare = +d.healthcare;
    d.healthcareLow = +d.healthcareLow;
    d.healthcareHigh = +d.healthcareHigh;
    d.obesity = +d.obesity;
    d.obesityLow = +d.obesityLow;
    d.obesityHigh = +d.obesityHigh;
    d.smokes = +d.smokes;
    d.smokesHigh = +d.smokesHigh;
    d.smokesLow = +d.smokesLow;
  });

  var x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);
  chartGroup.append("g")
    .call(d3.axisLeft(y));

  var circleGroup = chartGroup
    .selectAll("circle")
    // .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.poverty); } )
      .attr("cy", function (d) { return y(d.healthcare); } )
      .attr("r", 8)
      .style("fill", "#69b3a2")

      x.domain([1000, 0])
    svg.select(".myXaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));

    svg.selectAll("circle")
      .transition()
      .delay(function(d,i){return(i*3)})
      .duration(2000)
      .attr("cx", function (d) { return x(d.poverty); } )
      .attr("cy", function (d) { return y(d.healthcare); } )
})


// console.log(sourceData[0])
