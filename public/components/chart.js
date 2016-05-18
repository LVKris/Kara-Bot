import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUsers, fetchUser } from '../actions/index';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Faux from 'react-faux-dom';
import D3 from 'D3';


export default class Chart extends Component {
  
  render() {
var fauxElement = Faux.createElement("div");

var diameter = 1000, //max size of the bubbles
    color    = d3.scale.category20b(); //color category

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
    var data = processData(json);

    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

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
  }
}
  
function processData(data) {
  var obj = data[Object.keys(data)[0]];

  var newDataSet = [];

  for(var key in obj) {
    newDataSet.push({name: key, value: obj[key]});
  }
  return newDataSet;
}

// function mapStateToProps(state) {
//   return { all: state.users.all, user: state.users.user };
// }

// export default connect(mapStateToProps, { fetchUsers, fetchUser })(UsersList);
// export default connect();
