
// define function to display default graph for ID selector
function init() {
    d3.json("static/data/samples.json").then((incomingData) => {
        var sampVal = incomingData.samples[0].sample_values;
        var otuIds = incomingData.samples[0].otu_ids;
        var otuLabels = incomingData.samples[0].otu_labels;

        var top10samp = sampVal.slice(0,10);
        var top10otu = otuIds.slice(0,10);

        data = [{
            type:'bar',
            x: top10samp,
            y: top10otu,
            orientation:'h',
            text: otuLabels
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
            title: "bubble chart"
        }

        Plotly.newPlot("bar", data, layout);
        Plotly.newPlot("bubble", data2, layout2);

        getsubjectinfo(940)
        
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

        data = [{
            type:'bar',
            x: x,
            y: y,
            orientation:'h',
            text: z
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
        
        // Bubble Graph

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
            title: "Bubble Graph"
        }

        Plotly.newPlot("bar", data, layout);
        Plotly.newPlot("bubble", data2, layout2);

    });
};

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


init();




