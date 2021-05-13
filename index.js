/*---------------------------Init---------------------------*/

const CHART__WIDTH = 1200;
const CHART__HEIGHT = 600;
const CHART__URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const MARGIN = {
    top: 125,
    right: 50,
    bottom: 150,
    left: 120,
}
const COLOR = {
    veryCold: "#30546B",
    cold: "#4D87AB",
    cool: "#A3D2FA",
    sweet: "#D3E8F9",
    normal: "#F4EBDA",
    above: "#EBCA78",
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
    const monthForScale = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const xScale = d3.scaleBand().domain(response.monthlyVariance.map(e => e.year)).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScale = d3.scaleBand().domain(response.monthlyVariance.map(e => e.month)).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);

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
        .style("font-size", "25px")
        .style("text-decoration", "underline")

    //creat description

    const description = chartContainer.append("text")

    description.attr("x", CHART__WIDTH / 2)
        .attr("text-anchor", "middle")
        .attr("y", MARGIN.top / 3 * 2)
        .attr("id", "description")
        .text("Monthly temperature on earth's surface between 1753 and 2015 with a base of 8.66°C");

    //create x-axis

    const abscissa = d3.axisBottom().scale(xScale).tickValues(xScale.domain().filter((d, i) => {

        return (d % 10 == 0)

    }));
    const xAxis = chartContainer.append("g")
        .call(abscissa)
        .attr("transform", `translate(0,${CHART__HEIGHT-MARGIN.bottom})`)
        .attr("id", "x-axis");

    xAxis.selectAll("text")
        .attr("dy", 15)
        .attr("dx", 10)
        .attr("transform", "rotate(30)")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("text-shadow", "1px 1px 2px #E6E6E6")

    //xAxis scale name

    chartContainer.append("text")
        .attr("x", CHART__WIDTH / 8 * 7)
        .attr("y", CHART__HEIGHT - MARGIN.bottom / 12 * 7)
        .text("Years")

    //create y-axis

    const ordinate = d3.axisLeft().scale(yScale).tickFormat((d) => {
        return monthForScale[d - 1]
    });
    const yAxis = chartContainer.append("g")
        .call(ordinate)
        .attr("transform", `translate(${MARGIN.left})`)
        .attr("id", "y-axis");

    yAxis.selectAll("text")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("text-shadow", "1px 1px 2px #E6E6E6")

    //yAxis scale name

    chartContainer.append("text")
        .attr("x", -CHART__HEIGHT / 2)
        .attr("y", MARGIN.left / 3)
        .text("Months")
        .style("transform", "rotate(-90deg)")

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
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .attr("fill", d => {
            const temp = d.variance;
            if (temp > -1 && temp <= 0) {
                return COLOR.sweet;
            } else if (temp > -3 && temp <= -2) {
                return COLOR.cold;
            } else if (temp <= -3) {
                return COLOR.veryCold;
            } else if (temp >= 2 && temp < 3) {
                return COLOR.warm;
            } else if (temp >= 3) {
                return COLOR.hot;
            } else if (temp > -2 && temp <= -1) {
                return COLOR.cool
            } else if (temp >= 1 && temp < 2) {
                return COLOR.above
            } else if (temp > 0 && temp < 1) {
                return COLOR.normal
            }
        })

    //create tooltip

    const tooltip = d3.select(".chart__container").append("div");

    tooltip.attr("id", "tooltip")
        .style("background", "#25A0CD")
        .attr("data-year", 0)
        .style("opacity", "0")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("border-radius", "5px")

    chart.selectAll(".cell").on("mouseover", (e) => {

        let cell = e.currentTarget.dataset;
        let variation = 8.66 + parseFloat(cell.temp);
        console.log(e.pageX - e.offsetX)
        const diffX = e.pageX - e.offsetX
        const diffY = e.pageY - e.offsetY
        const toolBoxCenter = tooltip.style("width");
        console.log(toolBoxCenter)


        tooltip.style("opacity", "1")
            .attr("data-year", cell.year)
            .attr("data-month", cell.month)
            .style("top", (e.clientY - diffY + 50) + "px")
            .style("left", (e.clientX - diffX - 84) + "px")
            .html(`Month: ${monthForScale[cell.month-1]} <br> Year: ${cell.year} <br> Variance: ${cell.temp}°C <br> Temperature: ${variation.toFixed(3)}°C`)
    })

    chart.selectAll(".cell").on("mouseout", (e) => {
        tooltip.style("opacity", "0");
    })

    //create legend

    const heatLegend = [-4, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 4]
    const heatLegendText = [4.66, 5.66,
        6.66,
        7.66,
        9.66,
        8.66,
        10.66,
        11.66,
        12.66
    ]
    const xLegendMin = CHART__WIDTH / 4;
    const xLegendMax = (CHART__WIDTH / 4) * 3;
    const yLegendMin = CHART__HEIGHT - (MARGIN.bottom / 2);
    const yLegendMax = CHART__HEIGHT - (MARGIN.bottom / 2) + 100;

    const xLegendScale = d3.scaleBand().domain(heatLegend.map(x => x)).range([xLegendMin, xLegendMax]);
    const yLegendScale = d3.scaleBand().domain([0, 1]).range([yLegendMin, yLegendMax]);
    const xLegendScaleAxis = d3.scaleLinear().domain([4.66, 12.66]).range([xLegendMin, xLegendMax]);

    const legend = chartContainer.append("g").attr("id", "legend");

    legend.selectAll(".legend_cell")
        .data(heatLegend)
        .enter()
        .append("rect")
        .attr('class', "legend_cell")
        .attr("x", d => xLegendScale(d))
        .attr("y", 1)
        .attr("width", xLegendScale.bandwidth())
        .attr("height", yLegendScale.bandwidth())
        .attr("fill", d => {
            const temp = d
            if (temp > -1 && temp <= 0) {
                return COLOR.sweet;
            } else if (temp > -3 && temp <= -2) {
                return COLOR.cold;
            } else if (temp <= -3) {
                return COLOR.veryCold;
            } else if (temp >= 2 && temp < 3) {
                return COLOR.warm;
            } else if (temp >= 3) {
                return COLOR.hot;
            } else if (temp > -2 && temp <= -1) {
                return COLOR.cool
            } else if (temp >= 1 && temp < 2) {
                return COLOR.above
            } else if (temp > 0 && temp < 1) {
                return COLOR.normal
            }
        })
        .attr("transform", `translate(0, ${CHART__HEIGHT-MARGIN.bottom/2} )`)
    const legendAxis = d3.axisBottom()
        .scale(xLegendScaleAxis)
        .ticks(8)
        .tickValues(heatLegendText)
        .tickFormat(d3.format(".2f"))
    const xScaleLegendAxis = chartContainer.append("g").call(legendAxis);
    xScaleLegendAxis.attr("transform", `translate(0, ${CHART__HEIGHT-MARGIN.bottom/2} )`)
    xScaleLegendAxis.selectAll("text")
        .attr("dy", 22)
        .style("font-size", "13px")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "bold")
        .style("text-shadow", (e) => {
            if (e < "7" || e > 10) {
                return "1px 1px 2px #535354"
            } else {
                return "1px 1px 2px #F3F3F3"
            }
        })
        .style("color", (e) => {
            if (e < "7" || e > 10) {
                return "#F3F3F3"
            } else {
                return "#535354"
            }
        })







    console.log(response);
}

globalTempData(CHART__URL);