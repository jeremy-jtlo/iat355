/*
This tutorial is available at:
http://jsbin.com/nibobe/edit?js,output
*/

d3.csv("http://www.sfu.ca/~aga53/data/iris.csv")
.row(fixIrisRow)
.get(function(error, points){
  // error checking
  if(error){
    console.error("Error occured while reading file. " + error);
  }else{
    var svg = d3.select("svg");
    drawScatterplot(svg, points);
  }
});

function drawScatterplot(svg, points) {
  var enterSelection = svg.selectAll("circle")
  .data(points)
  .enter();
  
  var minSL = d3.min(points, function(d){
    return d["Sepal Length"];
  });
  
  
  var maxSL = d3.max(points, function(d){
    return d["Sepal Length"];
  });
  
  var minSW = d3.min(points, function(d){
    return d["Sepal Width"];
  });
  
  
  var maxSW = d3.max(points, function(d){
    return d["Sepal Width"];
  });
  
  var xScale = d3.scale.linear().domain([minSL, maxSL]).range([50, 450]);
  
  var yScale = d3.scale.linear().domain([minSW, maxSW]).range([450, 50]);

  enterSelection.append("circle")
  .attr({
    cx  : function(d, i){
      return xScale(d["Sepal Length"]);
    },
    cy  : function(d, i){
      return yScale(d["Sepal Width"]);
    },
    r  : function(d, i){
      return d["Petal Length"];
    },
    fill: function(d, i){
      return speciesColors[d.Species];
    }
  });
  
  var xAxis = d3.svg.axis().scale(xScale);
  var yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  svg.append("g").attr("class", "axis").attr("transform", "translate(0,450)")
    .call(xAxis);
  
  svg.append("g").attr("class", "axis").attr("transform", "translate(50, 0)").call(yAxis);
  
}

var speciesColors = {
  "virginica": "red",
  "versicolor": "blue",
  "setosa" : "green"
};

function fixIrisRow(d) {
  d["Petal Length"] = +d["Petal Length"];
  d["Petal Width"] = +d["Petal Width"];
  d["Sepal Length"] = +d["Sepal Length"];
  d["Sepal Width"] = +d["Sepal Width"];
  return d;
}











