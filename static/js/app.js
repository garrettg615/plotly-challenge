console.log('this is the beginning!')


function init() {
    d3.json("static/data/samples.json").then((abc) => {
        data = [{
            x: abc.samples[0].sample_values,
            y: abc.samples[0].otu_ids,
            type:'bar',
            orientation:'h'
        }];

        Plotly.newPlot("graph1", data)
        
    })
}

init()


// var ids = [];
// var sampleValues = [];
// var otuIds = [];
// var otuLabels = [];


// d3.json("static/data/samples.json").then((data) => {
//     var research = data.samples;
//     // console.log(research)

//     research.forEach((subject) => {
//         ids.push(subject.id)
//         sampleValues.push(subject.sample_values)
//         otuIds.push(subject.otu_ids)
//         otuLabels.push(subject.otu_labels)
//     })
    

// });



// // console.log(ids)
// // console.log(sampleValues)
// // console.log(otuIds)
// // console.log(otuLabels)

