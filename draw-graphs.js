var csv_file = "http://www.sfu.ca/~jtlo/iat355/data/building-permits.csv";

d3.select("body").append("p").text("New paragraph!");

d3.csv(csv_file, function(string) {
    root = string;
    update();
}).row(function(d){
    console.log(d);
}).get(function(error, data){
    console.log(data);
});

// d3.csv(csv_file).get(function(error, year){console.log(year)});