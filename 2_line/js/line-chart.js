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

  // ------ Create the drawing area ------- //

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

  // ------ Create scales and axes ------- //

  // Create the x scale
  const firstDate = new Date(2021, 0o0, 0o1, 0, 0, 0);
  const lastDate = d3.max(data, d => d.date);
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // Create the y scale
  const maxTemp = d3.max(data, d => d.max_temp_C);
  const minTemp = d3.min(data, d => d.min_temp_C);
  const yScale = d3.scaleLinear()
    .domain([minTemp, maxTemp])
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

  // ------ Create the drawings ------- //

  // Color for the chart
  const aubergine = "#75485E";

  // Create the area
  const areaGenerator = d3.area()
    .x(d => xScale(d.date))
    .y0(d => yScale(d.min_temp_C))
    .y1(d => yScale(d.max_temp_C))
    .curve(d3.curveCatmullRom);
  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", aubergine)
      .attr("fill-opacity", 0.2);
  
  // Create the circles
  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.avg_temp_C))
      .attr("fill", aubergine);

  // Create the lines
  const lineGenerator = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.avg_temp_C))
    .curve(d3.curveCatmullRom);
  innerChart
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", aubergine);

  // Label for the line
  innerChart
    .append("text")
      .text("Average temperature")
      .attr("x", xScale(lastDate) + 10)
      .attr("y", yScale(data[data.length - 1].avg_temp_C))
      .attr("dominant-baseline", "middle")
      .attr("fill", aubergine);

  // Label for the lowest temperature
  innerChart
    .append("text")
      .text("Minimum temperature")
      .attr("x", xScale(data[data.length - 3].date) + 13)
      .attr("y", yScale(data[data.length - 3].min_temp_C) + 20)
      .attr("alignment-baseline", "hanging")
      .attr("fill", aubergine);
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 3].date))
      .attr("y1", yScale(data[data.length - 3].min_temp_C) + 3)
      .attr("x2", xScale(data[data.length - 3].date) + 10)
      .attr("y2", yScale(data[data.length - 3].min_temp_C) + 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);

  // Label for the highest temperature
  innerChart
    .append("text")
      .text("Maximum temperature")
      .attr("x", xScale(data[data.length - 4].date) + 13)
      .attr("y", yScale(data[data.length - 4].max_temp_C) - 20)
      .attr("fill", aubergine);
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 4].date))
      .attr("y1", yScale(data[data.length - 4].max_temp_C) - 3)
      .attr("x2", xScale(data[data.length - 4].date) + 10)
      .attr("y2", yScale(data[data.length - 4].max_temp_C) - 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);


  
};