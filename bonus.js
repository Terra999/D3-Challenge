// This code is incomplete. I was unable to get the y-axis labels to be interactive 
//and I ran out of time. Also, I tried putting the js and css files into separate 
// folders to tidy things up, but when I did that my code wouldn't work. Even after updating the path
// in the html file, so I kept everything at the same level.

// Check that bonus.js loaded
console.log("bonus.js loaded");

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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
      .duration(700)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, ) {
  
    circlesGroup.transition()
      .duration(700)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
  
    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty (%):";
    }
    else if (chosenXAxis === "age") {
      label = "Age (Median)";
    }
    else {
      label = "Household Income (Median)";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${d.label} ${chosenXAxis}`);
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

    // Parse Data/Cast as numbers
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

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demoData, d => d.healthcare)])
      .range([height, 0]);

    // Create initial axis functions
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

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(demoData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.chosenXAxis))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .classed("stateCircle", true);

          // Partly from Andy McRae's code
    var fontSize = 10;
    var abbrGroup = chartGroup.selectAll("null")
        .data(demoData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.chosenXAxis))
        .attr("y", d => yLinearScale(d.healthcare)+fontSize/2)
        .attr("font-size", `${fontSize}px`)
        .classed("stateText", true);
    

    // Create group for 3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Create axes labels
    var povertyGroup = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)");

    var ageGroup = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeGroup = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income (Median)");

      // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "4em")
      .classed("axis-text", true)
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "3em")
      .classed("axis-text", true)
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "2em")
      .classed("axis-text", true)
      .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(demoData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "age") {
            ageGroup
              .classed("active", true)
              .classed("inactive", false);
            povertyGroup
              .classed("active", false)
              .classed("inactive", true);
            incomeGroup
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty")  {
            ageGroup
              .classed("active", false)
              .classed("inactive", true);
            povertyGroup
              .classed("active", true)
              .classed("inactive", false);
            incomeGroup
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            ageGroup
            .classed("active", false)
            .classed("inactive", true);
          povertyGroup
            .classed("active", false)
            .classed("inactive", true);
          incomeGroup
            .classed("active", true)
            .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
  console.log(error);
  });
