var data = [];

var width = 1100;
var height = 800;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

//define row information
function row(d) {
    if ((d.player1=="Rafael Nadal" || d.player1=="Roger Federer" || 
        d.player1=="Andy Murray" || d.player1=="Novak Djokovic"|| d.player1=="Andy Roddick") 
        && d.errordiff > 0 && d.aggdiff > 0)
  return {
    year: +d.year, // convert "Year" column to number
    ace1: +d.ace1,
    player1: d.player1,
    agg1: +d.agg1,
    aggdiff: +d.aggdiff,
    errordiff: +d.errordiff,
    fastServe1: +d.fastServe1,
    firstServe1: +d.firstServe1,
    net1: +d.net1,
    firstPointWon1: +d.firstPointWon1,
    pbforce1: +d.pbforce1,
    player2: d.player2,
    ace2: +d.ace2,
    firstServe2: +d.firstServe2,
    net2: +d.net2,
    firstPointWon2: +d.firstPointWon2,
    pbforce2: +d.pbforce2
  };
}

//load csv file
d3.csv("new.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ firstServe2: d.firstServe2, ace2: d.ace2, pbforce2: d.pbforce2, firstPointWon2: d.firstPointWon2, net2: d.net2, pbforce1: d.pbforce1, firstPointWon1: d.firstPointWon1, net1: d.net1, year: d.year, ace1: d.ace1, player1: d.player1, agg1: d.agg1, aggdiff: d.aggdiff,errordiff: d.errordiff, fastServe1:d.fastServe1, player2: d.player2, firstServe1: d.firstServe1 });
    });

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

    var scale_y = d3.scale.linear()
                    .domain([
                            d3.max(data, function(d) { return d.errordiff; })+10,
                            d3.min(data, function(d) { return d.errordiff; })
                            ])
                    .range([0, 570]);
                                

    var scale_x = d3.scale.linear()
                    .domain([
                            d3.min(data, function(d) { return d.aggdiff; }) - 5,
                            d3.max(data, function(d) { return d.aggdiff; })+10
                            ])
                    .range([0, 900]);
    
   
    var data_svg = d3.select(".scatterdiv")
                    .append("svg")
                    .attr("class","scatter")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform","translate(80,25)");

    //Showing the X-axis showing year and Y-axis showing fast serve speed                
    var xAxis = d3.svg.axis()
    .scale(scale_x)
                .innerTickSize(7)
                .outerTickSize(3)
                .orient("bottom");

    var yAxis = d3.svg.axis().scale(scale_y).orient("left").innerTickSize(7).outerTickSize(3);

    //var legendHolder = d3.select(".legendHolder").append("svg").attr("height", "150px").attr("width","1500px");

    data_svg.append("svg:g")
            .call(xAxis)
            .attr("transform", "translate(-3,569)")
            .style("font-size","20px")
            .style("font-family", "Arial");

    data_svg.append("svg:g")
            .call(yAxis)
            .attr("transform", "translate(0,0)")
            .style("font-size","20px")
            .style("font-family", "Arial");

    data_svg.append("text")      // text label for the x axis
            .attr("transform", "translate(500,635)")
            .style("text-anchor", "middle")
            .text("Aggressive Margin")
            .style("font-size","25px")
            .style("font-family", "Arial");

    data_svg.append("text")     //text label for y axis
            .attr("transform", "rotate(-90)")
            .attr("dx", "-20.2em")
            .attr("dy", "-2.5em")
            .text("Error ")
            .style("text-anchor", "middle")
            .style("font-size","22px")
            .style("font-family", "Arial"); 

    data_svg.append("text")     //text label for y axis
            .attr("transform", "rotate(-90)")
            .attr("dx", "-15em")
            .attr("dy", "-3.1em")
            .text("(Relatively more errors by opponent)")
            .style("text-anchor", "middle")
            .style("font-size","18px")
            .style("font-family", "Arial");                                        

    var default_opacity = 0.5;
    var colorScale = d3.scale.category10(); 

    var radiusScale = d3.scale.linear().domain([
                            d3.min(data, function(d) { return d.fastServe1; }),
                            d3.max(data, function(d) { return d.fastServe1; })
                            ]).range([1, 20]);

    function color(d) {
            return d.player1;   
    }

    function radius(d) {
        return d.fastServe1;
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    var data_radar = [
                        [
                        {axis: "Points won by forcing error", value: 0},
                        {axis: "Aces", value: 0},
                        {axis: "First Serve", value: 0},
                        {axis: "Net", value: 0},
                        {axis: "First Point Won", value: 0},
                        
                        ]
                    ];

    RadarChart.draw("#chart", data_radar);


    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return scale_x(d.aggdiff);
        })
        .attr("opacity", default_opacity)
        .attr("cy", function(d) {
            return scale_y(d.errordiff);
        })
        .attr("r", function(d) {
            return radiusScale(radius(d));
        })
        .style("fill", function (d) {
            return colorScale(color(d));
        })
        .attr('class',function(d){
            return d.player1.replace(' ','_');
        })
        .on("mouseover", function(d) {
            d3.selectAll("." +d.player1.replace(' ','_'))
                .moveToFront()
                .style("opacity", 0.8);
            d3.selectAll("circle:not(." +d.player1.replace(' ','_') +")")
                .style("opacity", 0.1);

            //tooptip appears
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
            tooltip.html("<b>" +d.player1 + "</b><br>Year: " +d.year +"<br>Agg. Margin: " + d.aggdiff +"<br>Error: " +d.errordiff +"<br>Opponent: " +d.player2)  
                .style("left", (d3.event.pageX + (radius(d)/2)*0.1) + "px")     
                .style("top", (d3.event.pageY + (radius(d)/2)*0.1) + "px");

            document.getElementById('chart').style.display = "block";
            console.log(d.pbforce2);
            var data = [
                            [
                            {axis: "Points won by forcing error", value: d.pbforce1*2},
                            {axis: "Aces", value: d.ace1*10},
                            {axis: "First Serve", value: d.firstServe1*100},
                            {axis: "Net", value: d.net1*100},
                            {axis: "First Point Won", value: d.firstPointWon1*100}
                            
                            ],[
                            {axis: "Points won by forcing error", value: d.pbforce2*2},
                            {axis: "Aces", value: d.ace2*10},
                            {axis: "First Serve", value: d.firstServe2*100},
                            {axis: "Net", value: d.net2*100},
                            {axis: "First Point Won", value: d.firstPointWon2*100}
                            
                            ]
                        ];

            RadarChart.draw("#chart", data);

        })
        .on("mouseout", function(d) {
            document.getElementById('chart').style.display = "hidden";
            d3.selectAll("circle")
                .style("opacity", default_opacity);

            //tooptip disappears
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
            var data = [
                            [
                            {axis: "Points won by forcing error", value: 0},
                            {axis: "Aces", value: 0},
                            {axis: "First Serve", value: 0},
                            {axis: "Net", value: 0},
                            {axis: "First Point Won", value: 0}
                            
                            ]
                        ];

            RadarChart.draw("#chart", data);
        })
        .sort(order);

    // colorScale.domain(function(d) { return d.player1; });

    //console.log(colorScale.domain().slice());

    var legend = data_svg.selectAll("svg")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class","legend")
    .attr("transform", function(d,i) {
        //console.log(i);
        return "translate(" +(i+1)*15 +",0)";
    });


    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)) +",0)";
    })
    .style("fill", colorScale);
    
    legend.append("text")
    .data(colorScale.domain())
    .attr("id", function(d){return "text_"+d.replace(" ","_");})
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)+25) +",16)";
    })
    .text(function(d) { 
        //console.log(d);
        return d;})
    .on("click", function(d) {
        //console.log(d.replace(' ','_'));
        var appBanners = document.getElementsByClassName(d.replace(' ','_'));


        for (var i = 0; i < appBanners.length; i ++) {
            //console.log("bba");
            
            if (!isHidden(appBanners[i])) {
                appBanners[i].style.display = 'none';
                d3.select(this).attr("fill","#555555");
                //document.getElementById("text_" +d.replace(" ","_")).style.color = "red";
            }

            else {
                appBanners[i].style.display = 'block';
                d3.select(this).attr("fill","black");
                document.getElementById("text_" +d.replace(" ","_")).style.color = "black";
            }   
        }
    })

    .style("text-anchor", "start")
    .style("font-size","20px")
    .style("font-family","helvetica");


 
});