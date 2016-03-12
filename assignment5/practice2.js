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

    // Loop
    for (var i=0; i<d.length; i++){
        date_object = d[i]["Date"];
        console.log(date_object);
        date_list.push(date_object);
    }

    // console.log(date_list);
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
    var date_array = getDateRange(points);
    // console.log(typeof(date_array[0]));
    // console.log(date_array[0].toDateString());
    var start_date = date_array[0];
    var end_date = date_array.pop()
    var xScale = d3.time.scale().domain([start_date, end_date]).range([MARGINS.left, WIDTH - MARGINS.right]);
    // var yScale = d3.scale.time().domain().range();
    
    // Define axes
    var xAxis = d3.svg.axis()
            .scale(xScale);
            
    var yScale = d3.scale.linear()
    .domain([0, d3.max(points, function(d) { return d.Households; })])
    .range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickPadding(8);
            
    // Append axes        
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
    
     vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);
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