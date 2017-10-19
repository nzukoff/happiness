//make map of world
//countries colored by happiness 
//click on country to see details
//details are radar plot showing gdp per capita, life exp, freedom, generosity, trust gov

let margin = {top: 50,bottom: 50,left: 50,right: 50}
let width = 1200 - margin.left - margin.right 
let height = 400 - margin.top - margin.bottom

let svg = d3.select('#map')
    .append('svg')
    .attr("height", height + margin.bottom + margin.top)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

d3.queue()
    .defer(d3.json, '../topo/topojson/world-countries.json')
    .defer(d3.csv, '../data/2017.csv')
    .await(ready)

// let colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0,151])
let colorScale = d3.scaleLinear()
.domain([1, 151])
.range(["#FF8A45", "#8B3400"])
.interpolate(d3.interpolateHsl);

let projection = d3.geoMercator()
    .translate([width/2, height/2])
    .scale(100)

let path = d3.geoPath()
    .projection(projection)


function ready (error, data, happinessData) {
    let countries = topojson.feature(data, data.objects.countries1).features
    let filteredData = countries.filter((d) => {        
        return happinessData.filter((c) => {
            if  (d.properties.name == c.country) {
                d.happinessRank = c.happiness_rank
                d.happinessScore = c.happiness_score
                d.gdp = c.gdp_per_capita
                d.family = c.family
                d.lifeExpectancy = c.life_expectancy
                d.freedom = c.freedom
                d.generosity = c.generosity
                d.governmentCorruption = c.government_corruption
                return d                
            }
        }).length != 0
    })

    console.log("F D is ", filteredData)

    let sortedData = filteredData.sort((a, b) => {return a.happinessRank-b.happinessRank})

    // console.log("S D IS ", sortedData)
    
    svg.selectAll('.country')
        .data(sortedData)
        .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('fill', function(d, i) {
                if (d.happinessRank) {return colorScale(i)}
                else { return '#cccccc'}
            })
            .on('mouseover', function(d) {d3.select(this).classed("selected", true)})
            .on('mouseout', function(d) {d3.select(this).classed("selected", false)})
            .on('click', function(d) {console.log(d.properties.name, d.happinessRank)})

}