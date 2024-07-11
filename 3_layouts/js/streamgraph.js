const drawStreamGraph = (data) => {
  // Generate the stacked bar chart here

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3.select("#streamgraph")
  .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Create the stack generator 
  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    .offset(d3.stackOffsetSilhouette);

  // Annotate the data with the stack generator
  const annotatedData = stackGenerator(data);

  // Define the y scale
  const maxUpperBoundary = d3.max(annotatedData, d => d3.max(d, d => d[1]));
  const minLowerBoundary = d3.min(annotatedData, d => d3.min(d, d => d[0]));
  const yScale = d3.scaleLinear()
    .domain([minLowerBoundary, maxUpperBoundary])
    .range([innerHeight, 0])
    .nice();
  
  // Create the area generator
  const areaGenerator = d3.area()
    .x(d => xScale(d.data.year) + xScale.bandwidth() / 2)
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom);

  // Make the x axis
  const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0)
    .tickSize(innerHeight * -1);
  innerChart
    .append("g")
    .attr("class", "x-axis-streamgraph")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  // Make the stack of areas
  innerChart
    .append("g")
      .attr("class", "areas-container")
    .selectAll("path")
      .data(annotatedData)
      .join("path")
      .attr("d", areaGenerator)
      .attr("fill", d => colorScale(d.key));

  // Make the y axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
    .attr("class", "y-axis-streamgraph")
    .call(leftAxis);
    
  // Correct the negative value on the y scale
  innerChart
    .selectAll(".y-axis-streamgraph .tick text")
      .text(d => Math.abs(d));

  // Make the label
  const leftAxisLabel = svg
    .append("text")
    .attr("dominant-baseline", "hanging");
  leftAxisLabel
    .append("tspan")
    .text("Total revenue");
  leftAxisLabel
    .append("tspan")
    .text("(million USD)")
    .attr("dx", 5)
    .attr("fill-opacity", 0.7);
  leftAxisLabel
    .append("tspan")
    .text("Adjusted for inflation")
    .attr("x", 0)
    .attr("dy", 20)
    .attr("fill-opacity", 0.7)
    .style("font-size", "14px");

};