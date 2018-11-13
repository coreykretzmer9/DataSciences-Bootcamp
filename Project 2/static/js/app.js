function buildMetadata(sample){
d3.json(`/metadata/${sample}`).then(function(sample) {
    console.log(`Data returned: ${sample}`)

    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");

    Object.entries(sample).map(function ([key, value]) {
        console.log(`Key: ${key} and Value ${value}`);
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
       });
    }
)};

function buildCharts(sample){
  d3.json(`/metadata/${sample}`).then(function(data){

  var data = [{
    type: 'scatterpolar',
    r: [data.stamina, data.agility, data.acceleration, data.finishing, data.crossing, data.ball_control, data.stamina],
    theta: ['Stamina','Agility','Acceleration', 'Finishing', 'Crossing','Ball_Control', 'Stamina'],
    name: sample,
    fill: 'toself'
  }];
  
var layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100]
      }
    },
    showlegend: true
  };
  
  Plotly.plot("myDiv", data, layout);
  });
};



function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    var firstName = nameList[0]
    // Use the list of sample names to populate the select options
    
      nameList.forEach((name) => {
        selector
          .append("option")
          .text(name)
          .property("value", name);
      });
      // console.log(nameList)
      // Use the first sample from the list to build the initial plots
      const firstSample = firstName;

      console.log(firstSample)
      buildCharts(firstSample);
      buildMetadata(firstSample);
    }
  


function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

init();


