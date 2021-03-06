$( document ).ready(function() {
    
    console.log( "visualize.js is ready." );
    listing();
    population();
    pairedBars();

});

/*
==================== GLOBALS ====================

These things are used by all of our functions. Plenty
of stuff needs to be done in all visualizations, so
having some predefined global helpers will go a long
way in keeping things tidy.

*/

// Loop over a CSV column, return all objects in that column.
function getDataRange(d, column){
    var return_list = []

    for (var i=0; i<d.length; i++){
        push_object = d[i][column];
        return_list.push(push_object);
    }

    return return_list;
}

// Sort dates in ascending order when called from sort()
function dateSortAsc(date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
}

// Sort objects by 'Date' key
function sortObjByDate(a,b) { 
    return new Date(a.Date).getTime() - new Date(b.Date).getTime()
}

// Convert a number to a string with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// General Graph margins
MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 45
    };

// Height for the larger visualisations
LARGE_HEIGHT = 400;

// Universal dot size for line graphs
dot_radius = 5;

/*
==================== LISTING() ====================

Shows us data on detached houses, apartments, townhouses
based on region.

*/
function listing(){

    // Global line weight
    var line_weight = 2;
    // Y-axis number of ticks
    var housing_ticks = 5;

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<strong>"+ (d["Date"].getFullYear()) + " " + d.Region +" Surrey Listings:</strong> <span style='color:red'>" + numberWithCommas(d.Households) + "</span>";
        })      

    // HELPER FUNCTION: clean data rows
    function fixListingRow(d){

        var format = d3.time.format("%Y-%m-%d");
        d["Date"] = format.parse(d["Date"]);
        d["Households"] = +d["Households"];

        return d;
    }

    // HELPER FUNCTION: Returns a list of entries
    // matching a REGION and LISTING TYPE
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

    // HELPER FUNCTION: Draw axes for the available
    // listings graphs.
    function drawListAxes(data, x, y, target_vis){

        // Scale and axes definitions
    
        var xAxis = d3.svg.axis()
                    .ticks(d3.time.years)
                    .scale(x);

        var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(housing_ticks)
                    .orient('left')
                    .tickPadding(8);

        // Append axes        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);
        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Active Listings");

    }

    // HELPER FUNCTION for drawing lines
    function visAppend(region, data_set, target_vis, x, y, type, width) {

        // HELPER FUNCTION for drawing lines
        var lineGen = d3.svg.line()
                .x(function(d) {
                    return x(d.Date);
                })
                .y(function(d) {
                    return y(d.Households);
                })
                .interpolate("monotone"); // Interpolate gives us curves

        target_vis.append('svg:path')
            .attr('class', region + ' data-line ' + type)
            .attr('d', lineGen(data_set))
            .attr('stroke-width', width)
            .attr('fill', 'none');

        // Adding dots
        target_vis.selectAll("g.circle."+region)
        .data(data_set)
        .enter().append("g")
        .attr("class", "dot " + region)
        .append("circle")
        .attr("r", dot_radius)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("cx", function(d,i) { return x(d.Date); })
        .attr("cy", function(d,i) { return y(d.Households); });
    }

    /*
    ==== DETACHED HOME GRAPH ====
    */
    function drawDetached(svg, points, dates){

        var start_date = dates[0];
        var end_date = dates.pop();

        WIDTH = $("#detached").width();
        HEIGHT = $("#detached").height();

        var vis = d3.select("#detached_vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

        var xScale = d3.time.scale()
                    .domain([start_date, end_date])
                    .range([MARGINS.left, WIDTH - MARGINS.right]);
        var yScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.Households; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top])
                    .nice();

        var north_det = returnDataSet(points, "North", "Detached");
        north_det.sort(sortObjByDate);
        
        var central_det = returnDataSet(points, "Central", "Detached");
        central_det.sort(sortObjByDate);

        var south_det = returnDataSet(points, "South", "Detached");
        south_det.sort(sortObjByDate);

        // Scale and axes definitions
        drawListAxes(points, xScale, yScale,vis);

        // Draw the lines
        visAppend("North", north_det, vis, xScale, yScale, "Detached", line_weight);
        visAppend("Central", central_det, vis, xScale, yScale, "Detached", line_weight);
        visAppend("South", south_det, vis, xScale, yScale, "Detached", line_weight);

              
        var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip);

    }

    /*
    ==== APARTMENT GRAPH ====
    */
    function drawApartment(svg, points, dates){

        var start_date = dates[0];
        var end_date = dates.pop();

        WIDTH = $("#apartment").width();
        HEIGHT = $("#apartment").height();

        var vis = d3.select("#apartment_vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

        var xScale = d3.time.scale()
                    .domain([start_date, end_date])
                    .range([MARGINS.left, WIDTH - MARGINS.right]);
        var yScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.Households; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top])
                    .nice();

        var north_apts = returnDataSet(points, "North", "Apartment");
        north_apts.sort(sortObjByDate);

        var central_apts = returnDataSet(points, "Central", "Apartment");
        central_apts.sort(sortObjByDate);

        var south_apts = returnDataSet(points, "South", "Apartment");
        south_apts.sort(sortObjByDate);

        // Scale and axes definitions
        drawListAxes(points, xScale, yScale,vis);

        // Draw the lines
        visAppend("North", north_apts, vis, xScale, yScale, "Apartment", line_weight);
        visAppend("Central", central_apts, vis, xScale, yScale, "Apartment", line_weight);
        visAppend("South", south_apts, vis, xScale, yScale, "Apartment", line_weight);

        var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip);

    }

    /*
    ==== TOWNHOUSE GRAPH ====
    */
    function drawTownhouse(svg, points, dates){

        var start_date = dates[0];
        var end_date = dates.pop();

        WIDTH = $("#townhouse").width();
        HEIGHT = $("#townhouse").height();

        var vis = d3.select("#townhouse_vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

        var xScale = d3.time.scale()
                    .domain([start_date, end_date])
                    .range([MARGINS.left, WIDTH - MARGINS.right]);
        var yScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.Households; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top])
                    .nice();

        var north_townh = returnDataSet(points, "North", "Townhouse");
        north_townh.sort(sortObjByDate);
        
        var central_townh = returnDataSet(points, "Central", "Townhouse");
        central_townh.sort(sortObjByDate);

        var south_townh = returnDataSet(points, "South", "Townhouse");
        south_townh.sort(sortObjByDate);

        // Scale and axes definitions
        drawListAxes(points, xScale, yScale,vis);

        // Draw the lines
        visAppend("North", north_townh, vis, xScale, yScale, "Townhouse", line_weight);
        visAppend("Central", central_townh, vis, xScale, yScale, "Townhouse", line_weight);
        visAppend("South", south_townh, vis, xScale, yScale, "Townhouse", line_weight);

               
        var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip);

    }

    // Calling the CSV file and running our functions
    d3.csv("http://www.sfu.ca/~erniet/IAT355/ernie-tsang_jeremy-lo_A4/csv/Active_Listings_D3.csv")
    .row(fixListingRow)
    .get(function(error, points){
        if(error){
            console.error("An error happened while opening the listing data: "+ error);
        }else{
            var detached_listings = d3.select("svg#detached_vis");
            var apartment_listings = d3.select("svg#apartment_vis");
            var townhouse_listings = d3.select("svg#townhouse_vis");

            var date_array = getDataRange(points, "Date");
            date_array.sort(dateSortAsc);

            drawDetached(detached_listings, points, date_array);
            drawApartment(apartment_listings, points, date_array);
            drawTownhouse(townhouse_listings, points, date_array);
        }
    });
}

