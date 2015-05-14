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
    .attr("stroke", "rgb(4, 5, 82)")
    .attr("stroke-width", 2)
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


    function click(){

      var dataset = d3.select(this)[0][0].__data__;

      var container = d3.select(".data-container1");
      var container2 = d3.select(".data-container2");
      container.selectAll('div').remove();
      container2.selectAll('p').remove();

      var bar = container.append("div")
          .transition()
          .style("fill", "red")
          .duration(1000)
          .attr("class", "data-points")
          .attr("height", function(){if(dataset.numPeople) {dataset.numPeople.to_i/10 + 10} else{return 20}})
          .attr("width", 100)
          .text(" - - - Arrested: " + dataset.numPeople);

      var cityname = container2.append("p")
          .text(dataset.name); 

      var desc = container2.append("p")
          .text(dataset.description_short);
  
    }


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


function loadAjax(){
  data = [];

  $.ajax({
    method: 'get',
    url: '/api/riots',
    success: function(d) {

       for (var i = 0; i < d.length; i++) {
          latitude = d[i].lat;
          longitude = d[i].long;
          city = d[i].city_state;
          var arrested = d[i].num_arrested;
          var injured = d[i].injuries;
          var description = d[i].description_short;
          data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, injuries: injured, description_short: description });
        };
      projectData(data);
    }
  })
}


$(document).ready(function(){

  setTimeout(function(){
    loadAjax();
  }, 8000);

  // width = window.screen.availWidth;
  // height = window.screen.availHeight;

  $('select').material_select();
  width = window.screen.availWidth;
  height = window.screen.availHeight;


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

  d3.select('.map-container').selectAll('svg').remove();

  width = window.screen.availWidth;
  height = window.screen.availHeight;
 

  projection = d3.geo.albersUsa()
      .scale(width);

  path = d3.geo.path()
      .projection(projection);

  svg = d3.select(".map-container")
      .append("svg")
      .attr("width", width + "px")
      .attr("height", width/2 + "px");

  svg.insert("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "state")
      .attr("d", path);
   
  };


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
                var injured = d[i].injuries;
                var description = d[i].description_short;
            		data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, injuries: injured, description_short: description });
            	};

              // longitude = d.features[3].geometry.coordinates[0];
              // latitude = d.features[3].geometry.coordinates[1];
              // city = d.features[3].properties.title;
              // descrip = d.features[3].properties.description;
              // data.push({name: city, lat: longitude, long: latitude, numPeople: 400});

              console.log(d);
              projectData(data);

            }
          });
        });

	$('.find_year').on('click', function(evt) {
		evt.preventDefault();

          data = [];
          var year = $('.year_data').val();

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

            	for (var i = 0; i < d.length; i++){
               
            		if(d[i].year == year) {
	            		latitude = d[i].lat;
	            		longitude = d[i].long;
	            		city = d[i].city_state;
	            		var arrested = d[i].num_arrested;
                  var descrip = d[i].description_short;
	            		data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, description_short: descrip});
	            	} else { 
	            		console.log("nay");
	            	}
              };

              console.log(d);
              projectData(data);

          }
        })
      });


  $('.submit_before_year').on('click', function(evt) {
    evt.preventDefault();

          data = [];
          var year = $('.before_year').val();

          $.ajax({
            method: 'get',
            url: "/api/search",
            data: {before_year: year},
            success: function(d){

              for (var i = 0; i < d.length; i++){
               
                if(d[i].year == year) {
                  latitude = d[i].lat;
                  longitude = d[i].long;
                  city = d[i].city_state;
                  var arrested = d[i].num_arrested;
                  var descrip = d[i].description_short;
                  data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, description_short: descrip});
                } else { 
                  console.log("nay");
                }
              };

              console.log(d);
              projectData(data);

          }
        })
      });



});
