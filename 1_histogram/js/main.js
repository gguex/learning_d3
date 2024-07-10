// Create a responsive bar chart with D3.js
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 600 700");

// Load the data
d3.csv("/1_histogram/data/data.csv", d => {
  return {
    technology: d.technology,
    count: +d.count
  };
}).then(data => { 
  data.sort((a, b) => b.count - a.count);
  creatViz(data);
});

// Create the visualization
function creatViz(data) {

  // Create the scales
  const xScale = d3.scaleLinear()
    .domain([0, 1078])
    .range([0, 450]);
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.technology))
    .range([0, 700])
    .paddingInner(0.2);

  // Create the bars and labels groups
  const barAndLabel = svg 
    .selectAll("g") 
    .data(data) 
    .join("g")
      .attr("transform", d => `translate(0, ${yScale(d.technology)})`);

  // Create the bars
  barAndLabel
    .append("rect")
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("x", 100)
      .attr("y", 0)
      .attr("fill", "skyblue")
      .attr("fill", d => d.technology === "D3.js" ? "yellowgreen" : "skyblue");

  // Create the labels
  barAndLabel .append("text")
    .text(d => d.technology)
    .attr("x", 96)
    .attr("y", 12)
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "11px");

  // Create the count labels
  barAndLabel .append("text")
    .text(d => d.count)
      .attr("x", d => 100 + xScale(d.count) + 4)
      .attr("y", 12)
      .style("font-family", "sans-serif")
      .style("font-size", "9px");

  // Create the x-axis
  svg
    .append("line")
      .attr("x1", 100)
      .attr("y1", 0)
      .attr("x2", 100)
      .attr("y2", 700)
      .attr("stroke", "black");
}