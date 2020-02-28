(function() {
  document.addEventListener("turbolinks:load", function() {
    if (document.getElementById("static_map"))
    {
      static_map = new google.maps.Map(document.getElementById("static_map"), {
        zoom: 10,
        center: new google.maps.LatLng(53.928365, 27.685359),
        mapTypeId: 'satellite'
      });
    }
  });
})();
