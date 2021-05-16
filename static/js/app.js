
// define function to display default graph for ID selector
function init() {
    d3.json("static/data/samples.json").then((incomingData) => {
        var sampVal = incomingData.samples[0].sample_values;
        var otuIds = incomingData.samples[0].otu_ids;
        var otuLabels = incomingData.samples[0].otu_labels;

        var top10samp = sampVal.slice(0,10);
        var top10otu = otuIds.slice(0,10);

        // display bar graph when page is loaded
        data = [{
            type:'bar',
            x: top10samp,
            y: top10otu,
            orientation:'h',
            text: otuLabels,
            marker: {
                color: otuIds,
                width: 2
            },
        }];

        layout = {
            title: {
                text:"Top 10 Bacteria for ID: 940",
                font: {size:30}
            },
            xaxis: {
                title: {
                    text:"Number of Sample per OTU",
                    font: {size:20}
                },
            },
            yaxis: {
                autorange: 'reversed',
                type: 'category',
                title: {
                    text: "Top 10 OTU IDs",
                    font: {size:20}
                }
            },
        };

        // display bubble graph when page is loaded
        data2 = [{
            x: otuIds,
            y: sampVal,
            mode: 'markers',
            marker: {
                size: sampVal,
                color: otuIds
            },
            text: otuLabels
        }]

        layout2 = {
            title: {
                text: "ID: 940 - All OTUs Present",
                font: {size: 30}
            },
            xaxis: {
                title: {
                    text: "OTU ID#",
                    font: {size: 20}
                },
            },
            yaxis: {
                
            }
        }

        Plotly.newPlot("bar", data, layout);
        Plotly.newPlot("bubble", data2, layout2);

        // calls function to populate Demographic Table and gauge for subject 940
        getsubjectinfo(940);
        buildGauge(940);
        
    });
}

// assign test subject IDs in drop down
d3.json("static/data/samples.json").then((incomingData) => {
    var subjectIds = incomingData.names;

    subjectIds.forEach((id) => {
        var dropDown = d3.select("#dropdown-menu");
        var option = dropDown.append("option");
        option.text(id);
    });
    // console.log(subjectIds);
});



// create event listener for dropdown
var dropDown = d3.select("#dropdown-menu");
dropDown.on('change', updatePlotly);



function updatePlotly() {
    var dropValue = d3.select("#dropdown-menu").property('value')
    getsubjectinfo(parseInt(dropValue))
    
    //call the guage function to show wash frequency with dropDown value
    buildGauge(parseInt(dropValue));

    d3.json("static/data/samples.json").then((incomingData) => {
        var samp_df = incomingData.samples;
        
        var x;
        var y;
        var z; 
        x1 = [];
        y1 = [];
        z1 = [];

        samp_df.forEach((row) => {
            if (dropValue === row.id) {
                var top10samps = row.sample_values.slice(0, 10);
                var top10otus = row.otu_ids.slice(0, 10);
                var top10labels = row.otu_labels.slice(0, 10);
                
                var otuIds = row.otu_ids;
                var sampValues = row.sample_values;
                var otuLabels = row.otu_labels;

                x = top10samps;
                y = top10otus;
                z = top10labels
                x1 = otuIds;
                y1 = sampValues;
                z1 = otuLabels;

            }
        });

        // Update Bar Graph
        data = [{
            type:'bar',
            x: x,
            y: y,
            orientation:'h',
            text: z,
            marker: {
                color: y,
                width: 2
            },
        }];

        layout = {
            title: {
                text: `Top 10 Bacteria for ID: ${dropValue}`,
                font: {size: 30}
            },
            xaxis: {
                autorange: true,
                visible: true,
                title: {
                    text: "Number of Sample per OTU",
                    font: {size: 20}
                }
            },
            yaxis: {
                title: {
                    text: "Top 10 OTU IDs",
                    font: {size: 20},
                },
                autorange: 'reversed',
                type: 'category'
            },
        };
        
        // Update Bubble Graph

        data2 = [{
            x: x1,
            y: y1,
            mode: "markers",
            marker: {
                size: y1,
                color: x1,
            },
            text: z1
        }];

        layout2 = {
            title: {
                text: `ID: ${dropValue} - All OTUs Present`,
                font: {size: 30}
            },
            xaxis: {
                title: {
                    text: "OTU ID#",
                    font: {size: 20}
                },
                autorange: true,
                visible: true,
                showgrid: false,
                zeroline: false,
                showline: false,
            },
            yaxis: {
                autorange: true,
                visible: true,
            },
        }

        // Create new plots with user input
        Plotly.newPlot("bar", data, layout);
        Plotly.newPlot("bubble", data2, layout2);

    });
};

