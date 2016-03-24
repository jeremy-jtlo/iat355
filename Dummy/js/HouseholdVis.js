// d3.scale.domain([dates]) takes an array of date objects
/*
RESOURCES

Sorting date objects:
https://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109

Sorting objects by date key:
http://stackoverflow.com/questions/19430561/how-to-sort-a-javascript-array-of-objects-by-date

*/

$( document ).ready(function() {
    console.log( "Practice2.js is ready." );
});

var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 200,
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
        date_object = new Date(d[i]["Year"]);
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
    d["Year"] = new Date(d["Year"]);
    d["Income"] = +d["Income"];
    console.log(d.Year);

    return d;

}

function setupFilters(svg, points){
    // Listen to clicks on checkboxes

    $('input').click(function() {
        var $this = $(this);
        // $this will contain a reference to the checkbox   
        if ($this.is(':checked')) {
            // the checkbox was checked 
            drawLineGraph(svg, points);
        } else {
            // the checkbox was unchecked
            drawLineGraph(svg, points);
        }
    });

}

// Drawing the graph
function drawLineGraph(svg, points) {
  
    var date_array = getDateRange(points);
    
    date_array.sort(date_sort_asc);
    // console.log(date_array)
    
    var start_date = date_array[0];
    var end_date = date_array.pop();    
    
    var xScale = d3.scale.linear()
    .domain([0, d3.max(points, function(d) { return d.Income; })])    
    .range([MARGINS.left, WIDTH - MARGINS.right]);
    // Define axes
    var xAxis = d3.svg.axis()
            .scale(xScale);

            
    var yScale =  d3.time.scale().domain([start_date, end_date]).range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);


    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickPadding(8);

    var enterSelection = svg.selectAll("rect")
  .data(points)
  .enter();

    // Append axes        
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
    
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis); 

    enterSelection.append("rect")
  .attr({
      x: function(d,i)
      {  
      console.log(d.Income);    
        return xScale(d.Income);
      }, //adds the offsets based on individual data

      y: function(d,i)
      {
        return yScale(d.Year); //moves the y position of each bar to the x-axis
      },

      height: function(d,i)
        {          
          return (yScale(0) - yScale(d.Year)); //inverts the bars so that it is facing upwards
        },
  })
    
    console.log("End of drawlinegraph function")
}

d3.csv("http://www.sfu.ca/~erniet/IAT355/Assignment%206/csv/SurreyHPIIncome.csv")
.row(fixDataRow)
.get(function(error, points){
    if(error){
        console.error("An error happened while opening the file. "+ error);
    }else{
        var svg = d3.select("svg#visualisation ");
        drawLineGraph(svg, points);
    }
});