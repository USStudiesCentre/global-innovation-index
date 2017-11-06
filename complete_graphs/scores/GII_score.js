    // bold buttons to right of graph which reorders y axis

    $('p').click(function() {
        this.style.fontWeight = 'bold'
        $(this).siblings().css('font-weight', 'normal')
    });

    $(document).scroll(function() {
    checkOffset();
});

function checkOffset() {
    if($('#landing-wrappter').offset().top + $('#landing-wrapper').height() 
                                           >= $('#footer').offset().top - 0)
        $('#landing-wrapper').css('position', 'relative');
    if($(document).scrollTop() + window.innerHeight < $('#footer').offset().top)
        $('#landing-wrapper').css('position', 'fixed'); // restore when you scroll up
}

// $(window).scroll(function () {
//             if ($(window).scrollTop() <200) {
//                 $("#chart").addClass("relative");
//             } else {
//                 $("#chart").removeClass("relative");
//             }
            
//         });

// $(window).scroll(function() {
//    if($(window).scrollTop() + $(window).height() == $(document).height()) {
//        $("#chart").css({position: "relative"});
//    }else{
//        $("#chart").css({position: "fixed"});
//    }

// });

// $(window).scroll(function() {
//    if($(window).scrollTop() + $(window).height() == $(document).height()) {
//        $("#sections").css({position: "relative"});
//    }else{
//        $("#sections").css({position: "fixed"});
//    }

