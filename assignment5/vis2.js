var population_vis = d3.select("#population"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };

// Row fixer for populations. Has different data than active listings.
function fixPopRow(d) {
    d["Date"] = new Date(d["Date"]);
    d["Population"] = +d["Population"];

    return d;
}

function popFilters(svg, points){
    // Listen to clicks on checkboxes
    d3.selectAll("input[name='region_check']").on("click", function(){
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

// Draw the graph of population
function drawPopGraph(svg, points){

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