// Ridgeline chart based on https://d3-graph-gallery.com/ridgeline.html

// set the dimensions and margins of the graph
var margin = { top: 60, right: 30, bottom: 20, left: 110 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#ridgeline")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

categories = [
  "Almost Certainly",
  "Highly Likely",
  "Very Good Chance",
  "Probable",
  "Likely",
];

data = data = [
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 70,
    Probable: 59,
    Likely: 10,
  },
  {
    "Almost Certainly": 80,
    "Highly Likely": 56,
    "Very Good Chance": 30,
    Probable: 52,
    Likely: 13,
  },
  {
    "Almost Certainly": 97,
    "Highly Likely": 90,
    "Very Good Chance": 76,
    Probable: 59,
    Likely: 34,
  },
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 70,
    Probable: 59,
    Likely: 10,
  },
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 7,
    Probable: 59,
    Likely: 10,
  },
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 70,
    Probable: 59,
    Likely: 10,
  },
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 70,
    Probable: 59,
    Likely: 3,
  },
  {
    "Almost Certainly": 95,
    "Highly Likely": 80,
    "Very Good Chance": 70,
    Probable: 59,
    Likely: 10,
  },
];

n = data.length;

var x = d3.scaleLinear().domain([-10, 140]).range([0, width]);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Create a Y scale for densities
var y = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);

// Create the Y axis for names
var yName = d3
  .scaleBand()
  .domain(categories)
  .range([0, height])
  .paddingInner(1);
svg.append("g").call(d3.axisLeft(yName));

// Compute kernel density estimation for each column:
var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // increase this 40 for more accurate density.
var allDensity = [];
for (i = 0; i < n; i++) {
  key = categories[i];
  density = kde(
    data.map(function (d) {
      return d[key];
    })
  );
  allDensity.push({ key: key, density: density });
}

// Add areas
svg
  .selectAll("areas")
  .data(allDensity)
  .enter()
  .append("path")
  .attr("transform", function (d) {
    return "translate(0," + (yName(d.key) - height) + ")";
  })
  .datum(function (d) {
    return d.density;
  })
  .attr("fill", "#69b3a2")
  .attr("stroke", "#000")
  .attr("stroke-width", 1)
  .attr(
    "d",
    d3
      .line()
      .curve(d3.curveBasis)
      .x(function (d) {
        return x(d[0]);
      })
      .y(function (d) {
        return y(d[1]);
      })
  );

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
