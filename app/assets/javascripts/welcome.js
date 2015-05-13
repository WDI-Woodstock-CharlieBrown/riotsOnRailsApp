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
    .attr("r", 7)
    .attr("stroke", "darkblue")
    .attr("stroke-width", 3)
    .attr("fill", 'rgba(215, 233, 68, 0.85)')
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    .on("click", click);

    function mouseOver(){
      d3.select(this)
      .transition()
      .duration(1000)
      .attr("r", function(d){ if(d.numPeople > 5000) { return d.numPeople/80 + 15} else { return d.numPeople/30 + 15}});
    }

    function mouseOut(){
      d3.select(this)
      .transition()
      .duration(1000)
      .attr("r", function(d){ if(d.numPeople > 5000) { return d.numPeople/80} else { return d.numPeople/30 + 10}})
    }


    function click(data){
      console.log("I did it!");
    }

  // function clicker(){
  //   d3.select(this)
  //   .transition()
  //   .duration(2000)
  //   .attr('r', 30);
  // }



  svg.selectAll("circle")
  .data(data)
  .attr("r", 5)
  .attr("transform", function(d) {return "translate(" + projection([d.lat,d.long]) + ")";})
  .transition()
    .duration(4000)
    .delay(1000)
    .attr("r", function(d){ if(d.numPeople > 5000) { return d.numPeople/80 } else { return d.numPeople/30 + 10}})
    .attr("fill", 'rgba(215, 233, 68, 0.5)');


  svg.selectAll("circle")
    .data(data)
    .exit()
    .remove();
};


$(document).ready(function(){

  // width = window.screen.availWidth;
  // height = window.screen.availHeight;

  $('select').material_select();
  width = $('.map-container').width();
  height = $('.map-container').height();


  projection = d3.geo.albersUsa()
      .scale(1000);

  path = d3.geo.path()
      .projection(projection);

  svg = d3.select(".map-container")
      .append("svg")
      .attr("width", width + "px")
      .attr("height", height + "px");

  svg.insert("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "state")
      .attr("d", path);


d3.select(window).on('resize', resize);

function resize() {
    width = $('.map-container').width();
    height = $('.map-container').height();

    projection = d3.geo.albersUsa()
      .scale(width).translate([width, width/2]);

    path = d3.geo.path()
      .projection(projection);

    svg = d3.select(".map-container").append("svg")
      .attr("width", width + "px")
      .attr("height", height + "px");
  };



  // var data = [
  //   {name: 'Chicago', lat: -87.625579, long: 41.883876, numPeople: 400},
  //   {name: 'NYC', lat: -74.0059, long: 40.748817, numPeople: 30},
  //   {name: 'Rando', lat: -79.0059, long: 40.748817, numPeople: 20}
  // ];

// projectData(data);


  // setTimeout(function(){

     $('.generate-data').on('click', function(evt) {
          data = [];

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

            	for (var i = 0; i < d.length; i++) {
            		latitude = d[i].lat;
            		longitude = d[i].long;
            		city = d[i].city_state;
            		var arrested = d[i].num_arrested;
            		data.push({name: city, lat: latitude, long: longitude, numPeople: arrested});
            	};

              // longitude = d.features[3].geometry.coordinates[0];
              // latitude = d.features[3].geometry.coordinates[1];
              // city = d.features[3].properties.title;
              // descrip = d.features[3].properties.description;
              // data.push({name: city, lat: longitude, long: latitude, numPeople: 400});

              // console.log(longitude, latitude, city, descrip);
              console.log(d);
              projectData(data);

            }
          });
        });

    // var data = [
    //   {name: 'NYC', lat: -75.0059, long: 41.748817, numPeople: 60}
    // ];

//     projectData(data);

//   }, 5000);

	$('.find_year').on('click', function(evt) {
		evt.preventDefault();

          data = [];
          var year = $('.year_data').val();

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

            	for (var i = 0; i < d.length; i++) {

            		if (d[i].year == year) {
	            		latitude = d[i].lat;
	            		longitude = d[i].long;
	            		city = d[i].city_state;
	            		var arrested = d[i].num_arrested;
	            		data.push({name: city, lat: latitude, long: longitude, numPeople: arrested});
	            	} else {
	            		console.log("This event happened in " + d[i].year + ", which was not part of your search.");
	            	}

            	};

              console.log(d);
              projectData(data);

            }
          });
        });


});
