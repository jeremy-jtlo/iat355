// https://jasonneylon.wordpress.com/2013/09/05/two-sided-horizontal-barchart-using-d3-js/

$( document ).ready(function() {
    console.log( "Practice2.js is ready." );
});

var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };

function getDateRange(d){
    var date_list = []

    // Loop
    for (var i=0; i<d.length; i++){
        date_object = new Date(d[i]["Year"]);
        // console.log(date_object);
        date_list.push(date_object);
    }

    // console.log(date_list);
    return date_list;
}

var date_sort_asc = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
};

function sort_obj_by_date(a,b) { 
    return new Date(a.Date).getTime() - new Date(b.Date).getTime()
}

function fixDataRow(d) {
    d["Year"] = new Date(d["Year"]);
    d["HPI"] = +d["HPI"];
    d["Income"] = +d["Income"];

    return d;
}

function drawPairedBars(svg, points) {

    date_list = getDateRange(points);
    date_list.sort(date_sort_asc);
    // console.log(date_list);

    var labelArea = 160;

    var date_array = getDateRange(points);    
    date_array.sort(date_sort_asc);

    var start_date = date_array[0];
    var end_date = date_array.pop()

    var chart,
        width = 400,
        bar_height = 20,
        height = bar_height * (date_list.length);

    var rightOffset = width + labelArea;

    var chart = d3.select("body")
        .append('svg')
        .attr('class', 'chart')
        .attr('width', labelArea + width + width)
        .attr('height', height);

    var xFrom = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.HPI; })])
        .range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);

    var xTo = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.Income; })])
        .range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);

    var yScale = d3.time.scale().domain([start_date, end_date]).range([MARGINS.left, WIDTH - MARGINS.right]);
    
    // Define axes
    var yScale = d3.svg.axis()
        .scale(yScale);

    var yPosByIndex = function(d, index){ return y(index); } 

    chart.selectAll("rect.left")
        .data(points.HPI)
        .enter().append("rect")
        .attr("x", function(pos) { return width - xFrom(pos); })
        .attr("y", yPosByIndex)
        .attr("class", "left")
        .attr("width", xFrom)
        .attr("height", y.rangeBand()); 

    chart.selectAll("text.date_list")
        .data(date_list)
        .enter().append("text")
        .attr("x", (labelArea / 2) + width)
        .attr("y", function(d){ return y(d) + y.rangeBand()/2; } )
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'date_list')
        .text(String);

    chart.selectAll("rect.right")
        .data(d.Income)
        .enter().append("rect")
        .attr("x", rightOffset)
        .attr("y", yPosByIndex)
        .attr("class", "right")
        .attr("width", xTo)
        .attr("height", y.rangeBand()); 
}


d3.csv("http://www.sfu.ca/~erniet/IAT355/Assignment%206/csv/SurreyHPIIncome.csv")
.row(fixDataRow)
.get(function(error, points){
    if(error){
        console.error("An error happened while opening the file. "+ error);
    }else{
        var svg = d3.select("svg#visualisation ");
        drawPairedBars(svg, points);
        setupFilters(svg, points);
    }
});