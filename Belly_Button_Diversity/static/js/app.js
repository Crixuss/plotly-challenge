function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(data => 
    {
   
      let keyvalue = Object.entries(data);
      // console.log(keyvalue);
      // console.log(Object.entries(data));
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    keyvalue.forEach(d => {
    metadata.append('ul')
    .text(`${d[0]} : ${d[1]}`)
  });

  });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => 
    {
      let ids = data.otu_ids.slice(0,10);
      let values = data.sample_values.slice(0,10);
      let labs = data.otu_labels.slice(0,10);

      let trace = {
        labels: ids,
        values: values,
        hovertext: labs,
        // showlegend: false,
        type: 'pie'
      };

      let pie_data = [trace];
      Plotly.newPlot("pie", pie_data, layout = {autosize: false})
    });
    // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then(data => 
    {
      let trace1 = {
        x: data.otu_ids,
        y: data.sample_values,
        type: 'scatter',
        mode: 'markers',
        marker: {
          symbol: 'circle',
          opacity: 0.5,
          size: data.sample_values,
          color: data.otu_ids
        }
      }
      let scatter_data = [trace1];
      Plotly.newPlot('bubble', scatter_data)
    });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();



