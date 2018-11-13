// Create Canvas
var svgWidth = 960;
var svgHeight = 500;

var margin ={
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "finishing";
var chosenYAxis = "crossing";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis){
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis])*1.02
    ])
    .range([0,width]);

    return xLinearScale;
}

function yScale(data, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chosenYAxis])* 1.2])
    .range([height, 0]);
    
    return yLinearScale;
}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function renderCirclesText(circlesGroupText, newXScale, chosenXAxis) {

//   circlesGroupText.transition()
//     .duration(1000)
//     .attr("dx", d => newXScale(d[chosenXAxis]));

//   return circlesGroupText;
// }

// function renderYCirclesText(circlesGroupText, newYScale, chosenYAxis) {

//   circlesGroupText.transition()
//     .duration(1000)
//     .attr("dy", d => newYScale(d[chosenYAxis]))

//   return circlesGroupText;

// }


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "finishing")
    xlabel = "Finishing";
  else if (chosenXAxis === "stamina")
    xlabel = "Stamina";
  else
    xlabel = "Ball_Control";
  
  if (chosenYAxis === "crossing")
    ylabel = "Crossing";
  else if (chosenYAxis === "acceleration")
    ylabel = "Acceleration";
  else
    ylabel = "Agility";


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .style("left", 1300 + "px")
        .style("top", 400 + "px")
        .html(function(d){
            return (`<strong>Player:${d.player_fifa_api_id}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}</strong>`);
        });
      
        

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });

    return circlesGroup;
}
// Retrieve data from the CSV file and execute everything below
d3.csv("../static/data/soccerdatabase.csv").then(function(data) {
    // parse data
  data.forEach(function(data){
    data.crossing = +data.crossing;
    data.finishing = +data.finishing;
    data.acceleration = +data.acceleration;
    data.agility = +data.agility;
    data.stamina = +data.stamina;
    data.ball_control = +data.ball_control;
    console.log(data);  
  });     
  


  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);    

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
  //append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);  


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 4)
    .attr("fill", "skyblue")
    .attr("opacity", ".5")
    .attr("class","stateText");

  // var circlesGroupText = chartGroup.selectAll("stateText")
  //   .data(data)
  //   .enter()
  //   .append("text")
  //   .text(d => d.preferred_foot)
  //   .attr("dx", d => xLinearScale(d[chosenXAxis]))
  //   .attr("dy", d => yLinearScale(d[chosenYAxis]))
  //   .attr("font-size", "6px")
  //   .attr("text-anchor", "middle")
  //   .attr("fill", "white");


  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 10})`);

  var finishingLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "finishing") // value to grab for event listener
    .classed("active", true)
    .text("Finishing");

  var staminaLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "stamina") // value to grab for event listener
    .classed("inactive", true)
    .text("Stamina");   

  var ball_controlLable = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "ball_control") // value to grab for event listener
    .classed("inactive", true)
    .text("Ball_Control");
     

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);    

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // circlesGroupText = renderCirclesText(circlesGroupText, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "finishing") {
          finishingLabel
            .classed("active", true)
            .classed("inactive", false);
          staminaLabel
            .classed("active", false)
            .classed("inactive", true);
          ball_controlLable
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "stamina") {
          finishingLabel
            .classed("active", false)
            .classed("inactive", true);
            staminaLabel
            .classed("active", true)
            .classed("inactive", false);
            ball_controlLable
            .classed("active", false)
            .classed("inactive", true);
           }
        else {
          finishingLabel
            .classed("active", false)
            .classed("inactive", true);
          staminaLabel
            .classed("active", false)
            .classed("inactive", true);
          ball_controlLable
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  var ylabelsGroup = chartGroup.append("g")
    .attr("class","Text")
    .attr("transform", `translate(0, ${height}-1)`);

  var crossingLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", -200)
    .attr("value", "crossing") // value to grab for event listener
    .classed("active", true)
    .text("Crossing");

  var accelerationLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x",-200)
    .attr("value", "acceleration") // value to grab for event listener
    .classed("inactive", true)
    .text("Acceleration");

  var agilityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+60)
    .attr("x", -200)
    .attr("value", "agility") // value to grab for event listener
    .classed("inactive", true)
    .text("Agility");

// x axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // updates x scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      // circlesGroupText = renderYCirclesText(circlesGroupText, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "crossing") {
        crossingLabel
          .classed("active", true)
          .classed("inactive", false);
        accelerationLabel
          .classed("active", false)
          .classed("inactive", true);
        agilityLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "acceleration") {
        crossingLabel
          .classed("active", false)
          .classed("inactive", true);
        accelerationLabel
          .classed("active", true)
          .classed("inactive", false);
        agilityLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        crossingLabel
          .classed("active", false)
          .classed("inactive", true);
        accelerationLabel
          .classed("active", false)
          .classed("inactive", true);
        agilityLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

});