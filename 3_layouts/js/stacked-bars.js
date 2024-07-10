const drawStackedBars = (data) => {

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3.select("#bars")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create the stack generator 
  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id));

  // Annotate the data with the stack generator
  const annotatedData = stackGenerator(data);

  // Define the scales
  const maxUpperBoundary = d3.max(annotatedData[annotatedData.length - 1], d => d[1]);
  const yScale = d3.scaleLinear()
    .domain([0, maxUpperBoundary])
    .range([innerHeight, 0])
    .nice();

  console.log(annotatedData);
  // Make the x-axis
  annotatedData.forEach(series => {
    innerChart
      .selectAll(`.bar-${series.key}`)
      .data(series)
      .join("rect")
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("fill", colorScale(series.key));
  });

  const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0);

  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
    .call(leftAxis);
  
};