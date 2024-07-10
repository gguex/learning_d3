const drawStackedBars = (data) => {
// Create the stack generator 
const stackGenerator = d3.stack()
  .keys(formatsInfo.map(f => f.id));

// Annotate the data with the stack generator
const annotatedData = stackGenerator(data);
  

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3.select("#bars")
  .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
};