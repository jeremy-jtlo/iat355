var csv_file = "building-permits.csv";

d3.select("body").append("p").text("New paragraph!");

d3.csv(csv_file, function(string) {
    root = string;
    update();
}).get(function(error, year){
    console.log(year);
});

// d3.csv(csv_file).get(function(error, year){console.log(year)});