var map;
var markers = [];

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

  markers.push(marker);

  // Lestclick open popup
  google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));
  // Rightclick close popup
  google.maps.event.addListener(marker, 'rightclick', infoCallbackClose(infowindow, marker));

  google.maps.event.addListener(infowindow, 'closeclick', function(){
    if (infowindow.getContent() == formCreate){
      marker.setMap(null);
    }
  });
}

function initMap() {
  var haightAshbury = {lat: 53.928365, lng: 27.685359};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: haightAshbury,
    // mapTypeId: 'terrain'
  });

  map.addListener('click', function(event) {
    addMarker(event.latLng);
  });
}

function updateContent(){

  var formView =  '<div id="content">'+
                  '<h1 id="firstHeading" class="firstHeading">"'+title+'"</h1>'+
                  '<div id="bodyContent">'+
                  '<p><b>"'+description+'"</b></p>'+
                  '</div>';
  infowindow.setContent(formView);
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
}
