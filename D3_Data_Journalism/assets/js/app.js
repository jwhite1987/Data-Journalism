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
    d.state == d.state;
    d.abbr == d.abbr;
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
    .domain([20, d3.max(data, d => d.obesity)])
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([height, 0]);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
  chartGroup.append("g")
    .call(d3.axisLeft(y));

  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.obesity))
    .attr("cy", (d) => y(d.poverty))
    .attr("r", "15")
    .style("fill", "#69b3a2")
    .attr("opacity", ".5");

  chartGroup.selectAll("label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(d => {
        return (d.abbr) })
      .attr("x", d => x(d.obesity) - 8 )
      .attr("y", d => y(d.poverty) + 4 )
      .attr("font_family", "sans-serif")  // Font type
      .attr("font-size", "11px")  // Font size
      .attr("fill", "black")  // Font color }

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poverty");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      // d3.select(this)
      .html(function(d) { return d.state });



    circlesGroup
    .on("mouseover", function(data) { toolTip.show(data, this) })
    .on("mouseout", (d, i) => { toolTip.hide(d)});

    chartGroup.call(toolTip);

}).catch(function(error) {
    console.log(error);

});

// console.log(sourceData[0])
