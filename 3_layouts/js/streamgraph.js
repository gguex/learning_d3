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
  
  const stackGenerator = d3.stack()
    .keys(formatsInfo.map(f => f.id));
  const annotatedData = stackGenerator(data);

  console.log(annotatedData);

};