// var mapsKey = myKey.apiKey;
// backend logic goes below
var parks = [];
// grab the park.json file
$.ajax('./parks.json', {
  // data: 'parks.json',
  dataType: "jsonp",
  crossDomain: true,
  jsonpCallback: 'jsonpCallback',
  success: function(data) {
    parks = data.parks;
  }
});
var map;
// create the initial map centered over Portland
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.52, lng: -122.681944},
    zoom: 12,
    scrollwheel: false
  });
  // show the user location with blue icon
  var userIcon = new google.maps.Marker({
    map: map,
    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    title: "Your current location"
  });
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      userIcon.setPosition(pos);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, userIcon, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, userIcon, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, userIcon, pos) {
    userIcon.setPosition(pos);
    userIcon.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    }
    // create global infowindow
    var infowindow = new google.maps.InfoWindow();
    // for each park
    parks.forEach(function(park) {
      // grab content for park's infowindow
      var contentString = '<div class="info-card">' +
      '<h4 class="card-title">' + park.movieTitle + '</h4>' +
      park.movieCover +
      '<span class="label label-default">'+ park.movieYear + '</span>' +
      '<span class="label label-primary">'+ park.movieRating + '</span>' +
      '<p class="park-name">' + park.parkName + '</p>' +
      '<p>' + park.parkAddress + '</p>' +
      '<p>' + park.showDate + '</p>' +
      '</div>'
      // create cards for each park
      $('#movie-cards').append('<div class="col-sm-12 col-md-6 col-lg-3 all ' + park.quadrant + '"> <div class="card card-block"> ' + contentString + '</div></div>');

      // create marker for each park
      var marker = new google.maps.Marker({
        position: park.position,
        map: map,
        title: park.movieTitle
      });
      //Create the InfoWindow object just after we initialize the map, and then handle the click event handlers
      google.maps.event.addListener(marker, 'click', function() {
         infowindow.setContent(contentString);
         infowindow.open(map, this);
      });
      // create a new infowindow at clicked marker
      function infowindowCallback(infowindowHtml, marker) {
        return function() {
          // update the content of the infowindow before opening it
          infowindow.setContent(infowindowHtml);
          infowindow.open(map, marker);
        };
      }
    });
}
