var map;
var markers = [];
var infowindows = [];

var title;
var description;
var coordinates;
var infowindow;

function infoCallbackOpen(infowindow, marker) { return function() {
  infowindow.open(map, marker); };
}

function infoCallbackClose(infowindow, marker) { return function() {
  infowindow.close(map, marker); };
}

function closeAllOtherInfowindow(infowindow, marker){
  for (var i = 0; i < infowindows.length; i++) {
    infowindows[i].close();
  }
  infoCallbackOpen(infowindow, marker)
}

  // Adds a marker to the map and push to the array.
function addMarker(location) {
  // marker.setMap(null);
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: 'Your marker',
  });
  // Form
  var formCreate = '<form id="places" name="place">'+
                    '<table>' +
                    '<tr><td><input type="text" name="title" id="title" placeholder="Title" maxlength = "50" size="40" autofocus=true required=true /> </td> </tr>' +
                    '<tr><td> <textarea name="description" id="description" placeholder="Description" cols="40" rows="8" maxlength = "300" required></textarea></td> </tr>' +
                    '<tr><td><input type="button" id="btn" value="Create place!" onclick="submitForm();" /></td></tr>' +
                    '<input type="hidden" name="coordinates" id="coordinates" value="'+location+'"></form>';


  // Content for popup
  infowindow = new google.maps.InfoWindow({
    content: formCreate
  });

  infowindow.open(map, marker);

  infowindows.push(infowindow);

  // deleteMarkers();

  markers.push(marker);

  marker.addListener('click', function() {
    map.setZoom(14);
    map.setCenter(marker.getPosition());
    closeAllOtherInfowindow(infowindow, marker);
    deleteMarkers();
  });

  // Leftclick open popup
  google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));
  // // Rightclick close popup
  // google.maps.event.addListener(marker, 'rightclick', infoCallbackClose(infowindow, marker));

  // google.maps.event.addListener(map, 'click', closeAllOtherInfowindow(map, marker));

  google.maps.event.addListener(infowindow, 'closeclick', function(){
    if(infowindow.getContent() == formCreate){
      marker.setMap(null);
    }
  });
}


function initMap() {
  var haightAshbury = {lat: 53.928365, lng: 27.685359};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: haightAshbury,
    // mapTypeId: 'terrain'

  });

  $.ajax({
    url: '/places',
    type: 'GET',
    success: function(places) {
      places.forEach(place => {
        var location = {lat: place.coordinates.x, lng: place.coordinates.y};
        // addMarker(location);
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          animation: google.maps.Animation.DROP,
          title:  place.title
        });
        var formView =  '<div id="content">'+
                        '<h1 id="firstHeading" class="firstHeading">'+place.title+'</h1>'+
                        '<div id="bodyContent">'+
                        '<p><b>'+place.description+'</b></p>'+
                        '</div>';

        infowindow = new google.maps.InfoWindow({
          content: formView
        });

        infowindows.push(infowindow);

        // markers.push(marker);

        marker.addListener('click', function() {
          map.setZoom(14);
          map.setCenter(marker.getPosition());
          closeAllOtherInfowindow(infowindow, marker);
          deleteMarkers();
        });

        // Leftclick open popup
        google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));

        // Rightclick close popup
        google.maps.event.addListener(marker, 'rightclick', infoCallbackClose(infowindow, marker));
        // google.maps.event.addListener(marker, 'click', closeAllInfowindow());

      });
    }
  });

  map.addListener('click', function(event) {
    deleteMarkers();
    addMarker(event.latLng);
  });
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}


function updateContent(){
  var formView =  '<div id="content">'+
                  '<h1 id="firstHeading" class="firstHeading">'+title+'</h1>'+
                  '<div id="bodyContent">'+
                  '<p><b>'+description+'</b></p>'+
                  '</div>';
  infowindow.setContent(formView);
  markers = markers.pop();
}

function submitForm() {
  title = document.getElementById("title").value;
  description = document.getElementById("description").value;
  coordinates = document.getElementById("coordinates").value;
  $.ajax({
    type: 'POST',
    url: '/places',
    data: { place: { title: title, description: description, coordinates: coordinates} },
    success: updateContent()
  });
  // initMap();
}

$(document).on('click', '.update', function(){
  var formView =  '<form id="places" name="place">'+
                    '<table>' +
                    '<tr><td><input value="'+ $(this).data('title') +'" type="text" name="title" id="title" placeholder="Title" maxlength = "50" size="40" autofocus=true required=true /> </td> </tr>' +
                    '<tr><td> <textarea name="description" id="description" placeholder="Description" cols="40" rows="8" maxlength = "300" required>'+  $(this).data('description') +'</textarea></td> </tr>' +
                    '<tr><td><input type="button" id="btn" value="Update place!" onclick="submitUpdateForm();" /></td></tr>' +
                    '<input type="hidden" name="id" id="id" value="'+ $(this).data('id')+'"></form>';
  infowindow.setContent(formView);
});

function submitUpdateForm() {
  title = document.getElementById("title").value;
  description = document.getElementById("description").value;
  id = document.getElementById("id").value;
  $.ajax({
    type: 'PATCH',
    url: '/places/'+id,
    data: { place: { title: title, description: description}, id: id }

  });
}
