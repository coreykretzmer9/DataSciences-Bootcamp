//color references
// colors
// Grey: #F5F5F5
// Dark blue: #12356D
// light blue: #347AB6

// // Test data
// var y = [2, 2, 2]
// var x = htmldata;

//function to build charts
//takes two arguments: data and attribute name
function buildCharts(x, attr) {
  var trace = {
    x: x,
    type: 'histogram',
    showlegend: true,
    name: attr
  };
//layout for chart
  var layout = {
    xaxis: {
      title: "Attribute: " + attr,
    },
    yaxis: {
      title: 'Number of Players per Rating',
    },
    title: attr + " Distribution",
    plot_bgcolor: "#F5F5F5",//plot bgcolor
    paper_bgcolor: "#F5F5F5"//plot frame color
  };
  //data for chart
  var data = [trace];
  Plotly.newPlot('myDiv', data, layout, {displaylogo: false});
}

//function to create the page
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  //clear innerHTML so the list doesn't get duplicated on changes
  document.getElementById("selDataset").innerHTML="";

  // Use the list of attributes to populate the select options
  attrsList.forEach((i) => {
    selector
      .append("option")
      .text(i)
      .property("value", i);
  });
  //get data to pass to function that builds charts
  d3.json("/histograms/" + attrsList[0]).then((sampleNames) => {
    
    //define default sample to populate graph
    var defaultValue= attrsList[0];
    
    //call function to build charts
    buildCharts(sampleNames, defaultValue);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  d3.json("/histograms/" + newSample).then((sampleNames) => {
    buildCharts(sampleNames, newSample);
  });
}
//call initial function
init();
