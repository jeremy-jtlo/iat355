$( document ).ready(function() {
    console.log( "vis2.js is ready." );
    popMain();
    hpi_income_graph()
});

// Row fixer for populations. Has different data than active listings.
function fixPopRow(d) {
    d["Date"] = new Date(d["Date"]);
    d["Population"] = +d["Population"];

    return d;
}

function popFilters(svg, points){
    // Listen to clicks on checkboxes

    $('input').click(function() {
        drawPopGraph(svg, points);
    });
}

function returnPopulationSet(d, desired_region){
    var population_list = []

    for (var i=0; i<d.length; i++){
        var current_row = d[i];
        if (current_row["Region"] == desired_region) {
            population_list.push(current_row);
        }
    }

    return population_list;
}

function popMain() {
// Draw the graph of population
function drawPopGraph(svg, points){
    resp_width = $("#population_vis").width();
    resp_height = $("#population_vis").height();

    var population_vis = d3.select("#population").attr("width", resp_width).attr("height", resp_height),
        WIDTH = resp_width,
        HEIGHT = resp_height,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        };

    var date_array = getDateRange(points);
    date_array.sort(date_sort_asc);
    var start_date = date_array[0];
    var end_date = date_array.pop();
    // console.log(date_array);

    var xScale = d3.time.scale().domain([start_date, end_date]).range([MARGINS.left, WIDTH - MARGINS.right]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.Population; })])
        .range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);

    var population_xAxis = d3.svg.axis()
                .scale(xScale);
    var population_yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickPadding(4);

    // Appending axes
    population_vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(population_xAxis);

    population_vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(population_yAxis);

    var north_pop = returnPopulationSet(points, "North");
    var central_pop = returnPopulationSet(points, "Central");
    var south_pop = returnPopulationSet(points, "South");

    var lineGen = d3.svg.line()
                .x(function(d){
                    return xScale(d.Date);
                })
                .y(function(d){
                    return yScale(d.Population);
                })
                .interpolate("monotone");

    function population_visAppend(region, data_set, width){
        population_vis.append('svg:path')
            .attr('class', region + ' data-line ')
            .attr('d', lineGen(data_set))
            .attr('stroke-width', width)
            .attr('fill', 'none');
    }

    population_visAppend('North', north_pop, 3);
    population_visAppend('Central', central_pop, 3);
    population_visAppend('South', south_pop, 3);
}

d3.csv("http://www.sfu.ca/~jtlo/iat355/data/population.csv")
.row(fixPopRow)
.get(function(error, points){
    if(error){
        console.error("Something went wrong fetching the population csv. " + error);
    }else{ 
        // Select only the correct svg
        var svg = d3.select("svg#population");
        drawPopGraph(svg, points);
        popFilters(svg, points);
    }
});
} // end of popMain()


/*

============= HPI INCOME FUNCTION =============

*/

function hpi_income_graph() {

    resp_width = $("#paired_vis").width();
    resp_height = $("#paired_vis").height();

    var vis = d3.select("#hpi-income")
            .attr("width", resp_width)
            .attr("height", resp_height),
        WIDTH = resp_width,
        HEIGHT = resp_height,
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


        d["HPI"] = parseFloat(d["HPI"].replace(',',''));
        // d["HPI"] = +d["HPI"];

        return d;

    }

    function setupFilters(svg, points){
        // Listen to clicks on checkboxes

        $('input').click(function() {

            drawHpiGraph(svg, points);

        });

    }

    // Drawing the graph
    function drawHpiGraph(svg, points) {
        // Number of entries (for bar weight)
        num_bars = 11;
        var date_array = getDateRange(points);
        
        date_array.sort(date_sort_asc);
        
        var start_date = date_array[0];
        var end_date = date_array.pop();    
        
        var xScale = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.Income; })])    
        .range([WIDTH/2 - MARGINS.right, MARGINS.left]);

         var rxScale = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.HPI; })])    
        // .range([WIDTH/2 , WIDTH - MARGINS.right]);
        .range([0, WIDTH/2]);

        console.log(WIDTH);
        console.log(WIDTH - MARGINS.right); 

        // Define axes
        var xAxis = d3.svg.axis()
                .scale(xScale);

        var rxAxis = d3.svg.axis()
                .scale(rxScale);
                
        var yScale =  d3.time.scale().domain([start_date, end_date]).range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);


        var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickPadding(8);

        var tip1 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<strong>Median Annual Income:</strong> <span style='color:red'>" + d.Income + "</span>";
        })

        var tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<strong>Housing Price Index:</strong> <span style='color:red'>" + d.HPI + "</span>";
        })

        var enterselection1 = svg.selectAll("rect")
          .data(points)
          .enter();

        var enterselection2 = svg.selectAll("rect")
          .data(points)
          .enter();

          var svg = d3.select("body").append("svg")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
          .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");


        svg.call(tip1);
        svg.call(tip2);



        // Append axes        
        vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(20," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);
        
        vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate("  + (WIDTH/2) + ",0)")
        .call(yAxis);

        vis.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (WIDTH/2) + "," + (HEIGHT - MARGINS.bottom) + ")")
        .call(rxAxis); 

        enterselection1.append("rect")
          .attr({    
            x: function(d) { return xScale(d.Income) + 20;},

            y: function(d,i)
            {
                return yScale(d.Year); //moves the y position of each bar to the x-axis
            },

            width: function(d,i)
            {          
              // return (xScale(d.Income)); //inverts the bars so that it is facing upwards
                return Math.abs(xScale(d.Income) - xScale(0));
              // return xScale(d.Income);
            }, 

            height: HEIGHT/num_bars,
            fill: "RGBA(25, 255, 0, 0.40)"
          })
          .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)
            
        enterselection2.append("rect")
          .attr({
            x:WIDTH/2,     

            y: function(d,i)
            {
                return yScale(d.Year); //moves the y position of each bar to the x-axis
            },

            width: function(d,i)
            {   

                return (rxScale(d.HPI)); //inverts the bars so that it is facing upwards
              // return Math.abs(rxScale(d.HPI) - rxScale(0));
            }, 

            height: HEIGHT/num_bars,
            fill: "RGBA(255, 0, 25, 0.75)"
          })
          .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide)

        }

    d3.csv("http://www.sfu.ca/~erniet/IAT355/Assignment%206/csv/SurreyHPIIncomeTest.csv")
    .row(fixDataRow)
    .get(function(error, points){
        if(error){
            console.error("An error happened while opening the file. "+ error);
        }else{
            var svg = d3.select("svg#hpi-income");
            drawHpiGraph(svg, points);
        }
    });
} // End of hpi_income_graph()