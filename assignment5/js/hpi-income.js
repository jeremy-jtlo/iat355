// d3.scale.domain([dates]) takes an array of date objects
/*
RESOURCES

Sorting date objects:
https://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109

Sorting objects by date key:
http://stackoverflow.com/questions/19430561/how-to-sort-a-javascript-array-of-objects-by-date

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
      
        var date_array = getDateRange(points);
        
        date_array.sort(date_sort_asc);
        
        var start_date = date_array[0];
        var end_date = date_array.pop();    
        
        var xScale = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.Income; })])    
        .range([WIDTH/2 - MARGINS.right, MARGINS.left]);

         var rxScale = d3.scale.linear()
        .domain([0, d3.max(points, function(d) { return d.HPI; })])    
        .range([WIDTH/2 , WIDTH - MARGINS.right]);    

        // Define axes
        var xAxis = d3.svg.axis()
                .scale(xScale);

        var rxAxis = d3.svg.axis()
                .scale(rxScale)
                
        var yScale =  d3.time.scale().domain([start_date, end_date]).range([HEIGHT - MARGINS.top - MARGINS.bottom, 0]);


        var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickPadding(8);

        //reference tip library for hover
        var tip1 = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Income:</strong> <span style='color:red'>" + d.Income + "</span>";
        }

         var tip2 = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>HPI:</strong> <span style='color:red'>" + d.HPI + "</span>";
        }
          
        var enterSelection1 = svg.selectAll("rect")
          .data(points)
          .enter();
        var enterSelection2 = svg.selectAll("rect")
          .data(points)
          .enter();

        //assign different tips for each side
        enterSelection1.call(tip1);
        enterSelection2.call(tip2);

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
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(rxAxis); 

        enterSelection1.append("rect")
          .attr({
            // x: WIDTH/2,     
            x: function(d) { return xScale(d.Income) + 20; },

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

              height: 5
          })

        //mouseover for Income
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)           
            
        enterSelection2.append("rect")
          .attr({
            x:WIDTH/2,     

              y: function(d,i)
              {
                return yScale(d.Year); //moves the y position of each bar to the x-axis
              },

              width: function(d,i)
                {          
                  return (rxScale(d.HPI)/2); //inverts the bars so that it is facing upwards
                  // return Math.abs(rxScale(d.HPI) - rxScale(0));
                }, 

              height: 5
          })

        //mouseover for HPI
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide)          
      });            

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