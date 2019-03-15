function getLoop() {

    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmQ0cGEiLCJhIjoiY2l5Z2sza3o0MDAyNDJxbjQ3emd0M3BybSJ9.Ct2aqSecQmdDkHw_qrtKxA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    var distance = document.getElementById("distance").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;

    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:4567/loop/' + latitude + '/' + longitude + '/' + distance;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        var res = JSON.parse(Http.responseText);
        var points = res.points;
        L.marker(points[0]).addTo(mymap);
        L.marker(points[points.length - 1]).addTo(mymap);
        var polyline = L.polyline(points, { color: 'blue' }).addTo(mymap);
        mymap.fitBounds(polyline.getBounds());
    }
}

var latlon = [48.4085 ,-4.5284];
var mymap = L.map('mapid', { zoomControl: false }).setView(latlon, 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmQ0cGEiLCJhIjoiY2l5Z2sza3o0MDAyNDJxbjQ3emd0M3BybSJ9.Ct2aqSecQmdDkHw_qrtKxA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
L.control.zoom({ position: 'topright' }).addTo(mymap);
L.control.locate({ position: 'bottomright' }).addTo(mymap);



document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});


