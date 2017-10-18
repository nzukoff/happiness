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
    .await(ready)

let projection = d3.geoMercator()
    .translate([width/2, height/2])
    .scale(100)

let path = d3.geoPath()
    .projection(projection)


function ready (error, data) {
    let countries = topojson.feature(data, data.objects.countries1).features
    console.log(countries)

    svg.selectAll('.country')
        .data(countries)
        .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)

}