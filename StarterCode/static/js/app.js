const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
  init(data)
});
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

function init(data) {
    
    const selector = d3.select("#sample-select");
    data.names.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Disply metadata
    const metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");

    
    // Initialize the chart with the first sample's data
    const firstSample = data.names[0];
    
    buildBarChart(firstSample, data);
    buildBubbleChart(firstSample, data);
    updateMetadata(firstSample, data);
}

function buildBarChart(sample, data) {
    // Filter data for the selected sample
    const sampleData = data.samples.filter(obj => obj.id === sample)[0];
    const sampleValues = sampleData.sample_values.slice(0, 10).reverse();
    const otuIds = sampleData.otu_ids.slice(0, 10).reverse();
    const otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

    // Trace for the horizontal bar chart
    const trace1 = {
        x: sampleValues,
        y: otuIds.map(otuID => `OTU ${otuID}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    const dataPlot = [trace1];

    const layout = {
        title: "Top 10 OTUs Found in Individual",
        margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot("bar-chart", dataPlot, layout);
}

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.

function buildBubbleChart(sample, data) {
    // Filter data for the selected sample
    const sampleData = data.samples.filter(obj => obj.id === sample)[0];
    const sampleValues = sampleData.sample_values;
    const otuIds = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;

const trace2 = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth',
        opacity: 0.8
    }
};

const dataPlot = [trace2];

    const layout = {
        title: 'OTU Bubble Chart',
        showlegend: false,
        xaxis: { title: 'OTU ID', range: [0, 3500] },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble", dataPlot, layout);
}

function updateMetadata(sample, data) {
    const metadata = data.metadata.filter(obj => obj.id == sample)[0];
    const metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html(""); // Clear existing metadata

    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv
            .append("p") // Use paragraph tags for each key-value pair
            .text(`${key}: ${value}`);
    });
}
// Event listener for the dropdown menu
d3.select("#sample-select").on("change", function() {
    const newData = d3.select(this).property("value");
    d3.json(url).then(function(data) {
        init(data);
        buildBarChart(newData, data);
        buildBubbleChart(newData, data);
        updateMetadata(newData, data);
    });
});