// });

    // this is the size of the chart
    var fullwidth = 1000,
        fullheight = 2000;

    var container = d3.select('body').append('div')
        .attr('id', 'chart');

    var margin = { top: 10, right: 45, bottom: 10, left: 450 };

    var width = 1000 - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;

    var widthScale = d3.scale.linear()
        .range([0, width]);

    var heightScale = d3.scale.ordinal()
        .rangeRoundBands([margin.top, height], 0.1);


    var xAxis = d3.svg.axis()
        .scale(widthScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(heightScale)
        .orient("left")
        .innerTickSize([0]);


    var ustip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Score: " + d.usa;
        });

    var austip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Score: " + d.australia;
        });

    var difftip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Score differential: " + d.difference;
        });


         var abvaluetip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Score differential: " + d.abvalue;
        });

    var yindextip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            if(d.definition=="NA"){return tip.hide;}
            else{
                return "Definition: " + d.definition + "<br>" + "<br>" + "Source: " + '<a href= "' + d.url + '" target="_blank">' + d.source + "</a>";}
        });

    var svg = container.append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight);





    svg.call(ustip);
    svg.call(austip);
    svg.call(difftip);
    svg.call(abvaluetip);
    svg.call(yindextip);




    //Load data here

    d3.csv("scores.csv", function(error, data) {
        // Scores are out of 100
        widthScale.domain([0, 100]);

        // js map: will make a new array out of all the d.indicators fields
        heightScale.domain(data.map(function(d) { return d.indicators; }));


        if (error) {
            console.log("error reading file");



        };



        // Make the faint lines from 0 to 100 

        var linesGrid = svg.selectAll("lines.grid")
            .data(data)
            .enter()
            .append("line");

        linesGrid.attr("class", "grid")
            .attr("x1", margin.left)
            .attr("y1", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            })
            .attr("x2", 960)
            .attr("y2", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            });


        // Make the dotted lines between the dots

        var linesBetween = svg.selectAll("lines.between")
            .data(data)
            .enter()
            .append("line")
            .on('mouseover', difftip.show)
            .on('mouseout', difftip.hide);

        linesBetween.attr("class", "between")
            .attr("x1", function(d) {
                return margin.left + widthScale(+d.usa);
            })
            .attr("y1", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            })
            .attr("x2", function(d) {
                return margin.left + widthScale(+d.australia);
            })
            .attr("y2", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            })
            .attr("stroke-dasharray", "5,5");



        // //second y axis
        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 20)
        //     .attr("x2", 80)
        //     .attr("y2", 1340)
        //     .style("stroke", "black");
        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 20)
        //     .attr("x2", 100)
        //     .attr("y2", 20)
        //     .style("stroke", "black");
        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 1340)
        //     .attr("x2", 100)
        //     .attr("y2", 1340)
        //     .style("stroke", "black");
        // svg.append("text")
        //     .attr("x", 20)
        //     .attr("y", 500)
        //     .style("fill", "black")
        //     .text("Inputs");



        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 1350)
        //     .attr("x2", 80)
        //     .attr("y2", 1980)
        //     .style("stroke", "black");
        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 1350)
        //     .attr("x2", 100)
        //     .attr("y2", 1350)
        //     .style("stroke", "black");
        // svg.append("line")
        //     .attr("x1", 80)
        //     .attr("y1", 1980)
        //     .attr("x2", 100)
        //     .attr("y2", 1980)
        //     .style("stroke", "black");
        // svg.append("text")
        //     .attr("x", 20)
        //     .attr("y", 1600)
        //     .style("fill", "black")
        //     .text("Outputs");


        // Make the dots for the US

        var dotsusa = svg.selectAll("circle.usa")
            .data(data)
            .enter()
            .append("circle")
            .on('mouseover', ustip.show)
            .on('mouseout', ustip.hide);


        dotsusa
            .attr("class", "usa")
            .attr("cx", function(d) {
                return margin.left + widthScale(+d.usa);
            })
            .attr("r", heightScale.rangeBand() / 2)
            .attr("cy", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            });



        // Make the dots for Australia

        var dotsaustralia = svg.selectAll("circle.australia")
            .data(data)
            .enter()
            .append("circle")
            .on('mouseover', austip.show)
            .on('mouseout', austip.hide);

        dotsaustralia
            .attr("class", "australia")
            .attr("cx", function(d) {
                return margin.left + widthScale(+d.australia);
            })
            .attr("r", heightScale.rangeBand() / 2)
            .attr("cy", function(d) {
                return heightScale(d.indicators) + heightScale.rangeBand() / 2;
            });




        // add the axes
        // x axis added manually up top in title div for easy access when scrolling
        //Note: the manual scale is messy code. This should be rewritten in the future. 


        yaxis = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);






        //See GII list when new ranking comes out - they should be nested. I.e. the institutions score is the average of political env, reg. env, and business env. These scores in turn are the average of the sub-scores. They have been bolded in the graph - see below for style.           
        // Style headingss and subheadings of the index indicators in bold:
        var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[0]; // un-nest array
        d3.select(allYAxisLabels[0]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[1]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[2]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[3]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[4]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[5]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[6]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[7]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[8]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[9]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[10]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[11]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[12]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[13]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[14]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[15]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[16]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[17]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[18]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[19]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[20]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[21]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[22]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[23]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[24]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[25]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[26]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[27]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[28]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[29]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[30]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[31]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[32]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[33]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[34]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[35]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[36]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[37]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[38]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[39]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[40]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[41]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[42]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[43]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[44]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[45]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[46]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[47]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[48]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[49]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[50]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[51]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[52]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[53]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[54]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[55]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[56]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[57]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[58]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[59]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[60]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[61]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[62]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[63]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[64]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[65]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[66]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[67]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[68]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[69]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[70]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[71]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[72]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[73]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[74]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[75]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[76]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[77]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[78]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[79]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[80]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[81]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[82]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[83]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[84]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[85]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[86]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
        d3.select(allYAxisLabels[87]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[88]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[89]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[90]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[91]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[92]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[93]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[94]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[95]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[96]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[97]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[98]).style("font-weight", "bold").style("font-size", "14px");
        d3.select(allYAxisLabels[99]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[100]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[101]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[102]).style("font-size", "12px").style("fill", "gray");
        d3.select(allYAxisLabels[103]).style("font-size", "12px").style("fill", "gray");

        //add indicator definition in tool tip
        d3.selectAll('.y .tick')
            .data(data)
            .on('mouseover', function(d) {
                yindextip.show(d);
            })
            .on('mouseout', function(d) {
                d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
            });



    });


    // ** Update data section (Called from the onclick)
    function updateData_original() {
        d3.csv("scores.csv", function(error, data) {
            if (error) {
                console.log("error reading file");
            };

            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });

            //make dots for US
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");



            //second y axis
            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 20)
                .attr("x2", 80)
                .attr("y2", 1340)
                .style("stroke", "black");
            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 20)
                .attr("x2", 100)
                .attr("y2", 20)
                .style("stroke", "black");
            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 1340)
                .attr("x2", 100)
                .attr("y2", 1340)
                .style("stroke", "black");
            svg.append("text")
                .attr("x", 20)
                .attr("y", 500)
                .style("fill", "black")
                .text("Inputs");



            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 1350)
                .attr("x2", 80)
                .attr("y2", 1980)
                .style("stroke", "black");
            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 1350)
                .attr("x2", 100)
                .attr("y2", 1350)
                .style("stroke", "black");
            svg.append("line")
                .attr("x1", 80)
                .attr("y1", 1980)
                .attr("x2", 100)
                .attr("y2", 1980)
                .style("stroke", "black");
            svg.append("text")
                .attr("x", 20)
                .attr("y", 1600)
                .style("fill", "black")
                .text("Outputs");


            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });



            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);





            //See GII list when new ranking comes out - they should be nested. I.e. the institutions score is the average of political env, reg. env, and business env. These scores in turn are the average of the sub-scores. They have been bolded and otherwised "styled" in the graph - see below.     
            // Style headingss and subheadings of the index indicators in bold:
            var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[0]; // un-nest array
            d3.select(allYAxisLabels[0]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[1]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[2]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[3]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[4]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[5]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[6]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[7]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[8]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[9]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[10]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[11]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[12]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[13]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[14]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[15]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[16]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[17]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[18]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[19]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[20]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[21]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[22]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[23]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[24]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[25]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[26]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[27]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[28]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[29]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[30]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[31]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[32]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[33]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[34]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[35]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[36]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[37]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[38]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[39]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[40]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[41]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[42]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[43]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[44]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[45]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[46]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[47]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[48]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[49]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[50]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[51]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[52]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[53]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[54]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[55]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[56]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[57]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[58]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[59]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[60]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[61]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[62]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[63]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[64]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[65]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[66]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[67]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[68]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[69]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[70]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[71]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[72]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[73]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[74]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[75]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[76]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[77]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[78]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[79]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[80]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[81]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[82]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[83]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[84]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[85]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[86]).style("text-decoration", "underline").style("font-weight", "bold").style("font-size", "16px");
            d3.select(allYAxisLabels[87]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[88]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[89]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[90]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[91]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[92]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[93]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[94]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[95]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[96]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[97]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[98]).style("font-weight", "bold").style("font-size", "14px");
            d3.select(allYAxisLabels[99]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[100]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[101]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[102]).style("font-size", "12px").style("fill", "gray");
            d3.select(allYAxisLabels[103]).style("font-size", "12px").style("fill", "gray");

            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });



        });
    }


    // ** Update data section (Called from the onclick)
    function updateData_ozmin() {

        d3.csv("ozmin.csv", function(error, data) {

            if (error) {
                console.log("error reading file");


            };



            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });



            // Make the dots for the US
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");





            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });



        });
    }
    // ** Update data section (Called from the onclick)
    function updateData_ozmax() {

        d3.csv("ozmax.csv", function(error, data) {

            if (error) {
                console.log("error reading file");


            };



            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });
            //add US dots
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");




            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });

            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);

            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });



        });
    }

    // ** Update data section (Called from the onclick)
    function updateData_usmax() {

        d3.csv("usmax.csv", function(error, data) {

            if (error) {
                console.log("error reading file");


            };



            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });

            //add US dots
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");




            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });

            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });



        });
    }


    // ** Update data section (Called from the onclick)
    function updateData_usmin() {

        d3.csv("usmin.csv", function(error, data) {

            if (error) {
                console.log("error reading file");


            };



            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });
            //add US dots
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");



            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });

            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });



        });
    }



    // ** Update data section (Called from the onclick)
    function updateData_diff() {

        d3.csv("difference.csv", function(error, data) {

            if (error) {
                console.log("error reading file");


            };



            svg.selectAll("*").remove();

            // Scores are out of 100
            widthScale.domain([0, 100]);

            // js map: will make a new array out of all the d.indicators fields
            heightScale.domain(data.map(function(d) { return d.indicators; }));


            // Make the faint lines from 0 to 100 

            var linesGrid = svg.selectAll("lines.grid")
                .data(data)
                .enter()
                .append("line");

            linesGrid.attr("class", "grid")
                .attr("x1", margin.left)
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", 960)
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });
            //add US dots
            var dotsusa = svg.selectAll("circle.usa")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', ustip.show)
                .on('mouseout', ustip.hide);



            dotsusa
                .attr("class", "usa")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });


            // Make the dotted lines between the dots

            var linesBetween = svg.selectAll("lines.between")
                .data(data)
                .enter()
                .append("line")
                .on('mouseover', difftip.show)
                .on('mouseout', difftip.hide);

            linesBetween.attr("class", "between")
                .attr("x1", function(d) {
                    return margin.left + widthScale(+d.usa);
                })
                .attr("y1", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("x2", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("y2", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                })
                .attr("stroke-dasharray", "5,5");





            // Make the dots for Australia

            var dotsaustralia = svg.selectAll("circle.australia")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', austip.show)
                .on('mouseout', austip.hide);

            dotsaustralia
                .attr("class", "australia")
                .attr("cx", function(d) {
                    return margin.left + widthScale(+d.australia);
                })
                .attr("r", heightScale.rangeBand() / 2)
                .attr("cy", function(d) {
                    return heightScale(d.indicators) + heightScale.rangeBand() / 2;
                });



            // add the axes
            // x axis added manually up top in title div for easy access when scrolling
            //Note: the manual scale is messy code. This should be rewritten in the future. 
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
            //add indicator definition in tool tip
            d3.selectAll('.y .tick')
                .data(data)
                .on('mouseover', function(d) {
                    yindextip.show(d);
                })
                .on('mouseout', function(d) {
                    d3.select(".d3-tip").transition().duration(3000).style("opacity", "0").each("end", yindextip.hide);
                });




        });
    }