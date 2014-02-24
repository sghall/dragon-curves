(function (){
  var VIZ = {};
  var width = 100, height = 100, segments = [];
  var svg = d3.select("#svg-container")
    .append("svg")
    .attr("id", "thesvg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .append("g");

  VIZ.count = 0;

  VIZ.addSegment = function (obj) {
    segments.push(obj);
  }

  VIZ.drawLines = function () {
    svg.selectAll(".lineSegment")
      .data(segments, function (d) { return d.id; })
      .enter()
      .append("line")
      .attr("class", "lineSegment")
      .attr("x1", function (d) { return d.x1; })
      .attr("y1", function (d) { return d.y1; })
      .attr("x2", function (d) { return d.x2; })
      .attr("y2", function (d) { return d.y2; })
      .style("stroke", function (d) { return d.c; });

    svg.selectAll(".lineSegment")
      .data(segments, function (d) { return d.id; })
      .exit()
        .style("stroke", "grey")
        .transition()
        .delay(500)
        .duration(500)
        .style("opacity", 0)
        .remove();
  }

  function rotatePoint(point, center, radians) {
    var cos = Math.cos(radians), sin = Math.sin(radians);
    return {
       x: center.x + cos * (point.x - center.x) - sin * (point.y - center.y),
       y: center.y + sin * (point.x - center.x) + cos * (point.y - center.y)
    };
  }

  function findIntersection(p1, p2, p3, p4) {
    var t1 = (p1.x * p2.y - p1.y * p2.x);
    var t2 = (p3.x * p4.y - p3.y * p4.x);
    var t3 = (p1.x - p2.x);
    var t4 = (p3.y - p4.y);
    var t5 = (p1.y - p2.y);
    var t6 = (p3.x - p4.x);
    var nx = (t1 * t6 - t3 * t2)/(t3 * t4 - t5 * t6);
    var ny = (t1 * t4 - t5 * t2)/(t3 * t4 - t5 * t6);
    return {x: nx, y: ny};
  }

  VIZ.iterate = function () {
    var len = segments.length, segment, p1, p2, mp, r1, r2, ip;
    for (var i = 0; i < len; i++){
      segment = segments.pop();
      p1 = {x: segment.x1, y: segment.y1};
      p2 = {x: segment.x2, y: segment.y2};
      mp = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
      r1 = rotatePoint(mp, {x: p1.x, y: p1.y},  0.785398163);
      r2 = rotatePoint(mp, {x: p2.x, y: p2.y}, -0.785398163);
      ip = findIntersection(p1, r1, p2, r2);
      segments.unshift({ id: _.uniqueId(), x1: p1.x, y1: p1.y, x2: ip.x, y2: ip.y, c: segment.c });
      segments.unshift({ id: _.uniqueId(), x1: p2.x, y1: p2.y, x2: ip.x, y2: ip.y, c: segment.c });
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