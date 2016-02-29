d3.csv("http://www.sfu.ca/~erniet/IAT355/ernie-tsang_jeremy-lo_A4/csv/Active_Listings_D3.csv") //find the csv
.row(fixDataRow) //implement the data format fixes
.get(function(error, points){
  // error checking
  if(error){
    console.error("Error occured while reading file. " + error);
  }else{
    var svg = d3.select("svg");
    drawBarGraph(svg, points);
  }
});

//draws the bargraph
function drawBarGraph(svg, points) {
  var offset = 68;
  var w = 600;
  var h = 600;

 //find the minimum and maximum of both date and household amount 
 var minDate = d3.min(points, function(d){
    return d["Date"].getFullYear();
  });
  
  
  var maxDate = d3.max(points, function(d){
    return d["Date"].getFullYear();
  });
  
  var minHolds = d3.min(points, function(d){
    return d["Households"];
  });
  
  
  var maxHolds = d3.max(points, function(d){
    return d["Households"];
  });


//defining the scale of x based on min and max of date
var xScale = d3.scale.linear()
  .domain([minDate, maxDate]).range([30, w]);

//defining the scale of y based on min and max of household numbers
var yScale = d3.scale.linear()
  .domain([minHolds, maxHolds]).range([h-30, 50]);
  
  //creates x-axis
  var xAxis = d3.svg.axis().scale(xScale);  
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(50, 600)")
  .call(xAxis);
  
  //creates y-axis, orients to the left
  var yAxis = d3.svg.axis().scale(yScale).orient("left");  
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(50, 0)")
  .call(yAxis);

  //selects all selections
  var enterSelection = svg.selectAll("rect")
  .data(points)
  .enter();

  enterSelection.append("rect")
  .attr({
      x: function(d,i){
        //setting up how each bar is positioned based on their region
        var scalingFactor = 0.30;
        var regionFactor = 0;

        //if the month is in june, then move it to the appropriate location on the x-axis
        if (d.Date.getMonth() >= 5) {
          scalingFactor += 0.5;
        }

        //offsets bar by amount based on region
        if(d.Region=="South")
        {
          regionFactor = -0.075;
        }

        if(d.Region=="North")
        {
          regionFactor = 0.075;
        }

        return xScale(d.Date.getFullYear() + scalingFactor + regionFactor);}, //adds the offsets based on individual data

      y: function(d,i)
      {
        return yScale(d.Households); //moves the y position of each bar to the x-axis
      },
      width: w/90, 

      height: function(d,i)
        {          
          return (yScale(0) - yScale(d.Households)); //inverts the bars so that it is facing upwards
        },
  })

  //decide which colours to fill based on region
  .attr("class", function(d,i) {
    var addThisClass = "orange";
    
    if(d.Region=="South")
    {
      addThisClass = "blue";
    }

    if(d.Region=="North")
    {
      addThisClass = "green";
    }

    return addThisClass;
  });

}

//fixes the data formatting
function fixDataRow(d) {
  var format = d3.time.format("%Y-%m-%d"); //formats as year-month-day
  d["Date"] = format.parse(d["Date"]); 

  d["Households"] = +d["Households"];  
  return d;
}

 
  
  
  
