var map;
var markers = [];
var infowindows = [];

var title;
var description;
var coordinates;
var infowindow;
var formCreate;
var formView;
var formUpdate;
var current_place_id;
var current_marker;
var current_infowindow;
var infowindow_id = {};
var marker_id = {};
var last_id = 0;

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
  formCreate.reset();
  formCreate.coordinates.value = location;
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    // draggable: true,
    animation: google.maps.Animation.DROP,
    title: 'Your marker',
  });

  // Content for popup
  infowindow = new google.maps.InfoWindow({
    content: formCreate
  });
  closeAllOtherInfowindow(infowindow, marker);

  infowindow.open(map, marker);

  current_infowindow = infowindow;
  infowindows.push(infowindow);

  markers.push(marker);
  current_marker = marker;

  google.maps.event.addListener(marker,'click', function() {
    current_place_id = Number(Object.keys(marker_id).find(key => marker_id[key] === marker));
    current_marker = marker;
    current_infowindow = infowindow_id[current_place_id]
    closeAllOtherInfowindow(infowindow, marker);
    deleteMarkers();
  });

  // Leftclick open popup
  google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));

  google.maps.event.addListener(infowindow, 'closeclick', function(){
    if(current_infowindow.getContent() == formCreate){
      marker.setMap(null);
    }
  });

  $('#placeCreate').bind('ajax:complete', function() {
    if (last_id == 0) {
      $.ajax({
        url: '/places',
        type: 'GET',
        success: function(places) {
          places.forEach(place => {
            last_id = place.id;
            setCurrentValue();
          });
        }
      });
    } else {
      last_id++;
      setCurrentValue();
    }
    createView();
  });
}

function setCurrentValue(){
  current_place_id = last_id;
  current_infowindow = infowindow;
  infowindow_id[current_place_id] = current_infowindow;
  marker_id[current_place_id] = current_marker;
}

function initMap() {
  var haightAshbury = {lat: 53.928365, lng: 27.685359};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: haightAshbury,
    // mapTypeId: 'terrain'

  });

  setAllMarkers();

  formCreate = document.getElementById('placeCreate');
  formView = document.getElementById('placeView');
  formUpdate = document.getElementById('placeUpdate');

  current_infowindow = new google.maps.InfoWindow({});

  map.addListener('click', function(event) {
    deleteMarkers();
    addMarker(event.latLng);
  });
}

function setAllMarkers(){
  $.ajax({
    url: '/places',
    type: 'GET',
    success: function(places) {
      places.forEach(place => {
        var location = {lat: place.coordinates.x, lng: place.coordinates.y};
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          // draggable: true,
          title:  place.title
        });
        if (place.id > last_id) {
          last_id = place.id;
        }

        let currentView = formView;

        currentView.getElementsByTagName('div')[0].id = place.id;
        currentView.getElementsByTagName('label')[0].textContent = place.title;
        currentView.getElementsByTagName('label')[1].textContent = place.description;
        currentView.coordinates.value = location;

        infowindow = new google.maps.InfoWindow({
          content: currentView.innerHTML
        });

        infowindow_id[place.id] = infowindow;
        infowindows.push(infowindow);
        current_infowindow = infowindow;

        google.maps.event.addListener(marker,'click', function() {
          current_place_id = place.id;
          current_marker = marker;
          current_infowindow = infowindow_id[current_place_id]
          closeAllOtherInfowindow(infowindow, marker);
          deleteMarkers();
        });

        google.maps.event.addListener(marker, 'dblclick', function() {
          map.setZoom(14);
          map.setCenter(marker.getPosition());
        });

        // Leftclick open popup
        google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));

        // Rightclick close popup
        google.maps.event.addListener(marker, 'rightclick', infoCallbackClose(infowindow, marker));

      });
    }
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

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function createView(){
  title = formCreate.title.value;
  description = formCreate.description.value;
  coordinates = formCreate.coordinates.value;
  let currentView = formView;

  currentView.getElementsByTagName('div')[0].id = current_place_id;
  currentView.getElementsByTagName('label')[0].textContent = title;
  currentView.getElementsByTagName('label')[1].textContent = description;
  currentView.coordinates.value = coordinates;

  current_infowindow.setContent(currentView.innerHTML);
  markers = markers.pop();
}

function deletePlace(){
  $.ajax({
    type: 'DELETE',
    url: '/places/'+current_place_id,
    headers : {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {id: current_place_id},
    success: current_marker.setMap(null)
  });
}

function updatePlace() {
  if (event.target.id === 'btn-upd') {
    title = event.currentTarget.childNodes[1].innerText;
    description = event.currentTarget.childNodes[4].innerText;

    formUpdate.title.attributes[0].value = title;
    formUpdate.description.innerHTML = description;

    event.currentTarget.innerHTML = formUpdate.innerHTML;

    google.maps.event.addListener(current_infowindow, 'closeclick', function(){
      current_infowindow.setContent(current_infowindow.content);
      current_infowindow.close();
    });
  }
}

function submitUpdateForm() {
  let id = current_place_id;
  title  = document.getElementById('title-conf').value;
  description  = document.getElementById('description-conf').value;

  formView.getElementsByTagName('label')[0].textContent = title;
  formView.getElementsByTagName('label')[1].textContent = description;

  $.ajax({
    type: 'PATCH',
    url: '/places/' + id,
    headers : {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: { title: title, description: description, id: id },
    success: current_infowindow.setContent(formView.innerHTML)
  });
}
