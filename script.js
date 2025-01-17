// annotations for Average World GDP per Capita over time
const GDPannotations = [
    {
        note: {
            label: "The Gulf of Tonkin Incident catapults US Involvement in the Vietnam War",
            title: "1964"
        },
        x: 70,
        y: 400,
        dy: -180,
        dx: -1
    },
    {
        note: {
            label: "Bretton Woods System Collapse: U.S. end gold standard",
            title: "1971"
        },
        x: 200,
        y: 400,
        dy: -50,
        dx: -5
    },
    {
        note: {
            label: "1973 Oil Crisis: OPEC oil embargo leads to skyrocketing oil prices and inflation",
            title: "1973"
        },
        x: 230,
        y: 400,
        dy: -200,
        dx: -2
    },
    {
        note: {
            label: "Early 1980s Recession: Tight monetary policies to combat inflation leads to one of most sever economic downturns since Great Depression",
            title: "1981-1982"
        },
        x: 400,
        y: 400,
        dy: -150,
        dx: -30,
        color: "red"
    },
    {
        note: {
            label: "Black Monday: Global stock market crash",
            title: "1987"
        },
        x: 490,
        y: 400,
        dy: -150,
        dx: -1
    },
    {
        note: {
            label: "Gulf War",
            title: "1990 - 1991"
        },
        x: 555,
        y: 400,
        dy: -20,
        dx: 4
    },
    {
        note: {
            label: "Invention and Deployment of the World Wide Web",
            title: "1990-1991"
        },
        x: 555,
        y: 400,
        dy: -250,
        dx: 0,
        color: "green"
    },
    {
        note: {
            label: "Asian Financial Crisis: Economic turbulence in Asia affects global markets",
            title: "1997-1998"
        },
        x: 690,
        y: 400,
        dy: -300,
        dx: 10
    },
    {
        note: {
            label: "Dot-com Bubble Bursts: Signifcant Stock market downturn",
            title: "2000"
        },
        x: 725,
        y: 400,
        dy: -50,
        dx: 0
    },
    {
        note: {
            label: "Global Financial Crisis: Collapse of Lehman Brothers leads to severe global economic recession",
            title: "2008"
        },
        x: 870,
        y: 400,
        dy: -120,
        dx: 0,
        color: "red"
    },
    {
        note: {
            label: "Significant volatility in global stock markets",
            title: "2018"
        },
        x: 1054,
        y: 400,
        dy: -365,
        dx: -1
    },

];

// Add annotation to Average world GDP per Capita over time
const makeGDPAnnotations = d3.annotation()
    .annotations(GDPannotations);

