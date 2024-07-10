const drawDonutCharts = (data) => {
  
  // Make the container for donut charts
  const svg = d3.select("#donut")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);
  const donutContainers = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // The years for the dunut charts
  const years = [1975, 1995, 2013];
  // The categories for the donut charts
  const formats = data.columns.filter(format =>
    format !== "year");

  // Loop through the years
  years.forEach(year => {

    // Filter the data for the year
    const yearData = data.find(d => d.year === year);

    // Format the data for the donut chart
    const formattedData = [];
    formats.forEach(format => {
      formattedData.push({
        format: format,
        sales: yearData[format]
      });
    });
    
    // Annotate the data with pie generator
    const pieGenerator = d3.pie()
      .value(d => d.sales);
    const annotatedData = pieGenerator(formattedData);

    console.log(annotatedData);

    // Make the container for the dunut chart, and translate it
    const donutContainer = donutContainers
      .append("g")
      .attr("transform", `translate(${xScale(year)}, ${innerHeight/2})`);

    // Make the arc generator
    const arcGenerator = d3.arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(60)
      .outerRadius(100)
      .padAngle(0.02)
      .cornerRadius(5);

    // Make the arcs
    const arcs = donutContainer
      .selectAll(`.arc-${year}`)
      .data(annotatedData)
      .join("g")
        .attr("class", d => `arc-${year}`);
    arcs
      .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colorScale(d.data.format));

    // Add the labels
    arcs
      .append("text")
        .text(d => {
          d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI);
          return d3.format(".0%")(d.percentage);
        })
        .attr("x", d => {
          d["centroid"] = arcGenerator
            .startAngle(d.startAngle)
            .endAngle(d.endAngle)
            .centroid();
          return d.centroid[0];
        })
        .attr("y", d => d.centroid[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#f6fafc")
        .attr("fill-opacity", d => d.percentage < 0.05 ? 0 : 1)
        .style("font-size", "16px")
        .style("font-weight", 500);
    
    // Add the year in the center
    donutContainer
      .append("text")
        .text(year)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "24px")
        .style("font-weight", 500);
        
  });

};