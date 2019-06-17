var map;
var markers = [];
var prev_infowindow =false;

function initMap() {
  var haightAshbury = {lat: 53.928365, lng: 27.685359};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: haightAshbury,
    // mapTypeId: 'terrain'
  });
  var controlDiv = document.getElementById('floating-panel');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

  map.addListener('click', function(event) {
    addMarker(event.latLng);
  });
}

  // Adds a marker to the map and push to the array.
function addMarker(location) {

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: 'Your marker',
  });

  // Form
  var formCreate =    '<form id="place" name="place" action="/place" method="post">'+
                         '<table>' +
                         '<tr><td><input type="text" name="title" id="title" placeholder="Title" maxlength = "50" size="40" autofocus=true required=true /> </td> </tr>' +
                         '<tr><td> <textarea name="description" id="description" placeholder="Description" cols="40" rows="8" maxlength = "300" required></textarea></td> </tr>' +
                         '<tr><td><input type="submit" value="Create place!" /></td></tr>' +
                         '<input type="hidden" name="coordinates" id="coordinates" value="'+location+'"></form>';


  var stub = 'CoOL! You are my hero'
  // Content for popup
  infowindowCreate = new google.maps.InfoWindow({
    content: formCreate
  });

  infowindowView = new google.maps.InfoWindow({
    content: stub
  });

  if( prev_infowindow ) {
    prev_infowindow.close();
  }
  prev_infowindow = infowindowCreate;
  infowindowCreate.open(map, marker);

  markers.push(marker);
  // Lestclick open popup
  marker.addListener('click', function() {
    // Close popup if opened new popup
    if( prev_infowindow ) {
      prev_infowindow.close();
    }
    prev_infowindow = infowindowView;
    infowindowView.open(map, marker);
  });

  // Rightclick close popup
  marker.addListener('rightclick', function() {
    prev_infowindow.close();
  });

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  prev_infowindow.close();
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}
