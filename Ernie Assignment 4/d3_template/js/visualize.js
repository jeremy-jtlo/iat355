d3.csv("http://www.sfu.ca/~erniet/IAT355/Assignment%204/D3/Active_Listings_D3.csv")
.row(fixDataRow)
.get(function(error, points){
  // error checking
  if(error){
    console.error("Error occured while reading file. " + error);
  }else{
    var svg = d3.select("svg");
    drawBarGraph(svg, points);
  }
});

function drawBarGraph(svg, points) {
  var barWidth = 20;
  var enterSelection = svg.selectAll("rect")
  .data(points)
  .enter();

  enterSelection.append("rect")
  .attr({
      x: function(d,i){return i*barWidth;},
      y: function(d,i){return 50-d;},
      width: barWidth-1, //-1 to add space between bars
      height: function(d,i){return d;},
      fill: function(d, i){return houseTypeColors[d.Households];}
  });

  var minDate = d3.min(points, function(d){
    return d["Date"];
  });
  
  
  var maxDate = d3.max(points, function(d){
    return d["Date"];
  });
  
  // var minSW = d3.min(points, function(d){
  //   return d["Sepal Width"];
  // });
  
  
  // var maxSW = d3.max(points, function(d){
  //   return d["Sepal Width"];
  // });

var xScale = d3.scale.linear().domain([minDate, maxDate]).range([50, 450]);
  
// var yScale = d3.scale.linear().domain([minSW, maxSW]).range([450, 50]);



 var xAxis = d3.svg.axis().scale(xScale);  
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0, 450)")
  //.ticks(d3.time.year, 2)
  .call(xAxis);
  
  // var yAxis = d3.svg.axis().scale(yScale).orient("left");  
  // svg.append("g")
  // .attr("class", "axis")
  // .attr("transform", "translate(50, 0)")
  // .call(yAxis);
  
}

var houseTypeColors = {
  "Detached": "red",
  "Townhouse": "blue",
  "Apartment": "green"
};

function fixDataRow(d) {
  var format = d3.time.format("%Y-%m-%d");
  d["Date"] = format.parse(d["Date"]).getFullYear();
  console.log(d["Date"]);
  d["Households"] = +d["Households"];  
  return d;
}

 
  
  
  
