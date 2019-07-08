(function() {

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
  var callBackContent;
  var input;
  var select;

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
      animation: google.maps.Animation.DROP,
      title: 'Your marker',
    });

    // Content for popup
    infowindow = new google.maps.InfoWindow({
      content: formCreate,
      position: location
    });
    closeAllOtherInfowindow(infowindow, marker);

    infowindow.open(map, marker);

    current_infowindow = infowindow;
    infowindows.push(infowindow);

    markers.push(marker);
    current_marker = marker;

    google.maps.event.addListener(marker,'click', function() {
      if (callBackContent){
        current_infowindow.setContent(callBackContent);
        callBackContent = null;
      }
      current_place_id = Number(Object.keys(marker_id).find(key => marker_id[key] === marker));
      current_marker = marker;
      current_infowindow = infowindow_id[current_place_id]
      closeAllOtherInfowindow(infowindow, marker);
    });

    // Leftclick open popup
    google.maps.event.addListener(marker, 'click', infoCallbackOpen(infowindow, marker));

    google.maps.event.addListener(infowindow, 'closeclick', function(){
      if(current_infowindow.getContent() == formCreate){
        marker.setMap(null);
      }
    });

    $('#placeCreate').bind('ajax:complete', function() {
      $.ajax({
        url: '/places',
        type: 'GET',
        success: function(places) {
          places.forEach(place => {
            if (place.id > last_id) {
              last_id = place.id;
            }
          });
          setCurrentValue();
        }
      });
      createView();
      last_id = 0;
    });
  }

  function setCurrentValue(){
    current_place_id = last_id;
    current_infowindow = infowindow;
    infowindow_id[current_place_id] = current_infowindow;
    marker_id[current_place_id] = current_marker;
  }

  document.addEventListener("turbolinks:load", function initMap() {
    if (document.getElementById("map"))
    {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(53.928365, 27.685359),
        mapTypeId: google.maps.MapTypeId.HYBRID
      });
      infowindows = [];
      setAllMarkers();

      formCreate = document.getElementById('placeCreate');
      formView = document.getElementById('placeView');
      formUpdate = document.getElementById('placeUpdate');

      current_infowindow = new google.maps.InfoWindow({});

      addSearchPanel();

      document.onfullscreenchange = function(event) {
        if (map.controls[google.maps.ControlPosition.TOP_LEFT].length > 0) {
          location.reload();
        }
        else {
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(select);
        }
      }

      map.addListener('click', function(event) {
        if(formCreate){
          if (callBackContent){
            current_infowindow.setContent(callBackContent);
            callBackContent = null;
          }
          deleteMarkers();
          addMarker(event.latLng);
        }
      });
    }
  });

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
            title:  place.title
          });
          map.setCenter(marker.getPosition());

          let currentView = formView;

          currentView.getElementsByTagName('div')[0].id = place.id;
          currentView.getElementsByTagName('label')[0].textContent = place.title;
          currentView.getElementsByTagName('label')[1].textContent = place.description;
          currentView.coordinates.value = location;

          infowindow = new google.maps.InfoWindow({
            content: currentView.innerHTML,
            position: location
          });

          infowindow_id[place.id] = infowindow;
          infowindows.push(infowindow);
          current_infowindow = infowindow;
          marker_id[place.id] = marker;

          google.maps.event.addListener(marker,'click', function() {
            if (callBackContent){
              current_infowindow.setContent(callBackContent);
              callBackContent = null;
            }
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
        addMarkerPanel();
      }
    });
  }

  function addMarkerPanel(){
    select = document.getElementById('selectPlace');
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(select);
    changeSelectOptions();
    select.addEventListener('click', function (e) {
      for (var i = 0; i < infowindows.length; i++) {
        var current_id = $(infowindows[i].content)[3].id;
        if (e.target.value == current_id) {
          map.setCenter(infowindows[i].getPosition());
          var marker = marker_id[Number(current_id)];
          closeAllOtherInfowindow(infowindows[i], marker);
          infowindows[i].open(map,marker);
        }
      }
    });
  }

  function changeSelectOptions(){
    $("#selectPlace").empty();
    $('#selectPlace').append($('<option>', {
        text : 'Custom places'
    }));
    $.each(infowindows, function (i) {
      var current_title = $(infowindows[i].content)[3].getElementsByClassName('title')[0].innerText;
      var current_id = $(infowindows[i].content)[3].id;
      $('#selectPlace').append($('<option>', {
          value: current_id,
          text : current_title
      }));
    });
  }

  function addSearchPanel(){
    input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      })
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
    changeSelectOptions();
  }

  function deletePlace() {
    $.ajax( {
      type: 'DELETE',
      url: '/places/'+current_place_id,
      headers : { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      data: {id: current_place_id},
      success: function(){
         current_marker.setMap(null);
         infowindows = infowindows.filter(val => val !== current_infowindow);
         changeSelectOptions();
      }
    });
  }

  function updatePlace() {
    title = event.currentTarget.all.title[0].innerText;
    description = event.currentTarget.all.description[0].innerText;

    callBackContent = current_infowindow.getContent();
    formUpdate.title.attributes[0].value = title;
    formUpdate.description.innerHTML = description;

    current_infowindow.setContent(formUpdate.innerHTML);
    current_infowindow.open(map, current_marker);

    google.maps.event.addListener(current_infowindow, 'closeclick', function(){
      if (callBackContent){
        current_infowindow.setContent(callBackContent);
        callBackContent = null;
      }
      current_infowindow.close();
    });
  }

  function submitUpdateForm() {
    let id = current_place_id;

    formView.getElementsByTagName('label')[0].textContent = title;
    formView.getElementsByTagName('label')[1].textContent = description;

    $.ajax({
      type: 'PATCH',
      url: '/places/' + id,
      headers : {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      data: { title: title, description: description },
      success: function(){
        infowindows = infowindows.filter(val => val !== current_infowindow);
        current_infowindow.setContent(formView.innerHTML);
        infowindows.push(current_infowindow);
        changeSelectOptions();
      }
    });
  }

  $(document).on( 'click', '#btn-del', function() {
    deletePlace();
  });

  $(document).on( 'click', '#btn-upd', function() {
    updatePlace();
  });

  $(document).on( 'click', '#btn-create', function() {
    var description_form = document.getElementById('description').value;
    if(!description_form.match(/.*\S+.*/)){
      document.getElementById('description').value = '';
    }
  });

  $(document).on( 'click', '#btn-upd-conf', function() {

    title  = document.getElementById('title-conf').value;
    description  = document.getElementById('description-conf').value;

    document.getElementById('title-conf').value = document.getElementById('title-conf').value.replace(/\s+/g, '');
    document.getElementById('description-conf').value = document.getElementById('description-conf').value.replace(/\s+/g, '');

    var title_form = $('#title-conf')[0];
    var description_form = $('#description-conf')[0]

    if (title_form.checkValidity() && description_form.checkValidity()) {
      submitUpdateForm();
    }else {
      description_form.reportValidity();
      title_form.reportValidity();
    }
  });
})();
