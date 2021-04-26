console.log("data loaded");

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial parameters
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(demoData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.8,
        d3.max(demoData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
  
    var label;
  
    if (chosenXAxis === "poverty") {
      label = "abbr:";
    }
    else {
      label = "abbr:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      .html(function(d) {
        return (`${d.abbr}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
 }
// Import Data
d3.csv("data.csv").then(function(demoData, err) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    demoData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.income = +data.income;
      data.obesity = +data.obesity;
    });
    console.log(demoData);

    // xLinearScale function above csv import
    var xLinearScale = xScale(demoData, chosenXAxis);

    // Step 2: Create scale functions
    // ==============================

    // var xLinearScale = d3.scaleLinear()
    //   .domain([8, d3.max(demoData, d => d.poverty)])
    //   .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demoData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("null")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.chosenXAxis))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

    // Create group for 3 x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Create axes labels
    var povertyGroup = labelsGroup.append("text")
      .attr("y", 20)
      .attr("x", 0)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)")


    var ageGroup = labelsGroup.append("text")
    .attr("y", 20)
    .attr("x", 0)
    .attr("value", "age")
    .classed("active", true)
    .text("Age (Median)")

    var incomeGroup = labelsGroup.append("text")
    .attr("y", 20)
    .attr("x", 0)
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)")


       // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      .html(function(d) {
        return (`${d.abbr}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  });
// }).catch(function(error) {
//     console.log(error);
// });