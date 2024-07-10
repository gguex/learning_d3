// Load the data here
d3.csv("/2_line/data/daily_precipitations.csv", d3.autoType)
.then(data => {
  console.log("precipitation data", data);
  drawArc(data);
});


// Draw the arc here
const drawArc = (data) => {

  // ------ Create the drawing area ------- //

  const pieChartWidth = 300;
  const pieChartHeight = 300;
  const svg = d3.select("#arc")
    .append("svg")
      .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight]);

  // ------ Create the arc chart ------- //

  // Make the pie chart in the center of the svg
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${pieChartWidth/2}, ${pieChartHeight/2})`);

  // Compute the proportion of days with precipitation
  const numberOfDays = data.length;
  const numberOfDaysWithPrecipitation = data.filter(d => 
    d.total_precip_in > 0).length;
  const percentageDaysWithPrecipitation =
    Math.round(numberOfDaysWithPrecipitation / numberOfDays * 100);
  const angleDaysWithPrecipitation = percentageDaysWithPrecipitation / 100 *
    2 * Math.PI;

  // Create the pie generator
  const arcGenerator = d3.arc()
    .innerRadius(80)
    .outerRadius(120)
    .padAngle(0.02)
    .cornerRadius(6);
  
  // Create the raining arc
  innerChart
    .append("path")
      .attr("d", arcGenerator({
        startAngle: 0,
        endAngle: angleDaysWithPrecipitation
      }))
      .attr("fill", "#6EB7C2");
  // Create the non-raining arc
  innerChart
    .append("path")
      .attr("d", arcGenerator({
        startAngle: angleDaysWithPrecipitation,
        endAngle: 2 * Math.PI
      }))
      .attr("fill", "#DCE2E2");

  // Add the label for raining days
  const centroid = arcGenerator
    .startAngle(0)
    .endAngle(angleDaysWithPrecipitation)
    .centroid();
  innerChart
    .append("text")
      .text(d => d3.format(".0%")(percentageDaysWithPrecipitation / 100))
      .attr("x", centroid[0])
      .attr("y", centroid[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", 500);
};