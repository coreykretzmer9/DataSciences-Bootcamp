// create variable for where table will be entered in
var tbody = d3.select("tbody")



// for each sighting in data, append that value to a new row within tbody table
data.forEach(function(sightings) {
    
    var row = tbody.append("tr");
    
    Object.entries(sightings).forEach(function([key, value]) {
        // append a cell to the row for each value in data(sighting)
        var cell = tbody.append("td");
        cell.text(value);
    });
});

// Use d3 to call in the filter button id=filter-btn
var filter= d3.select("#filter-btn");

filter.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property from input element
  var inputValue = inputElement.property("value");

  // console.log(inputValue);
  
  // create a filter where you search to make sure user-input matches up with filter date.
  var filteredData = data.filter(sighting => sighting.datetime === inputValue);

  filteredData.forEach(function(newSightings) {
    
    var row = tbody.append("tr");
    
    Object.entries(newSightings).forEach(function([key, value]) {
        // append a cell to the row for each value in data(sighting)
        var cell = tbody.append("td");
        cell.text(value);
    });
});

// Just to show it works in some capacity...
console.table(filteredData);



  

});