// Function to get user data to build the table for Demographic Info
function getsubjectinfo(subject) {
    
    d3.json("static/data/samples.json").then((incomingData) => {
        var metaData = incomingData.metadata
        var subId;
        var subEth;
        var subGender;
        var subAge;
        var subLoc;
        var subBbtype;
        var subWfreq;
        
        metaData.forEach((row) => {
            if (subject === row.id) {
                subId = row.id;
                subEth = row.ethnicity;
                subGender = row.gender;
                subAge = row.age;
                subLoc = row.location;
                subBbtype = row.bbtype;
                subWfreq = row.wfreq;
            };
        });

        buildTable(subId, subEth, subGender, subAge, subLoc, subBbtype, subWfreq)
    });
};

// Function to build Table with Demo Info for each subject
function buildTable(subId, subEth, subGender, subAge, subLoc, subBbtype, subWfreq) {
    var table = d3.select("table");
    var tbody = table.select("tbody");
    var trow = tbody.selectAll("tr");
    trow.remove();

    for (var i = 0; i <1 ; i++) {
        tbody.append("tr").text(`ID:         ${subId}`);
        tbody.append("tr").text(`Ethnicity:  ${subEth}`);
        tbody.append("tr").text(`Gender:     ${subGender}`);
        tbody.append("tr").text(`Age:        ${subAge}`);
        tbody.append("tr").text(`Location:   ${subLoc}`);
        tbody.append("tr").text(`BBtype:     ${subBbtype}`);
        tbody.append("tr").text(`Wfreq:      ${subWfreq}`);
    }
}

// Function to grate gauge chart
function buildGauge(subject) {
    d3.json("static/data/samples.json").then((incomingData) => {
        var metaData = incomingData.metadata
        var subWfreq;


        metaData.forEach((row) => {
            if (subject === row.id) {
                subWfreq = row.wfreq;
            };
        });

        var gaugeData = [{
              domain: { x: [0, 1], y: [0, 1] },
              value: subWfreq,
              title: { text: "Wash Frequency"},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { 
                    range: [0, 10],
                    tickmode: "linear",
                    nticks: 9,
                    ticklabelposition: "inside"
                },

                bar: {
                    thickness: .5
                },

                steps: [
                    {range: [0, 0.9999], color: "lavender", line: {color:"black", width: 0.5}},
                    {range: [1, 1.9999], color: "lavender", line: {color:"black", width: 0.5}},
                    {range: [2, 2.9999], color: "aliceblue", line: {color:"black", width: 0.5}},
                    {range: [3, 3.9999], color: "aliceblue", line: {color:"black", width: 0.5}},
                    {range: [4, 4.9999], color: "lightyellow", line: {color:"black", width: 0.5}},
                    {range: [5, 5.9999], color: "lightyellow", line: {color:"black", width: 0.5}},
                    {range: [6, 6.9999], color: "darkseagreen", line: {color:"black", width: 0.5}},
                    {range: [7, 7.9999], color: "darkseagreen", line: {color:"black", width: 0.5}},
                    {range: [8, 8.9999], color: "green", line: {color:"black", width: 0.5}},
                    {range: [9, 9.9999], color: "green", line: {color:"black", width: 0.5}},
                ],
              }
            }];


        Plotly.newPlot('gauge', gaugeData);
    });
};

init();




