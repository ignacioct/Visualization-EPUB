// set the dimensions and margins of the graph
var width = 460;
var height = 460;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz5")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(40,0)"); // bit of margin on the left = 40

data = {
  children: [
    {
      name: "boss1",
      children: [
        { name: "mister_a", colname: "level3" },
        { name: "mister_b", colname: "level3" },
        { name: "mister_c", colname: "level3" },
        { name: "mister_d", colname: "level3" },
      ],
      colname: "level2",
    },
    {
      name: "boss2",
      children: [
        { name: "mister_e", colname: "level3" },
        { name: "mister_f", colname: "level3" },
        { name: "mister_g", colname: "level3" },
        { name: "mister_h", colname: "level3" },
      ],
      colname: "level2",
    },
  ],
  name: "CEO",
};

// Create the cluster layout:
var cluster = d3.cluster().size([height, width - 100]); // 100 is the margin I will have on the right side

// Give the data to this cluster layout:
var root = d3.hierarchy(data, function (d) {
  return d.children;
});
cluster(root);

// Add the links between nodes:
svg
  .selectAll("path")
  .data(root.descendants().slice(1))
  .enter()
  .append("path")
  .attr("d", function (d) {
    return (
      "M" +
      d.y +
      "," +
      d.x +
      "C" +
      (d.parent.y + 50) +
      "," +
      d.x +
      " " +
      (d.parent.y + 150) +
      "," +
      d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
      " " +
      d.parent.y +
      "," +
      d.parent.x
    );
  })
  .style("fill", "none")
  .attr("stroke", "#ccc");

// Add a circle for each node.
svg
  .selectAll("g")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("transform", function (d) {
    return "translate(" + d.y + "," + d.x + ")";
  })
  .append("circle")
  .attr("r", 7)
  .style("fill", "#69b3a2")
  .attr("stroke", "black")
  .style("stroke-width", 2);
