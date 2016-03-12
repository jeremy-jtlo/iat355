// d3.scale.domain([dates]) takes an array of date objects
/*
RESOURCES

Sorting date objects:
https://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109

Sorting objects by date key:
http://stackoverflow.com/questions/19430561/how-to-sort-a-javascript-array-of-objects-by-date

*/

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
        // console.log(date_object);
        date_list.push(date_object);
    }

    // console.log(date_list);
    return date_list;
}

// Returns a list of entries matching a REGION and LISTING TYPE
function returnDataSet(d, desired_region, desired_type){
    var listing_list = []
    
    // Loop
    for (var i=0; i<d.length; i++){
        var current_listing = d[i];
        if ((current_listing["Region"] == desired_region) && (current_listing["Type"] == desired_type)) {
            listing_list.push(current_listing);
        }
    }
    
    return listing_list;
}

// Sort dates in ascending order when called from sort()
var date_sort_asc = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
};

// Sort objects by 'Date' key
function sort_obj_by_date(a,b) { 
    return new Date(a.Date).getTime() - new Date(b.Date).getTime()
}

// Cleaning csv file
function fixDataRow(d) {
    var format = d3.time.format("%Y-%m-%d");
    d["Date"] = format.parse(d["Date"]);
    d["Households"] = +d["Households"];

    return d;
}

function setupFilters(svg, points){
  d3.selectAll("input[name='region_check']").on("click", function(){
    drawBarGraph(svg, points);
  });
}

// Drawing the graph
function drawBarGraph(svg, points) {
  
    var date_array = getDateRange(points);
    
    date_array.sort(date_sort_asc);
    // console.log(date_array)
    
    var start_date = date_array[0];
    var end_date = date_array.pop()
    
    var north_apts = returnDataSet(points, "North", "Apartment");
    north_apts.sort(sort_obj_by_date);

    var central_apts = returnDataSet(points, "Central", "Apartment");
    central_apts.sort(sort_obj_by_date);

    var south_apts = returnDataSet(points, "South", "Apartment");
    south_apts.sort(sort_obj_by_date);

    var north_townh = returnDataSet(points, "North", "Townhouse");
    north_townh.sort(sort_obj_by_date);
    
     var central_townh = returnDataSet(points, "Central", "Townhouse");
    central_townh.sort(sort_obj_by_date);

    var south_townh = returnDataSet(points, "South", "Townhouse");
    south_townh.sort(sort_obj_by_date);

     var north_det = returnDataSet(points, "North", "Detached");
    north_det.sort(sort_obj_by_date);
    
     var central_det = returnDataSet(points, "Central", "Detached");
    central_det.sort(sort_obj_by_date);

    var south_det = returnDataSet(points, "South", "Detached");
    south_det.sort(sort_obj_by_date);
    
    var xScale = d3.time.scale().domain([start_date, end_date]).range([MARGINS.left, WIDTH - MARGINS.right]);
    
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

    // Filtering
    var selectedRegionSelection = d3.selectAll("input[name='region_check']:checked");
    var checked_boxes = selectedRegionSelection[0];
    console.log(checked_boxes);

    // Append axes        
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
    
     vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);
    
    var lineGen = d3.svg.line()
    .x(function(d) {
        return xScale(d.Date);
    })
    .y(function(d) {
        return yScale(d.Households);
    })
    .interpolate("monotone"); // Interpolate gives us curves
    
    // Append line to visualization
    function visAppend(region, data_set, colour, width) {
        vis.append('svg:path')
            .attr('class', region+' data-line '+colour)
            .attr('d', lineGen(data_set))
            .attr('stroke-width', width)
            .attr('fill', 'none');
    }

    // Add all lines to our svg
    visAppend('North', north_apts, 'blue', 2);
    visAppend('Central', central_apts, 'blue', 2);
    visAppend('South', south_apts, 'blue', 2);

    visAppend('North', north_townh, 'red', 2);
    visAppend('Central', central_townh, 'red', 2);
    visAppend('South', south_townh, 'red', 2);

    visAppend('North', north_det, 'green', 2);
    visAppend('Central', central_det, 'green', 2);
    visAppend('South', south_det, 'green', 2);

    $('.North').hide();
    $('.South').hide();
    
}

d3.csv("http://www.sfu.ca/~erniet/IAT355/ernie-tsang_jeremy-lo_A4/csv/Active_Listings_D3.csv")
.row(fixDataRow)
.get(function(error, points){
    if(error){
        console.error("An error happened while opening the file. "+ error);
    }else{
        var svg = d3.select("svg");
        drawBarGraph(svg, points);
        setupFilters(svg, points);
    }
});