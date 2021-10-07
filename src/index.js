import axios from "axios";
import * as d3 from "d3";

document.addEventListener("DOMContentLoaded", () => {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  axios.get(url).then((response) => {
    const convertRemToPixels = (rem) =>
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    // SVG Variables
    const chart = document.querySelector("#chart");
    const chartWidth = chart.offsetWidth;
    const chartHeight = chart.offsetHeight;
    const padding = convertRemToPixels(4); // padding for the axes
    // const barColor = "#41A6A6";
    // const hoverColor = "#5ff3f3";
    let tooltip;
    let currentBar;
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    // Data Variables
    const dataset = response.data.data;
    const gdp = dataset.map((item) => item[1]);
    const date = dataset.map((item) => new Date(item[0]));
    const minGdp = 0;
    const maxGdp = d3.max(gdp);
    const minDate = d3.min(date);
    const maxDate = d3.max(date);
    const barWidth = chartWidth / gdp.length;

    // Scales
    const scaleGdp = d3
      .scaleLinear()
      .domain([minGdp, maxGdp])
      .range([padding, chartHeight - padding]);
    const scaleDate = d3
      .scaleTime() // use scaleTime for Date objects
      .domain([minDate, maxDate])
      .range([padding, chartWidth - padding]);
    const yScale = d3
      .scaleLinear()
      .domain([minGdp, maxGdp])
      .range([chartHeight - padding, padding]); // inverts the scale
    const xScale = d3
      .scaleTime() // use scaleTime for axes that use time
      .domain([minDate, maxDate])
      .range([padding, chartWidth - padding]);

    // Axes
    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis)
      .selectAll(".tick text")
      .attr("font-family", "Abel")
      .attr("font-size", `${convertRemToPixels(1)}`);
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${chartHeight - padding})`)
      .call(xAxis)
      .selectAll(".tick text")
      .attr("font-family", "Abel")
      .attr("font-size", `${convertRemToPixels(1)}`);

    // Axes Labels
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${chartWidth / 2}, ${chartHeight - padding / 3})`
      )
      .style("text-anchor", "middle")
      .attr("fill", "black")
      .text("Years (1947 - 2015)");
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${padding / 5}, ${chartHeight / 2}) rotate(-90)`
      )
      .style("text-anchor", "middle")
      .attr("fill", "black")
      .text("GDP ($ Billions)");

    // Bar Chart
    svg
      // Bars
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("data-date", (data, index) => data[0])
      .attr("data-gdp", (data, index) => data[1])
      .attr("x", (data, index) => scaleDate(date[index])) // horizontal offset of each bar
      .attr("y", (data, index) => chartHeight - scaleGdp(gdp[index])) // vertical offset of each bar/invert bar
      .attr("width", barWidth) // width of each bar
      .attr("height", (data, index) => scaleGdp(data[1]) - padding) // height of each bar
      //.style("fill", `${barColor}`)
      .attr("class", "bar")
      // Tooltip
      .attr(
        "tooltip",
        (data) =>
          `<strong>Year: </strong>
          ${new Date(data[0]).getFullYear()}
          Q${new Date(data[0]).getMonth() / 3 + 1}
          <br/>
          <strong>GDP: </strong>
          ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data[1])} Billion`
      )
      // Events
      .on("mouseover", function () {
        currentBar = d3.select(this); //.style("fill", `${hoverColor}`);
        tooltip = d3
          .select("#chart")
          .append("div")
          .attr("id", "tooltip")
          .attr("data-date", currentBar.attr("data-date"))
          .style("left", currentBar.attr("x") * 1 + 3) // multiply by 1 to get px
          .style("top", chartHeight / 1.5)
          .html(currentBar.attr("tooltip"));
      })
      .on("mouseout", () => {
        //currentBar.style("fill", `${barColor}`);
        tooltip.remove();
      });

    // Header
    const header = document.querySelector("#title");
    const title = document.createElement("H1");
    const titleText = document.createTextNode("United States GDP");
    header.appendChild(title).appendChild(titleText);

    // Footer
    const footer = document.querySelector("#footer");
    const footnote = document.createElement("A");
    footnote.href = "http://www.bea.gov/national/pdf/nipaguid.pdf";
    const footnoteText = document.createTextNode(
      "http://www.bea.gov/national/pdf/nipaguid.pdf"
    );
    footer.appendChild(footnote).appendChild(footnoteText);
  });
});
