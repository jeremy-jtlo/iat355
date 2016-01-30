// var dataset = []
// d3.csv("http://www.sfu.ca/~jtlo/iat355/data/hpi-burnaby-north.csv", function(data) {
//    dataset = data.map(function(d) { return [ +d["Year"], d["Month"], +d["HPI"] ]; });
//    console.log(dataset)
// });

d3.csv("http://www.sfu.ca/~erniet/IAT355/hpi.csv")
   .row(function(d) 
   { 
	   	d["Year"] = +d["Year"];
	   	d["HPI"] = +d["HPI"];
	   	// return [ +d["Year"], d["Month"], +d['HPI'] ]; 
	   	return d;
	   	console.log(d);
   })
   .get(function(error, data){
	console.log(data);

	processData(data);
})

function processData(data){
  
  //calculating the minimum sepal length
  var minHPI = d3.min(data, function(d){
    return d["HPI"];
  });
  showOutput("Minimum home price index", minHPI);
  
  //calculating the max sepal length
  var maxHPI = d3.max(data, function(d){
     return d["HPI"];
  });
  showOutput("Maximum home price index", maxHPI);
  
  //calculating the mean sepal length
  var meanHPI = d3.mean(data, function(d){
    return d["HPI"];
  });
  showOutput("Average home price index", meanHPI);
  
  //filter sepal length greater than 5 and less than 6
  var filteredData = data.filter(function(d){
     return d["HPI"] > 450000 && d["HPI"] < 475000;
  });
  showOutput("Total number of homes", data.length);
  showOutput("Number of homes with HPI between 450000 and 475000", filteredData.length);
  
}

function showOutput(label, value){
  
  var out = d3.select("#output-area")
  .append("div");
  
  out.append("span")
  .text(label + " : ");
  
  out.append("span")
  .text(value);
  
}


// var csv_file = "http://www.sfu.ca/~jtlo/iat355/data/hpi-burnaby-north.csv";

// d3.csv(csv_file)
// .row(function(d){
// 	var year_marker = 2006;
// 	for (year_marker; year_marker < 2015; year_marker++){
// 		var year_string = year_marker.toString();
// 		d[year_string] = +d[year_string]
// 	}
//     console.log(d);
// }).get(function(error, data){
//     console.log(data);
// });