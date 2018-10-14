var svgWidth = 960;
var svgHeight = 550;

var margin = {
  top: 60,
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

// Import Data
d3.csv(".\\assets\\data\\data.csv").then(function(dataset) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    dataset.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
      .domain([8, d3.max(dataset, data => data.poverty) + 1])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([19, d3.max(dataset, data => data.obesity) + 1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    chartGroup.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", data => xScale(data.poverty))
      .attr("cy", data => yScale(data.obesity))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".25");


      // Labeling each circle
    chartGroup.append("text")
      .style("font-size", "9px")
      .selectAll("tspan")
      .data(dataset)
      .enter()
      .append("tspan")
          .attr("x", function(data) {
              return xScale(data.poverty - 0.2);
          })
          .attr("y", function(data) {
              return yScale(data.obesity - 0.1);
          })
          .text(function(data) {
              return data.abbr
            });  

  
    // Creating axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("class", "axisText")
      .classed("active", true)
      .text("Obesity Percentage");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
      .attr("class", "axisText")
      .classed("active", true)
      .text("Poverty Percentage");
  });