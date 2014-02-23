(function (){
  var VIZ = {};
  var width = 100, height = 100;
  var basePoint = {x: 0, y: 0};
  
  VIZ.segments =[];
  VIZ.segments.push({ id: _.uniqueId(), x1: 10, y1: 10, x2: 50, y2: 50, a: 27 });
  VIZ.segments.push({ id: _.uniqueId(), x1: 90, y1: 10, x2: 50, y2: 50, a: 45 });
  console.log("segments", VIZ.segments);

  var colors = ['#006600','#663333','#CC0033','#330099'];
  var svg = d3.select("#svg-container")
    .append("svg")
    .attr("id", "thesvg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .append("g");

  VIZ.times = 10000;
  VIZ.count = 0;

  function getCoords(x, y) {
    var p = random(1,1000);
    return p <= 701 ? {c: 0, x: 0.81 * x + 0.07  * y + 0.12, y: -0.04 * x + 0.84 * y + 0.195}: 
           p <= 851 ? {c: 1, x: 0.18 * x - 0.25  * y + 0.12, y: 0.27  * x + 0.23 * y + 0.02 }:
           p <= 980 ? {c: 2, x: 0.19 * x + 0.275 * y + 0.16, y: 0.238 * x - 0.14 * y + 0.12 }:
           {c: 3, x: 0.0235 * x + 0.087 * y + 0.11, y: 0.045 * x + 0.1666 * y};
  }

  function random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  VIZ.drawLine = function(data) {
    svg.selectAll(".lineSegment")
      .data(data, function (d) { return d.id; })
      .enter()
      .append("line")
      .attr("class", "lineSegment")
      .attr("x1", function (d) { return d.x1; })
      .attr("y1", function (d) { return d.y1; })
      .attr("x2", function (d) { return d.x2; })
      .attr("y2", function (d) { return d.y2; })

    svg.selectAll(".lineSegment")
      .data(data, function (d) { return d.id; })
      .exit()
        .transition()
        .duration(500)
        .attr("transform", function (d) { return "translate(1000,1000)"; })
        .style("fill-opacity", 0)
        .remove();
  }

  VIZ.iterate = function (ary) {
    var l = ary.length, p, midPoint, newX1, newY1;

    for (var i = 0; i < l; i++){
      p = VIZ.segments.pop();
      midPoint = {x: (p.x1 + p.x2) / 2, y: (p.y1 + p.y2) / 2};
      newX1 = p.x1 + Math.cos( 0.785398163) * (midPoint.x - p.x1) - Math.sin( 0.785398163) * (midPoint.y - p.y1);
      newY1 = p.y1 + Math.sin( 0.785398163) * (midPoint.x - p.x1) + Math.cos( 0.785398163) * (midPoint.y - p.y1);

      newX2 = p.x2 + Math.cos(-0.785398163) * (midPoint.x - p.x2) - Math.sin(-0.785398163) * (midPoint.y - p.y2);
      newY2 = p.y2 + Math.sin(-0.785398163) * (midPoint.x - p.x2) + Math.cos(-0.785398163) * (midPoint.y - p.y2);

      VIZ.segments.unshift({ id: _.uniqueId(), x1: p.x1, y1: p.y1, x2: newX1, y2: newY1, a: 45 });
      VIZ.segments.unshift({ id: _.uniqueId(), x1: p.x2, y1: p.y2, x2: newX2, y2: newY2, a: 45 });
    }
  }

  VIZ.addPoint = function (colors) {
    var xy = getCoords(basePoint.x, basePoint.y);
    basePoint = xy;
    if (colors) {
      renderPoint({c: xy.c, x: xy.x + width / 5, y: xy.y + height / 10}, 1);
    } else {
      renderPoint({c: xy.c, x: xy.x + width / 5, y: xy.y + height / 10}, 0);
    }
  }

  VIZ.onResize = function () {
    var aspect = height / width, chart = $("#thesvg");
    var targetWidth = chart.parent().width();
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
  }

  window.VIZ = VIZ;

}())