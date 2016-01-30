// Variable Declarations!

var csv_file = "http://www.sfu.ca/~jtlo/iat355/data/building-permits-trimmed.csv";

var start_year = 1998;
var end_year = 2015;

// Filter criteria
var filter_min = 100;
var filter_max = 50000;

var filter_year = "2001";

var greeting_string = "Population data for BC " + start_year + " to " + (end_year-1);
var exit_string = "The numbers were provided by BC Stats: http://www.bcstats.gov.bc.ca/StatisticsBySubject/Demography/PopulationEstimates.aspx";

var max_array = [];
var min_array = [];

var city_of_interest = "Port Coquitlam";
var population_sum = 0;

// Greting String
d3.select("body").append("p").text(greeting_string);

d3.csv(csv_file)
.row(function(d){
	// Convert columns to int
	var year_marker = start_year;
	for (year_marker; year_marker < end_year; year_marker++){
		var year_string = year_marker.toString();
		d[year_string] = +d[year_string];
	}
    // console.log(d);
    return d;
})
.get(function(error, data){
    // console.log(data);
    processData(data);

	// Exit String
	d3.select("body").append("p").text(exit_string);
});

function processData(data){

	// Iterate over each year
	var year_marker = start_year;
	var ending_year = end_year;

	var iterator = 0;

	for (year_marker; year_marker < ending_year; year_marker++){
		var year_string = year_marker.toString();

		// Filling the min array
		var minPop = d3.min(data, function(d){
			return d[year_string];
		});
		min_array.push(minPop);

		// Filling the max array
		var maxPop = d3.max(data, function(d){
			return d[year_string];
		});
		max_array.push(maxPop);

		// Summing population
		if (data[iterator]["City"] == city_of_interest){
			for (var population in data[iterator]){
				// Only grab population numbers
				if (Number(population) === parseInt(population, 10)){
					population_sum += +data[iterator][population];
				}
			}
		}

		iterator += 1;
	}

	var population_avg = population_sum / (iterator+1);

	var filteredData = data.filter(function(d){
		return d[filter_year] > filter_min && d[filter_year] < filter_max;
	});

	// From the local min/max, find the absolute min/max
	var final_min = Math.min.apply(Math, min_array);
	var final_max = Math.max.apply(Math, max_array);

	// Print results
	printOutput("Minimum Population", final_min);
	printOutput("Maximum Population", final_max);

	var sum_string = "Sum of population for " + city_of_interest;
	var avg_string = "Average population for " + city_of_interest;

	printOutput(sum_string, population_sum);
	printOutput(avg_string, population_avg);

	printOutput("Original Length of records from " + filter_year, data.length);
	printOutput("Filtered Length of records from " + filter_year, filteredData.length);

}

// d3.csv(csv_file).get(function(error, year){console.log(year)});

// From the tutorial. Appends to page.
function printOutput(label, value){
  
  var out = d3.select("body")
  .append("div");
  
  out.append("span")
  .text(label + " : ");
  
  out.append("span")
  .text(value);
  
}