// Average World GDP per Capita Over Time Line Graph
d3.csv("Edited_GDP_per_capita_the_world_bank.csv").then(data => {
    const parseDate = d3.timeParse("%Y");
    data.forEach(d => {
        d.date = parseDate(d.Year);
        d.gdp = +d['GDP Per Capita'];
    });

    data = data.filter(d => d['Country Code'] === 'WLD');
    data = data.filter(d => !isNaN(d.gdp));

    const margin = { top: 70, right: 30, bottom: 40, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.gdp));

    const svg = d3.select("#svg1")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("background-color", "steelblue")
        .style("color", "white")
        .style("border", "1px solid white")
        .style("border-radius", "10px")
        .style("display", "none")
        .style("opacity", .75);

    x.domain([d3.min(data, d => d.date), new Date("2020-01-01")]);
    y.domain([0, d3.max(data, d => d.gdp)]);

    const startYear = new Date(d3.min(data, d => d.date).getFullYear(), 0, 1);
    const endYear = new Date(2020, 0, 1);
    const tickValues = d3.timeYears(startYear, endYear, 5);
    tickValues.push(endYear);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .style("font-size", "14px")
        .call(d3.axisBottom(x)
            .tickValues(tickValues)
            .tickFormat(d3.timeFormat("%Y")))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick line")
        .style("stroke-opacity", 0);
    svg.selectAll(".tick text")
        .attr("fill", "#777");

    svg.selectAll("xGrid")
        .data(x.ticks().slice(1))
        .join("line")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5);

    svg.append("g")
        .style("font-size", "14px")
        .call(d3.axisLeft(y)
            .ticks(3)  // Adjust the number of ticks on y-axis
            .tickFormat(d => {
                if (isNaN(d)) return "";
                return `${(d / 1000).toFixed(0)}K`; // Format y-axis ticks as plain numbers
            })
            .tickSize(0)
            .tickPadding(10))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick text")
        .style("fill", "#777");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#777")
        .style("font-family", "sans-serif")
        .text("GDP Per Capita (current US$)");

    svg.selectAll("yGrid")
        .data(y.ticks(10).slice(1)) // Adjust the gridlines according to the y-axis ticks
        .join("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", .5);

    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .attr("d", line);

    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPos = x(d.date);
        const yPos = y(d.gdp);

        circle.attr("cx", xPos)
            .attr("cy", yPos);

        circle.transition()
            .duration(50)
            .attr("r", 5);

        tooltip
            .style("display", "block")
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 15}px`)
            .html(`<strong>Year:</strong> ${d.date.getFullYear()}<br><strong>GDP Per Capita:</strong> $${d.gdp !== undefined ? d.gdp.toFixed(0) : 'N/A'}`)
    });

    listeningRect.on("mouseleave", function () {
        circle.transition()
            .duration(50)
            .attr("r", 0);

        tooltip.style("display", "none");
    });

    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left - 115)
        .attr("y", margin.top - 100)
        .style("font-size", "24px")
        .style("font-family", "sans-serif")
        .text("GDP Per Capita Over Time");

    svg.append("text")
        .attr("class", "source-credit")
        .attr("x", width - 1125)
        .attr("y", height + margin.bottom - 3)
        .style("font-size", "9px")
        .style("font-family", "sans-serif")
        .text("Source: The World Bank");

    // Append annotations after the 1st line chart is rendered
    svg.append("g")
        .call(makeGDPAnnotations);

    // Append a vertical line at the year 1990
    svg.append("line")
        .attr("x1", x(new Date(1990, 0, 1)))
        .attr("x2", x(new Date(1990, 0, 1)))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "purple")
        .attr("stroke-dasharray", "4,4") // Dotted line
        .attr("stroke-width", 2); // Increased stroke width to make it bold

    // Append text over the vertical line
    svg.append("text")
        .attr("x", x(new Date(1990, 0, 1)))
        .attr("y", -10) // Adjust this value to position the text above the line
        .attr("text-anchor", "middle")
        .attr("fill", "purple")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("font-weight", "bold") // Added font weight to make the text bold
        .text("1990");

});




// GDP per Capita line graphs per Country 
d3.csv("Edited_GDP_per_capita_the_world_bank.csv").then(data => {
    const parseDate = d3.timeParse("%Y");
    data.forEach(d => {
        d.date = parseDate(d.Year);
        d.gdp = +d['GDP Per Capita'];
    });

    const dataByCountry = d3.group(data, d => d["Country Name"]);
    const countries = Array.from(dataByCountry.keys());

    const select1 = d3.select("#country-select1")
        .selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    const svg2 = d3.select("#svg2"),
        margin = { top: 20, right: 20, bottom: 30, left: 80 },
        width = +svg2.attr("width") - margin.left - margin.right,
        height = +svg2.attr("height") - margin.top - margin.bottom,
        g1 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x1 = d3.scaleTime().range([0, width]),
        y1 = d3.scaleLinear().range([height, 0]);

    const line1 = d3.line()
        .x(d => x1(d.date))
        .y(d => y1(d.gdp));

    const xAxis1 = d3.axisBottom(x1),
        yAxis1 = d3.axisLeft(y1);

    g1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    g1.append("g")
        .attr("class", "y axis");

    g1.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("GDP Per Capita (current US$)");

    const tooltip1 = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    function update1(country) {
        const countryData = dataByCountry.get(country);

        x1.domain([d3.min(countryData, d => d.date), new Date(2020, 0, 1)]);
        y1.domain([0, d3.max(countryData, d => d.gdp)]);

        g1.select(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis1);

        g1.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis1);

        const path1 = g1.selectAll(".line")
            .data([countryData]);

        path1.enter().append("path")
            .attr("class", "line")
            .merge(path1)
            .transition()
            .duration(1000)
            .attr("d", line1);

        path1.exit().remove();

        const dots1 = g1.selectAll(".dot")
            .data(countryData);

        dots1.enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .merge(dots1)
            .attr("cx", d => x1(d.date))
            .attr("cy", d => y1(d.gdp))
            .on("mouseover", function (event, d) {
                tooltip1.style("display", "block")
                    .html("Year: " + d.Year + "<br/>GDP Per Capita: $" + d.gdp.toFixed(2))
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip1.style("display", "none");
            });

        dots1.exit().remove();


        // Annotations for 1990
        const annotation1980sTextContent = "Effects of Early 1980s Recession";
        const annotation1980sYear = new Date(1982, 0, 1);

        const annotation1980sLine = g1.selectAll(".annotation-1980s-line")
            .data([annotation1980sYear]);

        annotation1980sLine.enter().append("line")
            .attr("class", "annotation-1980s-line")
            .merge(annotation1980sLine)
            .attr("x1", x1(annotation1980sYear))
            .attr("x2", x1(annotation1980sYear))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        annotation1980sLine.exit().remove();

        const annotation1980sText = g1.selectAll(".annotation-1980s-text")
            .data([annotation1980sYear]);

        annotation1980sText.enter().append("text")
            .attr("class", "annotation-1980s-text")
            .merge(annotation1980sText)
            .attr("x", x1(annotation1980sYear) - 210)
            .attr("y", -5)
            .style("fill", "red")
            .text(annotation1980sTextContent);

        annotation1980sText.exit().remove();


        // Annotations for 1990
        const annotation1990TextContent = "Line dividing pre-1990 and post-1990";
        const annotation1990Year = new Date(1990, 0, 1);

        const annotation1990Line = g1.selectAll(".annotation-1990-line")
            .data([annotation1990Year]);

        annotation1990Line.enter().append("line")
            .attr("class", "annotation-1990-line")
            .merge(annotation1990Line)
            .attr("x1", x1(annotation1990Year))
            .attr("x2", x1(annotation1990Year))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "purple")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        annotation1990Line.exit().remove();

        const annotation1990Text = g1.selectAll(".annotation-1990-text")
            .data([annotation1990Year]);

        annotation1990Text.enter().append("text")
            .attr("class", "annotation-1990-text")
            .merge(annotation1990Text)
            .attr("x", x1(annotation1990Year) - 70)
            .attr("y", -5)
            .style("fill", "purple")
            .text(annotation1990TextContent);

        annotation1990Text.exit().remove();


        // Annotations for 2009
        const annotation2009TextContent = "Effects of 2008 global recession";
        const annotation2009Year = new Date(2009, 0, 1);

        const annotation2009Line = g1.selectAll(".annotation-2009-line")
            .data([annotation2009Year]);

        annotation2009Line.enter().append("line")
            .attr("class", "annotation-2009-line")
            .merge(annotation2009Line)
            .attr("x1", x1(annotation2009Year))
            .attr("x2", x1(annotation2009Year))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        annotation2009Line.exit().remove();

        const annotation2009Text = g1.selectAll(".annotation-2009-text")
            .data([annotation2009Year]);

        annotation2009Text.enter().append("text")
            .attr("class", "annotation-2009-text")
            .merge(annotation2009Text)
            .attr("x", x1(annotation2009Year) - 50)
            .attr("y", -5)
            .style("fill", "red")
            .text(annotation2009TextContent);

        annotation2009Text.exit().remove();
    }

    update1(countries[0]);

    d3.select("#country-select1").on("change", function () {
        const selectedCountry = d3.select(this).property("value");
        update1(selectedCountry);
    });

});



// GDP Per Capita Choropleth Map
const width = 1000;
const height = 600;

// Define projection and path
const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

const svg3 = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip2 = d3.select("body").append("div")
    .attr("id", "tooltip2")
    .attr("class", "hidden")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid 1px #ccc")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none");

Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("Edited_GDP_per_capita_the_world_bank.csv")
]).then(([worldData, GDP_per_capita_data]) => {
    const countries = worldData.features;

    const topoCountryCodes = new Set(countries.map(d => d.id));

    const GDPByCountryYear = {};
    const csvCountryCodes = new Set();

    GDP_per_capita_data.forEach(d => {
        const country = d["Country Code"];
        const year = d.Year;
        const GDPperCap = +d["GDP Per Capita"];
        if (!GDPByCountryYear[country]) {
            GDPByCountryYear[country] = {};
        }
        GDPByCountryYear[country][year] = GDPperCap;
        csvCountryCodes.add(country);
    });

    const commonCountryCodes = new Set(
        [...topoCountryCodes].filter(code => csvCountryCodes.has(code))
    );

    console.log("Common Country Codes:", commonCountryCodes);

    const colorScale = d3.scaleLinear()
        .domain([0, 50000])
        .range(["#ffffff", "#00441b"]); // first: #e5f5e0

    function colorCountry(d) {
        if (!commonCountryCodes.has(d.id)) return "#ccc";
        const countryData = GDPByCountryYear[d.id];
        if (!countryData) return "#ccc";
        const year = d3.select("#yearSlider").property("value");
        const value = countryData[year];
        if (value == null) return "#ccc";
        return colorScale(value);
    }

    svg3.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", colorCountry)
        .attr("stroke", "#333")
        .on("mouseover", function (event, d) {
            if (!commonCountryCodes.has(d.id)) return;
            d3.select(this).attr("fill", "#ffcc00");
            tooltip2.classed("hidden", false);
        })
        .on("mousemove", function (event, d) {
            if (!commonCountryCodes.has(d.id)) return;
            const countryData = GDPByCountryYear[d.id];
            const year = d3.select("#yearSlider").property("value");
            const value = countryData ? countryData[year] : "No data";

            console.log("Hovered country data:", {
                name: d.properties.name,
                id: d.id,
                GDP_per_capita: value
            });

            tooltip2
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px")
                .html(`<strong>${d.properties.name}</strong><br>GDP per Capita: $${value}`);
        })
        .on("mouseout", function (event, d) {
            if (!commonCountryCodes.has(d.id)) return;
            d3.select(this).attr("fill", colorCountry(d));
            tooltip2.classed("hidden", true);
        });

    d3.select("#yearSlider").on("input", function () {
        const year = this.value;
        d3.select("#yearLabel").text(year);
        svg3.selectAll("path")
            .attr("fill", colorCountry)
            .select("title")
            .text(d => {
                if (!commonCountryCodes.has(d.id)) return "";
                const countryData = GDPByCountryYear[d.id];
                const value = countryData ? countryData[year] : "No data";
                return `${d.properties.name}: ${value}`;
            });
    });
}).catch(error => {
    console.error(error);
});

// Existing slideshow navigation code...

let currentSlide = 0;
const slides = d3.selectAll(".slide").nodes();

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
    });
}

d3.select("#prev").on("click", () => {
    currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
});

d3.select("#next").on("click", () => {
    currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
    showSlide(currentSlide);
});

showSlide(currentSlide);
