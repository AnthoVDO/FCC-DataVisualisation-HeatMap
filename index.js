/*---------------------------Init---------------------------*/

const CHART__WIDTH = 900;
const CHART__HEIGHT = 500;
const CHART__URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const MARGIN = {
    top: 125,
    right: 50,
    bottom: 100,
    left: 100,
}
const COLOR = {
    veryCold: "#30546B",
    cold: "#4D87AB",
    cool: "#EBCA78",
    warm: "#EB554E",
    hot: "#6B2723"
}

/*---------------------------Function API---------------------------*/

//Call API

const globalTempData = async(URL) => {
    const fetchData = await fetch(URL);
    const response = await fetchData.json();

    const chartContainer = d3.select(".chart__container").append("svg");

    //init

    const minYear = d3.min(response.monthlyVariance.map(e => e.year));
    const maxYear = d3.max(response.monthlyVariance.map(e => e.year));

    const minMonth = 1;
    const maxMonth = 12;

    const xScale = d3.scaleLinear().domain([minYear, maxYear]).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScale = d3.scaleLinear().domain([1, 12]).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);

    const xScaleData = d3.scaleBand().domain(response.monthlyVariance.map(e => e.year)).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScaleData = d3.scaleBand().domain(response.monthlyVariance.map(e => e.month)).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top])

    //create svg

    chartContainer
        .attr("width", CHART__WIDTH)
        .attr("height", CHART__HEIGHT)
        .style("background-color", "#3393E2");

    //create title

    const title = chartContainer.append("text");

    title.attr("x", CHART__WIDTH / 2)
        .attr("text-anchor", "middle")
        .attr("y", MARGIN.top / 3)
        .text("Monthly Global Land-Surface Temperature")
        .attr("id", "title")

    //creat description

    const description = chartContainer.append("text")

    description.attr("x", CHART__WIDTH / 2)
        .attr("text-anchor", "middle")
        .attr("y", MARGIN.top / 2)
        .attr("id", "description")
        .text("Monthly temperature on earth's surface between 1753 and 2015 with a base of 8.66°C");

    //create x-axis

    const abscissa = d3.axisBottom().scale(xScale);
    chartContainer.append("g")
        .call(abscissa)
        .attr("transform", `translate(0,${CHART__HEIGHT-MARGIN.bottom})`)
        .attr("id", "x-axis");

    //create y-axis

    const ordinate = d3.axisLeft().scale(yScale);
    chartContainer.append("g")
        .call(ordinate)
        .attr("transform", `translate(${MARGIN.left})`)
        .attr("id", "y-axis");

    //create chart

    const chart = chartContainer.append("g");

    chart.selectAll(".cell")
        .data(response.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => xScaleData(d.year))
        .attr("y", d => yScaleData(d.month))
        .attr("width", xScaleData.bandwidth())
        .attr("height", yScaleData.bandwidth())
        .attr("data-month", d => d.month)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .attr("fill", d => {
            const temp = d.variance;
            if (temp > -1 && temp < 1) {
                return COLOR.cool;
            } else if (temp > -3 && temp <= -1) {
                return COLOR.cold;
            } else if (temp <= -3) {
                return COLOR.veryCold;
            } else if (temp >= 1 && temp < 3) {
                return COLOR.warm;
            } else if (temp >= 3) {
                return COLOR.hot;
            }
        })

    //create legend

    //create tooltip







    console.log(response);
}

globalTempData(CHART__URL);