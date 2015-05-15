// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



var app = app || {};

// var width, height, projection, path, svg;

app.width;
app.height;
app.projection;
app.path;
app.svg;
app.data;
app.projectData = function projectData(data){
// function projectData(data){

  app.svg.selectAll("circle")
    .data(app.data)
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


  app.svg.selectAll("circle")
  .data(app.data)
  .attr("r", 5)
  .attr("transform", function(d) {return "translate(" + app.projection([d.lat,d.long]) + ")";})
  .transition()
    .duration(4000)
    .delay(1000)
    .attr("r", function(d){ if(d.numPeople > 5000) { return d.numPeople/80 } else { return d.numPeople/30 + 10}})
    .attr("fill", 'rgba(215, 233, 68, 0.5)');


  app.svg.selectAll("circle")
    .data(data)
    .exit()
    .remove();
};


function loadAjax(){
  app.data = [];

  $.ajax({
    method: 'get',
    url: '/api/riots',
    success: function(d) {

       for (var i = 0; i < d.length; i++) {
          var latitude = d[i].lat;
          var longitude = d[i].long;
          var city = d[i].city_state;
          var arrested = d[i].num_arrested;
          var injured = d[i].injuries;
          var description = d[i].description_short;
          app.data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, injuries: injured, description_short: description });
        };
      app.projectData(app.data);
    }
  })
}


$(document).ready(function(){

  // setTimeout(function(){
  //   loadAjax();
  // }, 8000);

  // width = window.screen.availWidth;
  // height = window.screen.availHeight;


  app.width = window.innerWidth;
  app.height = window.innerHeight;

  var scale = app.width;
  var offset = [app.width/2, app.height/2];

  //---------------------------

  app.projection = d3.geo.albersUsa()
      .scale(scale).translate(offset);

  app.path = d3.geo.path()
      .projection(app.projection);

//---------------------------
  app.svg = d3.select(".map-container")
      .append("svg")
      .attr("width", app.width + "px")
      .attr("height", app.height + "px");

  app.svg.insert("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", app.path);

  app.svg.insert("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "state")
      .attr("d", app.path);


//=============================================
//    R E S I Z E     F U N C T I O N
//=============================================

d3.select(window).on('resize', app.resize);

app.resize = function resize() {

//   $('.map-container').bind('resize', function(e)
// {
//   console.log('window resized..');
//   this.location.reload(false); /* false to get page from cache */
//   /* true to fetch page from server */
// });


  d3.select('.map-container').selectAll('svg').remove();
  d3.select('.map-container').selectAll('path').remove();
  d3.select('.map-container').selectAll('circle').remove();


  app.width = (window.innerWidth);
  app.height = (window.innerHeight);

  var scale = app.width;
  var offset = [app.width/2, app.height/2];

  app.projection = d3.geo.albersUsa()
      .scale(scale).translate(offset);

  app.path = d3.geo.path()
      .projection(app.projection);

  app.svg = d3.select(".map-container")
      .append("svg")
      .attr("width", app.width + 'px')
      .attr("height", app.height +'px');

  app.svg.insert("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", app.path);

  app.svg.insert("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "state")
      .attr("d", app.path);

      loadAjax();

  };


     $('.generate-data').on('click', function(evt) {
          app.data = [];

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

            	for (var i = 0; i < d.length; i++) {
            		var latitude = d[i].lat;
            		var longitude = d[i].long;
            		var city = d[i].city_state;
            		var arrested = d[i].num_arrested;
                var injured = d[i].injuries;
                var description = d[i].description_short;
            		app.data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, injuries: injured, description_short: description });
            	};

              // longitude = d.features[3].geometry.coordinates[0];
              // latitude = d.features[3].geometry.coordinates[1];
              // city = d.features[3].properties.title;
              // descrip = d.features[3].properties.description;
              // data.push({name: city, lat: longitude, long: latitude, numPeople: 400});

              console.log(d);
              app.projectData(app.data);

            }
          });
        });

	$('.find_year').on('click', function(evt) {
		evt.preventDefault();

          app.data = [];
          var year = $('.year_data').val();

          $.ajax({
            method: 'get',
            url: "/api/riots",
            success: function(d){

            	for (var i = 0; i < d.length; i++){

            		if(d[i].year == year) {
	            		var latitude = d[i].lat;
	            		var longitude = d[i].long;
	            		var city = d[i].city_state;
	            		var arrested = d[i].num_arrested;
                  var descrip = d[i].description_short;
	            		app.data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, description_short: descrip});
	            	} else {
	            		console.log("nay");
	            	}
              };

              console.log(d);
              app.projectData(app.data);

          }
        })
      });


  $('.submit_display').on('click', function(evt) {
    evt.preventDefault();


          app.data = [];
          app.beforeYear = $('.before_year').val();
          app.afterYear = $('.after_year').val();


          $.ajax({
            method: 'get',
            url: "/api/search",
            data: {before_year: app.beforeYear, after_year: app.afterYear},
            success: function(d){

              for (var i = 0; i < d.length; i++){
                  var latitude = d[i].lat;
                  var longitude = d[i].long;
                  var city = d[i].city_state;
                  var arrested = d[i].num_arrested;
                  var descrip = d[i].description_short;
                  app.data.push({name: city, lat: latitude, long: longitude, numPeople: arrested, description_short: descrip});
              };

              app.projectData(app.data);


          }
        })
      });



});
