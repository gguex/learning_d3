const drawPyramid = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 30, bottom: 40, left: 60};
  const width = 555;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#pyramid")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Make the bins
  const binGenerator = d3.bin()
    .value(d => d.salary);
  const bins = binGenerator(data);

  // Compute percentages
  const totalMale = d3.sum(bins, bin => d3.sum(bin, d => d.gender=="Male"));
  const totalFemale = d3.sum(bins, bin => d3.sum(bin, d => d.gender=="Female"));
  bins.forEach(bin => {
    bin.percentageMale = d3.sum(bin, d => d.gender=="Male") / totalMale * 100;
    bin.percentageFemale = d3.sum(bin, d => d.gender=="Female") / totalFemale * 100;
  });

  console.log(bins);
  console.log(totalMale);

  // Define x scales
  const maxPercentage = d3.max(bins, bin => d3.max([bin.percentageMale, bin.percentageFemale]));
  const xScaleFemale = d3.scaleLinear()
    .domain([0, maxPercentage])
    .range([innerWidth / 2, 0])
    .nice();
  const xScaleMale = d3.scaleLinear()
    .domain([0, maxPercentage])
    .range([innerWidth / 2, innerWidth])
    .nice();

  // Define y scale
  const minSalary = bins[0].x0;
  const maxSalary = bins[bins.length - 1].x1;
  const yScale = d3.scaleLinear()
    .domain([minSalary, maxSalary])
    .range([innerHeight, 0])
    .nice();

  // Draw the bars for men
  innerChart
    .append("g")
      .selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", xScaleMale(0))
        .attr("y", d => yScale(d.x1))
        .attr("height", d => yScale(d.x0) - yScale(d.x1))
        .attr("width", d => xScaleMale(d.percentageMale) - xScaleMale(0))
        .attr("fill", menColor)
        .attr("stroke", white)
        .attr("stroke-width", 2);

  // Draw the bars for women
  innerChart
    .append("g")
    .selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => xScaleFemale(d.percentageFemale))
    .attr("y", d => yScale(d.x1))
    .attr("height", d => yScale(d.x0) - yScale(d.x1))
    .attr("width", d => xScaleFemale(0) - xScaleFemale(d.percentageFemale))
    .attr("fill", womenColor)
    .attr("stroke", white)
    .attr("stroke-width", 2);

  // Add x axis
  const bottomAxisFemale = d3.axisBottom(xScaleFemale)
    .ticks(5);
  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxisFemale);
  const bottomAxisMale = d3.axisBottom(xScaleMale)
    .ticks(5);
  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxisMale);
  svg
    .append("text")
      .text("Percent")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2 + margin.left)
      .attr("y", height - 5);

  // Add y axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
    .call(leftAxis);
  svg
    .append("text")
    .text("Yearly salary (USD)")
    .attr("x", 5)
    .attr("y", 20);

  
};