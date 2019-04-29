function getLoop() {

    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(mymap);
    L.control.zoom({ position: 'topright' }).addTo(mymap);
    L.control.locate({ position: 'bottomright' }).addTo(mymap);

    var address = document.getElementById("address").value;

    const positioncall = new XMLHttpRequest();
    const positionurl = 'https://nominatim.openstreetmap.org/search?format=json&q='+address;
    positioncall.open("GET", positionurl);
    positioncall.send();
    positioncall.onreadystatechange = (e) => {
        var res = JSON.parse(positioncall.responseText);
        console.log(res[0])
    }
    /*
    var distance = document.getElementById("distance").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;

    const loopcall = new XMLHttpRequest();
    const loopurl = 'http://127.0.0.1:4567/loop/' + latitude + '/' + longitude + '/' + distance;
    loopcall.open("GET", loopurl);
    loopcall.send();
    loopcall.onreadystatechange = (e) => {
        var res = JSON.parse(loopcall.responseText);
        var points = res.points;
        L.marker(points[0]).addTo(mymap);
        L.marker(points[points.length - 1]).addTo(mymap);
        var polyline = L.polyline(points, { color: 'blue' }).addTo(mymap);
        mymap.fitBounds(polyline.getBounds());
    }
    */
}

var latlon = [48.4085 ,-4.5284];
var mymap = L.map('mapid', { zoomControl: false }).setView(latlon, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
}).addTo(mymap);
L.control.zoom({ position: 'topright' }).addTo(mymap);
L.control.locate({ position: 'bottomright' }).addTo(mymap);



document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});