/*
==================== POPULATION() ====================

Draws a line graph with our population data

*/

function population(){

    var line_weight = 2;
    var population_ticks = 5;

     var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            var content_string = d.Region + " Surrey Residents (" + ((d.Date).getFullYear() + 1) + ")";
            var value_string = numberWithCommas(d.Population);

            var return_string = "<span style='color:red'>"+ value_string +"</span><strong> " + content_string + "</strong>";
            return return_string;
        })

    // HELPER FUNCTION: Clean our population csv.
    function fixPopRow(d){
        d["Date"] = new Date(d["Date"]);
        d["Population"] = +d["Population"];

        return d; 
    }

    function returnDataSet(d, desired_region){
        var population_list = []
        
        // Loop
        for (var i=0; i<d.length; i++){
            var current_region = d[i];
            if ((current_region["Region"] == desired_region)) {
                population_list.push(current_region);
            }
        }
        
        return population_list;
    }

    // HELPER FUNCTION: Draw axes for the available
    // listings graphs.
    function drawListAxes(data, x, y, target_vis){

        // Scale and axes definitions
    
        var xAxis = d3.svg.axis()
                    .ticks(d3.time.years)
                    .scale(x);

        var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(population_ticks)
                    .orient('left')
                    .tickPadding(-4);

        // Append axes        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);
        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Estimated Residents");

    }

    function visAppend(region, data_set, target_vis, x, y, width) {

        // HELPER FUNCTION for drawing lines
        var lineGen = d3.svg.line()
                .x(function(d) {
                    return x(d.Date);
                })
                .y(function(d) {
                    return y(d.Population);
                })
                .interpolate("monotone"); // Interpolate gives us curves

        target_vis.append('svg:path')
            .attr('class', region + ' data-line ')
            .attr('d', lineGen(data_set))
            .attr('stroke-width', width)
            .attr('fill', 'none');

        // Adding dots
        target_vis.selectAll("g.dot."+region)
        .data(data_set)
        .enter().append("g")
        .attr("class", "dot " + region)
        .append("circle")
        .attr("r", dot_radius)
        .attr("cx", function(d,i) { return x(d.Date); })
        .attr("cy", function(d,i) { return y(d.Population); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    }


    // Handles the population graph. Currently in a 
    // col-md-6 block in the HTML.
    function drawPopGraph(svg, points, dates){

        // Fixing off-by-1 errors in JS Date() objects
        var start_date = dates[0];
        var start_year = start_date.getFullYear() + 2;
        start_year += "";

        start_date = new Date(start_year);

        var end_date = dates.pop();

        WIDTH = $("#population").width();
        // HEIGHT = $("#population").height();
        HEIGHT = LARGE_HEIGHT;

        var vis = d3.select("#population_vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

        var xScale = d3.time.scale()
                    .domain([start_date, end_date])
                    .range([MARGINS.left, WIDTH - MARGINS.right])
                    .nice();
        var yScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.Population; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top]);

        var north_pop = returnDataSet(points, "North");
        north_pop.sort(sortObjByDate);
        
        var central_pop = returnDataSet(points, "Central");
        central_pop.sort(sortObjByDate);

        var south_pop = returnDataSet(points, "South");
        south_pop.sort(sortObjByDate);       
        
       
        var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip);


        // Scale and axes definitions
        drawListAxes(points, xScale, yScale,vis);

        // Draw the lines
        visAppend("North", north_pop, vis, xScale, yScale, line_weight);
        visAppend("Central", central_pop, vis, xScale, yScale, line_weight);
        visAppend("South", south_pop, vis, xScale, yScale, line_weight);

    }

    d3.csv("http://www.sfu.ca/~erniet/IAT355/Final/csv/population.csv")
    .row(fixPopRow)
    .get(function(error, points){
        if(error){
            console.error("Something went wrong fetching the population csv: " + error);
        }else{ 
            // Select only the correct svg

            var date_array = getDataRange(points, "Date");
            date_array.sort(dateSortAsc);

            var population_svg = d3.select("svg#population_vis");
            drawPopGraph(population_svg, points, date_array);
        }
    });
}

