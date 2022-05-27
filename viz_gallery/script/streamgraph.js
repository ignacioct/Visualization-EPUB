// Streamgraph based on https://d3-graph-gallery.com/streamgraph.html

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function csvToArrayHeaders(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  return headers;
}

// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#streamgraph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = csvToArray(file, ",");

// List of groups = header of the csv files
var keys = csvToArrayHeaders(file, ",");

// Add X axis
var x = d3
  .scaleLinear()
  .domain(
    d3.extent(data, function (d) {
      return d.year;
    })
  )
  .range([0, width]);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(5));

// Add Y axis
var y = d3.scaleLinear().domain([-100000, 100000]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

// color palette
var color = d3
  .scaleOrdinal()
  .domain(keys)
  .range([
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#ffff33",
    "#a65628",
    "#f781bf",
  ]);

//stack the data?
var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(data);

// Show the areas
svg
  .selectAll("mylayers")
  .data(stackedData)
  .enter()
  .append("path")
  .style("fill", function (d) {
    return color(d.key);
  })
  .attr(
    "d",
    d3
      .area()
      .x(function (d, i) {
        return x(d.data.year);
      })
      .y0(function (d) {
        return y(d[0]);
      })
      .y1(function (d) {
        return y(d[1]);
      })
  );
