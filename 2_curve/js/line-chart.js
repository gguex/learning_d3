// Load the data here
d3.csv("/2_curve/data/weekly_temperature.csv", d => {
  return {
    date: new Date(d.date),
    avg_temp_C: (d.avg_temp_F - 32)*5/9,
    max_temp_C: (d.max_temp_F - 32)*5/9,
    min_temp_C: (d.min_temp_F - 32)*5/9
  };
}).then(data => {
  drawLineChart(data);
});

// Create the line chart here
const drawLineChart = (data) => {

  // Create the margins and the inner chart dimensions
  const margin = {top: 40, right: 170, bottom: 25, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create the svg element and the inner chart
  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create the x scale
  const firstDate = new Date(2021, 0o0, 0o1, 0, 0, 0);
  const lastDate = d3.max(data, d => d.date);
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // Create the y scale
  const maxTemp = d3.max(data, d => d.max_temp_C);
  const yScale = d3.scaleLinear()
    .domain([0, maxTemp])
    .range([innerHeight, 0]);

  // Create the buttom axis
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b"));
  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);
  d3.selectAll(".axis-x text")
    .attr("x", d => {
      const currentMonth = d;
      const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
      return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "10px");

  // Create the left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);

  // Style for all axis
  d3.selectAll(".axis path")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "14px");
  
  // Add labels to axis
  svg
    .append("text")
    .text("Temperature (°C)")
    .attr("y", 20);

};