/*
==================== pairedBars() ====================
*/

function pairedBars()
{

    // Global line weight
    var bar_width = 10;
    // Y-axis number of ticks
    var paired_ticks = 8;

    // Bar graph offset
    var bar_offset = 10;

    var tip1 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<strong>"+ (d["Date"].getFullYear()+1) +" Housing Price Index:</strong> <span style='color:red'>$" + numberWithCommas(d.HPI) + " CAD</span>";
        })

    var tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<strong>"+ (d["Date"].getFullYear()+1) +" Median Annual Income:</strong> <span style='color:red'>$" + numberWithCommas(d.Income) + " CAD</span>";
        })
   
    function fixDataRow(d) {
        
        d["Date"] = new Date(d["Year"]);
        d["Income"] = +d["Value"];
        d["HPI"] = +d["Value"];

        
        return d;
    }      

    function returnDataSet(d, desired_type){
        var type_list = []
        
        // Loop
        for (var i=0; i<d.length; i++){
            var current_type = d[i];
            if ((current_type["Type"] == desired_type)) {
                type_list.push(current_type);
            }
        }
        
        return type_list;
    }

    // HELPER FUNCTION: Draw axes for the available
    // listings graphs.
    function drawListAxes(data, x, y, target_vis){

        // Scale and axes definitions
    
        var xAxis = d3.svg.axis()
                    .ticks(d3.time.years)
                    .scale(x);

        var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(paired_ticks)
                    .orient('left')
                    .tickPadding(-5);

        // Append axes        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom*2) + ")")
        .call(xAxis);
        
        target_vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("HPI vs Income");
    }

    function HPIAppend(type, data_set, target_vis, x, y, width) 
    {
        //creates bars
        target_vis.selectAll("rect")
        .data(data_set)
        .enter().append("g")
        .append("rect")
        .attr("class", "hpi")
        .attr("x", function(d,i) {

            return_x = x(d.Date);
            if ((d.Date).getFullYear() > 2005) {
                return_x -= bar_offset;
            }
            return return_x; 
        })
        .attr("y", function(d,i) {return y(d.HPI); })
        .attr("width", bar_width)
        .attr("height", function(d,i) { return y(0) - y(d.HPI); })
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)                 
    }

     function incomeAppend(type, data_set, target_vis, x, y, width) 
    {
        //creates bars
        target_vis.selectAll("empty")
        .data(data_set)
        .enter().append("g")
        .append("rect")
        .attr("class", "income")
        .attr("x", function(d,i) {

            return_x = x(d.Date) + 12;
            if ((d.Date).getFullYear() > 2005) {
                return_x -= bar_offset;
            }
            return return_x; 
        })
        .attr("y", function(d,i) {return y(d.Income); })
        .attr("width", bar_width)
        .attr("height", function(d,i) { return y(0) - y(d.Income); })
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide)                 
    }

    function drawPaired(svg, points, dates){

        var start_date = dates[0];
        var end_date = dates.pop();

        WIDTH = $("#paired").width();
        // HEIGHT = $("#paired").height();
        HEIGHT = LARGE_HEIGHT + 20;

        var vis = d3.select("#paired_vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

        var xScale = d3.time.scale()
                    .domain([start_date, end_date])
                    .range([MARGINS.left, WIDTH - MARGINS.right])
                    .nice();
        var yHPIScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.HPI; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top])
                    .nice();
        var yIncomeScale = d3.scale.linear()
                    .domain([0, d3.max(points, function(d) { return d.Income; })])
                    .range([HEIGHT - MARGINS.top - MARGINS.bottom, MARGINS.top])
                    .nice();

        var hpi_type = returnDataSet(points, "HPI");
        hpi_type.sort(sortObjByDate);
        var income_type = returnDataSet(points, "Income");
        income_type.sort(sortObjByDate);

        
        var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip1);
        svg.call(tip2);
         

        // Draw the bars
        HPIAppend("HPI", hpi_type, vis, xScale, yHPIScale, bar_width);   
        incomeAppend("Income", income_type, vis, xScale, yIncomeScale, bar_width);

        // Scale and axes definitions
        drawListAxes(points, xScale, yIncomeScale,vis);
       
    }

    d3.csv("http://www.sfu.ca/~erniet/IAT355/Final/csv/paired.csv")
    .row(fixDataRow)
    .get(function(error, points){
        if(error){
            console.error("Something went wrong fetching the paired csv: " + error);
        }else{ 
            // Select only the correct svg
            var date_array = getDataRange(points, "Date");
            date_array.sort(dateSortAsc);

            var paired_svg = d3.select("svg#paired_vis");
            drawPaired(paired_svg, points, date_array);
        }
    });
}