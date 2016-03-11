// d3.scale.domain([dates]) takes an array of date objects

var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };

// Returns a list of date objects from input data
function getDateRange(d){
    var date_list = []
    date_list.push(d["Date"]);

    // Loop

    console.log(date_list);
    return date_list;
}

// Cleaning csv file
function fixDataRow(d) {
    var format = d3.time.format("%Y-%m-%d");
    d["Date"] = format.parse(d["Date"]);
    d["Households"] = +d["Households"];

    return d;
}

// Drawing the graph
function drawBarGraph(svg, points) {
    // console.log(points)
    getDateRange(points[0]);
    // var xScale = d3.scale.time().domain().range();
    // var yScale = d3.scale.time().domain().range();

}

d3.csv("http://www.sfu.ca/~erniet/IAT355/ernie-tsang_jeremy-lo_A4/csv/Active_Listings_D3.csv")
.row(fixDataRow)
.get(function(error, points){
    if(error){
        console.error("An error happened while opening the file. "+ error);
    }else{
        var svg = d3.select("svg");
        drawBarGraph(svg, points);
    }
});