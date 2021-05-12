console.log('this is the beginning!')

// define function to display default graph for ID selector
function init() {
    d3.json("static/data/samples.json").then((incomingData) => {
        var sampVal = incomingData.samples[0].sample_values;
        var otuIds = incomingData.samples[0].otu_ids;

        var top10samp = sampVal.slice(0,10);
        var top10otu = otuIds.slice(0,10);

        data = [{
            type:'bar',
            x: top10samp,
            y: top10otu,
            orientation:'h'
        }];

        layout = {
            title: "Top 10 Bacteria in Naval",
            xaxis: {
                dtick: 50
            },
            yaxis: {
                autorange: 'reversed',
                type: 'category'
            },
        };

        Plotly.newPlot("graph1", data, layout);
        
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

d3.select("#dropdown-menu").on('change', updatePlotly);

function updatePlotly() {
    var dropValue = d3.select("#dropdown-menu").property('value')
    console.log(dropValue);

    d3.json("static/data/samples.json").then((incomingData) => {
        var samp_df = incomingData.samples;
        
        x = [];
        y = [];

        samp_df.forEach((row) => {
            if (dropValue === row.id) {
                var top10samps = row.sample_values.slice(0, 10);
                var top10otus = row.otu_ids.slice(0, 10);
    
                x = top10samps;
                y = top10otus;

            }
        });

        data = [{
            type:'bar',
            x: x,
            y: y,
            orientation:'h'
        }];

        layout = {
            title: "Top 10 Bacteria in Naval",
            xaxis: {
                dtick: 50
            },
            yaxis: {
                autorange: 'reversed',
                type: 'category'
            },
        };
        
        Plotly.newPlot("graph1", data, layout);

    });
};

function buildGraph() {
    d3.json("static/data/samples.json").then((incomingData) => {
        var samples = incomingData.samples;

        var otuIds = [];
        var sampValues = [];
        var otuLabels = [];

        samples.forEach((row) => {
            otuIds.push(row.otu_ids)
            sampValues.push(row.sample_values)
            otuLabels.push(row.otu_labels)
        });
        
        // console.log(otuIds);
        // console.log(sampValues);
        // console.log(otuLabels);

        var data = [{
            x: otuIds,
            y: sampValues,
            mode: 'markers',
            marker: {
                size: otuLabels
            }
        }];

        var layout = {
            title: "Bubble chart"
        };

        Plotly.newPlot("graph2", data, layout)
    });
};


// buildGraph();
init();




