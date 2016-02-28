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
  var offset = 68;
  var w = 600;
  var h = 600;

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


var xScale = d3.scale.linear()
  .domain([minDate, maxDate]).range([30, w]);
  
var yScale = d3.scale.linear()
  .domain([minHolds, maxHolds]).range([h-30, 50]);
  

 var xAxis = d3.svg.axis().scale(xScale);  
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(50, 600)")
  .call(xAxis);
  
  var yAxis = d3.svg.axis().scale(yScale).orient("left");  
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(50, 0)")
  .call(yAxis);




  var enterSelection = svg.selectAll("rect")
  .data(points)
  .enter();

  enterSelection.append("rect")
  .attr({
      x: function(d,i){
        // if(d.Region="Detached"){
        var scalingFactor = 0.30;
        var regionFactor = 0;
        console.log(d.Date.getMonth());
        if (d.Date.getMonth() >= 5) {
          scalingFactor += 0.5;
        }
        console.log(d.Region);
        if(d.Region=="South")
        {
          regionFactor = -0.075;
        }

        if(d.Region=="North")
        {
          regionFactor = 0.075;
        }

        return xScale(d.Date.getFullYear() + scalingFactor + regionFactor);}
        
        // return xScale(d.Date.getFullYear() + 0.30 + 0.1);} 

        // console.log(d.Region); 
        
      ,
      y: function(d,i)
      {
        //console.log(yScale(550));
        return yScale(d.Households);
        //return yScale(550);
      },
      width: 600/90, //-1 to add space between bars
      height: function(d,i)
        {
          //return d["Households"];
          return (yScale(0) - yScale(d.Households));


        },
      fill: function(d, i){return houseTypeColors[d.Households];}
  });

 

// var xScale = d3.scale.ordinal()
//   .domain([minDate, maxDate]).rangeRoundBands([0, w]);

  
}

var houseTypeColors = {
  "Detached": "red",
  "Townhouse": "blue",
  "Apartment": "green"
};

function fixDataRow(d) {
  var format = d3.time.format("%Y-%m-%d");
  d["Date"] = format.parse(d["Date"]);
  // d["Date"] = +d["Date"]
  console.log(d["Date"]);
  d["Households"] = +d["Households"];  
  return d;
}

 
  
  
  
