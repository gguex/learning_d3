// Load the data here
d3.csv("/2_curve/data/weekly_temperature.csv", d3.autoType)
  .then(data => {
    console.log("temperature data", data);
  });

// Create the line chart here
const drawLineChart = (data) => {

};