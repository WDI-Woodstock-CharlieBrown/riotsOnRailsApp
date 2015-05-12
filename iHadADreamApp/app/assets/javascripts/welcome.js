// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



var app = app || {};

var width, height, projection, path, svg;

var latitude;
var longitude;
var city;
var data;


function projectData(data){

  svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 5)
  .on("mousedown", function() {
    // div.text("div.mousedown");
    $('#widget').hide();
    $('#widget').text('DATA WILL GO HERE');
    $('#widget').fadeIn(2000);
    // $('body').append('BOOM it was bad I swear')

  });
;

  svg.selectAll("circle")
  .data(data)
  .transition(1000)
  .attr("r", 5)
  .attr("transform", function(d) {return "translate(" + projection([d.lat,d.long]) + ")";})
  .transition()
    .duration(5000)
    .delay(1000)
    .attr("r", function(d){ return d.numPeople/10 })
    .attr("fill", 'lightyellow');

  svg.selectAll("circle")
    .data(data)
    .exit()
    .remove();
}

$(document).ready(function(){

  width = window.screen.availWidth;
  height = window.screen.availHeight;

  projection = d3.geo.albersUsa()
      .scale(1000);

  path = d3.geo.path()
      .projection(projection);

  svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.insert("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "state")
      .attr("d", path);


  // var data = [
  //   {name: 'Chicago', lat: -87.625579, long: 41.883876, numPeople: 400},
  //   {name: 'NYC', lat: -74.0059, long: 40.748817, numPeople: 30},
  //   {name: 'Rando', lat: -79.0059, long: 40.748817, numPeople: 20}
  // ];

// projectData(data);


  setTimeout(function(){

     $('.generate-data').on('click', function(evt) {
          data = [];

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

              // longitude = d.features[3].geometry.coordinates[0];
              // latitude = d.features[3].geometry.coordinates[1];
              // city = d.features[3].properties.title;
              // descrip = d.features[3].properties.description;
              // data.push({name: city, lat: longitude, long: latitude, numPeople: 400});

              // console.log(longitude, latitude, city, descrip);
              console.log(data);
              // projectData(data);

            }
          });
        });

    // var data = [
    //   {name: 'NYC', lat: -75.0059, long: 41.748817, numPeople: 60}
    // ];

    projectData(data);

  }, 5000);




});

