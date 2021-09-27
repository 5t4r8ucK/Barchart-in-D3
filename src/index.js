import axios from "axios";
import * as d3 from "d3";

document.addEventListener("DOMContentLoaded", () => {
  const convertRemToPixels = (rem) =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

  const width = convertRemToPixels(48); // 50 - 2
  const height = convertRemToPixels(38); // 40 - 2
  const padding = convertRemToPixels(1);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  axios.get(url).then((response) => {
    const dataset = response.data.data;

    console.log(dataset);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 4) // bar offset
      .attr("y", (d, i) => height - d[1]) // invert bars
      .attr("width", 2) // width of a bar
      .attr("height", (d, i) => d[1])
      .attr("fill", "navy")
      .attr("class", "bar");
  });
});
