var tableData = data;

var tbody = d3.select("tbody");

function buildData(data) {
  var fData = tableData;
  tbody.html("");
    data.map((player) => {
        var row = tbody.append("tr");
        Object.entries(player).map(([key,value]) => {
            var cell = tbody.append("td");
            cell.text(value);
        });
    });    
};

function filterData(inputData) {
    d3.event.preventDefault();
    tbody.html("");
    var inputElement = d3.select("#playerid");
    var inputValue = inputElement.property("value");
    if (inputValue != ""){
      console.log(`Filter Player: ${inputValue}`);
      var filteredData = tableData.filter(data => data.player_fifa_api_id.toString() === inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#playername");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Player: ${inputValue}`);
      var filteredData = tableData.filter(data => data.player_name === inputValue); 
      console.log(filteredData);
    }


    var inputElement = d3.select("#stamina");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Stamina: ${inputValue}`);
      var filteredData = tableData.filter(data => data.stamina.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#agility");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Agility: ${inputValue}`);
      var filteredData = tableData.filter(data => data.agility.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#acceleration");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Acceleration: ${inputValue}`);
      var filteredData = tableData.filter(data => data.acceleration.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#finishing");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Finishing: ${inputValue}`);
      var filteredData = tableData.filter(data => data.finishing.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#crossing");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Crossing: ${inputValue}`);
      var filteredData = tableData.filter(data => data.crossing.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#overall_rating");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter Overall_Rating: ${inputValue}`);
      var filteredData = tableData.filter(data => data.overall_rating.toString() >= inputValue); 
      console.log(filteredData);
    }

    var inputElement = d3.select("#preferred_foot");
    var inputValue = inputElement.property("value").trim();
    if (inputValue != ""){
      console.log(`Filter preferred_foot: ${inputValue}`);
      var filteredData = tableData.filter(data => data.preferred_foot === inputValue); 
      console.log(filteredData);
    }

    filteredData.map((player) => {
        var row = tbody.append("tr");
        Object.entries(player).map(([key,value]) => {
            var cell = tbody.append("td");
            cell.text(value);
        });
        
     return filteredData;
});
};

d3.select("#filter-btn").on("click", filterData);
buildData(data);