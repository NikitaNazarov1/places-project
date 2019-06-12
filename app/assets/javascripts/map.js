function initMap(){
    var options = {
        zoom:15,
        center:{lat:53.928365, lng:27.685359}
    }

    var map = new google.maps.Map(document.getElementById('map'), options);

    google.maps.event.addListener(map, 'click', function(event){
        addMarker({coords:event.latLng});
    });


    var markers = [
        {
            coords:{lat:53.926970, lng:27.681256},
            content:'<h2>EPAM</h2>'
        },
        {
            coords:{lat:53.928365, lng:27.685359},
            content:'<h2>EPAM Office</h2>'
        }
    ];

    for(var i = 0;i < markers.length;i++){
        addMarker(markers[i]);
    }

    function addMarker(props){
        var marker = new google.maps.Marker({
            position:props.coords,
            map:map,
            //icon:props.iconImage
        });

        if(props.iconImage){
            marker.setIcon(props.iconImage);
        }

        if(props.content){
            var infoWindow = new google.maps.InfoWindow({
                content:props.content
            });

            marker.addListener('click', function(){
                infoWindow.open(map, marker);
            });
        }
    }
}