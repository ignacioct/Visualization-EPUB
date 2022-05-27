// Line chart based on https://d3-graph-gallery.com/boxplot.html

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data = [
  { date: "2011-04-28", value: " 135.98" },
  { date: "2012-04-28", value: " 12" },
  { date: "2013-04-28", value: " 456" },
  { date: "2014-04-28", value: " 9" },
  { date: "2015-04-28", value: " 27" },
  { date: "2016-04-28", value: " 200" },
];

for (let i = 0; i < data.length; i++) {
  data[i] = {
    date: d3.timeParse("%Y-%m-%d")(data[i].date),
    value: data[i].value,
  };
}

var x = d3
  .scaleTime()
  .domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  )
  .range([0, width]);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      return +d.value;
    }),
  ])
  .range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

// Add the line
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.value);
      })
  );
