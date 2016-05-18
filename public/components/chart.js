import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Faux from 'react-faux-dom';
import D3 from 'D3';

export default class Chart extends Component {
    
  componentWillMount() {
    this.setState({ready:false});
    this.getWatsonData();
  }
  
  resultsBack(data) {
    this.d3Data = data;
    this.setState({ready:true});
  }
  
  getWatsonData() {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/api/watson/channel",
      "method": "POST",
      "headers":
        {
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded"
        },
      "data":
        {
          "channel": "C14CAT2HE"
        }
    };
  
  // var x = $.ajax(settings).done(function (response,callback) {
  var callback = this.resultsBack.bind(this);
  $.ajax(settings).done(function (response) {
    // this.d3Data = processData(response);
    // console.log(this.d3Data);
    callback(processData(response));
  });
      // var json = {"Social Tone":{"Openness":.079,"Conscientiousness":.560,"Extraversion":.951,"Agreeableness":.763,"Emotional Range":.375}}
      // var data = processData(json);
      // this.d3Data = data;
  }

  render() {
    if (this.state.ready) {
      
    var fauxElement = Faux.createElement("div");
    
    var diameter = 800, //max size of the bubbles
      color = d3.scale.category20b(); //color category
    
    var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(10);
    
    var svg = d3.select(fauxElement)
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");
    
    var json = {"Social Tone":{"Openness":.079,"Conscientiousness":.560,"Extraversion":.951,"Agreeableness":.763,"Emotional Range":.375}}
    
    //bubbles needs very specific format, convert data to this.
    // var data = processData(json);
    console.log(this.d3Data);

    var nodes = bubble.nodes({children:this.d3Data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
      .attr("transform", "translate(0,0)")
      .selectAll(".bubble")
      .data(nodes)
      .enter();

    //create the bubbles
    bubbles.append("circle")
      .attr("r", function(d){ return d.r; })
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .style("fill", function(d) { return color(d.value); });

    //format the text for each bubble
    bubbles.append("text")
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y + 5; })
      .attr("text-anchor", "middle")
      .text(function(d){ return d["name"]; })
      .style({
          "fill":"white", 
          "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
          "font-size": "12px"
      });

    return (
      <div>
        {fauxElement.toReact()}
      </div>
    );
  } else {
    return (
      <h3>
        Loading chart...
      </h3>
    );
  }
  
  }
}
  
// function processData(data) {
//   var obj = data[Object.keys(data)[0]];

//   var newDataSet = [];

//   for(var key in obj) {
//     newDataSet.push({name: key, value: obj[key]});
//   }
//   return newDataSet;
// }
function processData(data) {
  var wrapper = [];
  for (var i = 0; i < data.length; i++) {
    // if text is undefined then record has data
    if (!data[i].text) {
      wrapper.push(data[i].tone[2])
    }
  }
  
  var results = [];
  for (var i = 0; i < wrapper.length; i++) {
    results.push(wrapper[i].tones);
  }
  
  for (var i = 0; i < results[0].length; i++) {
    var accum = 0
    for (var j = 1; j < results.length; j++) {
      accum += results[j][i].score;
    }
    results[0][i].score = (results[0][i].score + accum) / results.length;
  }
  
  wrapper = [];
  results = results[0];
  for (var i = 0; i < results.length; i++) {
    var obj = {};
    obj.name = results[i].tone_name;
    obj.id = results[i].tone_id;
    obj.value = results[i].score;
    wrapper.push(obj);
  }
  
  return wrapper;
}

// function getWatsonData(callback) {

//    var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "/api/watson/channel",
//     "method": "POST",
//     "headers": {
//       "cache-control": "no-cache",
//       "postman-token": "c5a32e6d-7f64-5eaa-d435-50d5af557090",
//       "content-type": "application/x-www-form-urlencoded"
//     },
//     "data": {
//       "channel": "C155RNX46"
//     }
//   }
  
//   // var x = $.ajax(settings).done(function (response,callback) {
//   var x = $.ajax(settings).done(function (callback) {
//     callback();
//   });
//       var json = {"Social Tone":{"Openness":.079,"Conscientiousness":.560,"Extraversion":.951,"Agreeableness":.763,"Emotional Range":.375}}
//       var data = processData(json);
//       return data;
// }








