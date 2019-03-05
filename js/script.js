function getLoop() {
    lat = 48.4085;
    long = -4.4984;
    dist = 10000;
    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:4567/loop/' + lat + '/' + long + '/' + dist;
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

var mymap = L.map('mapid').setView([48.4085,-4.4984], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmQ0cGEiLCJhIjoiY2l5Z2sza3o0MDAyNDJxbjQ3emd0M3BybSJ9.Ct2aqSecQmdDkHw_qrtKxA', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});


