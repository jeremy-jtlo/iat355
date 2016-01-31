//finds the csv file
d3.csv("http://www.sfu.ca/~jtlo/iat355/data/hpi.csv")
   .row(function(d) 
   { 

      //converts to integer
	   	d["Year"] = +d["Year"];
	   	d["HPI"] = +d["HPI"];
	   	return d;
	   	console.log(d);
   })
   .get(function(error, data){
	console.log(data);

	processData(data); //executes processData function
})

function processData(data){
  
  //calculating the minimum HPI value
  var minHPI = d3.min(data, function(d){
    return d["HPI"];
  });
  showOutput("Minimum home price index", minHPI);
  
  //calculating the maximum HPI value
  var maxHPI = d3.max(data, function(d){
     return d["HPI"];
  });
  showOutput("Maximum home price index", maxHPI);
  
  //calculating the average HPI value
  var meanHPI = d3.mean(data, function(d){
    return d["HPI"];
  });
  showOutput("Average home price index", meanHPI);
  
  //filter HPI values between 450000 and 475000
  var filteredData = data.filter(function(d){
     return d["HPI"] > 450000 && d["HPI"] < 475000;
  });

  //shows the output for total both filtered and non-filtered data
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
