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

var chosenXAxis = "Obesity";

function xScale(data, chosenXAxis) {
  // create scales
  var x = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
    d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return x;
}

function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "obesity") {
    label = "Obesity";
  }
  else {
    label = "Income";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
      return (`${d.state}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function renderAxes(newX, xAxis) {
  var bottomAxis = d3.axisBottom(newX);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis)
  return xAxis;
}

function renderCircles(circlesGroup, newX, chosenXAxis, x, y) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newX(d[chosenXAxis]));
  return circlesGroup;
}
function updateStates(data, chartGroup, newX, chosenXAxis, x, y, stateLabels) {
  stateLabels = chartGroup
    .data(data)
    .attr("x", d => x(d[chosenXAxis]));
  return chartGroup;
}


  //     circlesGroup
  //         .on("mouseover", function(data) { toolTip.show(data, this) })
  //         .on("mouseout", function(d, i) { toolTip.hide(d) });
// }


// }

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

  var x = xScale(data, chosenXAxis);
  var bottomAxis = d3.axisBottom(x);
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([height, 0]);
  chartGroup.append("g")
    .call(d3.axisLeft(y));

  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[chosenXAxis]))
    .attr("cy", (d) => y(d.poverty))
    .attr("r", "15")
    .style("fill", "#69b3a2")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var obesityLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obesity");

  var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Income");

  var stateLabels = chartGroup.selectAll("label")
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
          .classed("active", true)

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poverty");


    labelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          chosenXAxis = value;

          x = xScale(data, chosenXAxis);

          xAxis = renderAxes(x, xAxis);

          circlesGroup = renderCircles(circlesGroup, x, chosenXAxis, y, chartGroup);

          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // stateLabels = updateStates(data, stateLabels, chosenXAxis, x, y)

          if (chosenXAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            stateLabels
              .classed("active", true)
              .classed("inactive", false)
          }
          else {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
}).catch(function(error) {
    console.log(error);

});

// console.log(sourceData[0])
