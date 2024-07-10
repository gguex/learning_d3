// Load data
d3.csv("/3_layouts/data/data.csv", d3.autoType).then(data => {
  defineScales(data);
  drawDonutCharts(data);
  drawStackedBars(data);
  drawStreamGraph(data);
  addLegend();
});