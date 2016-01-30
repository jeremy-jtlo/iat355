var csv_file = "http://www.sfu.ca/~jtlo/iat355/data/building-permits-trimmed.csv";

d3.select("body").append("p").text("New paragraph!");

d3.csv(csv_file)
.row(function(d){
	var year_marker = 1998;
	for (year_marker; year_marker < 2015; year_marker++){
		var year_string = year_marker.toString();
		d[year_string] = +d[year_string]
	}
    console.log(d);
}).get(function(error, data){
    console.log(data);
});

// d3.csv(csv_file).get(function(error, year){console.log(year)});