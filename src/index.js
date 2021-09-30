import axios from "axios";
import * as d3 from "d3";

document.addEventListener("DOMContentLoaded", () => {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  axios.get(url).then((response) => {
    const convertRemToPixels = (rem) =>
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Chart properties
    const chart = document.querySelector("#chart");
    const cssWidth = chart.offsetWidth;
    const cssHeight = chart.offsetHeight;

    // Specs of the SVG canvas
    const width = cssWidth;
    const height = cssHeight;
    const padding = convertRemToPixels(3); // padding for the axes
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Data Variables
    const dataset = response.data.data;
    const gdp = dataset.map((gdp) => gdp[1]);
    const date = dataset.map((date) => new Date(date[0]));
    const minGdp = 0;
    const maxGdp = d3.max(gdp);
    const minDate = d3.min(date);
    const maxDate = d3.max(date);
    const barWidth = width / gdp.length;

    console.log(minDate);

    // Scales
    const scaleGdp = d3
      .scaleLinear()
      .domain([minGdp, maxGdp])
      .range([padding, height - padding]);

    const scaleDate = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([minGdp, maxGdp])
      .range([height - padding, padding]);

    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([padding, width - padding]);

    // Axes
    const yAxis = d3.axisLeft(yScale);
    svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);

    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    // Bar Chart
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => padding + i * 3) // bar horizontal offset
      .attr("y", (d, i) => height - scaleGdp(d[1])) // bar vertical offset/invert bar
      .attr("width", barWidth) // width of each bar
      .attr("height", (d, i) => scaleGdp(d[1]) - padding) // height of each bar
      .attr("fill", "navy")
      .attr("class", "bar");
  });
});
