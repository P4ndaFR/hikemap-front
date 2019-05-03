function clearMap() {
    for (i in mymap._layers) {
        if (mymap._layers[i].options.format == undefined) {
            try {
                mymap.removeLayer(mymap._layers[i]);
            } catch (e) {
                console.log("problem with " + e + mymap._layers[i]);
            }
        }
    }
}

function getLoop() {

    clearMap();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(mymap);

    var address = document.getElementById("address").value;
    address = address.replace(/ +(?= )/g,'+');
    var distance = document.getElementById("distance").value;
    var loopradio = document.getElementById('loop');
    var patrimonialradio = document.getElementById('patrimonial');
    var gpsradio = document.getElementById('gps');
    var addressradio = document.getElementById('addressradio');
    var lat,lng,stops;
    
    const positioncall = new XMLHttpRequest();
    const positionurl = 'https://nominatim.openstreetmap.org/search?format=json&q='+address;
    positioncall.open("GET", positionurl);
    positioncall.send();
    positioncall.onreadystatechange = (e) => {
        var res = JSON.parse(positioncall.responseText);
        if(gpsradio.checked) {
            lat =current_position._latlng.lat;
            lng = current_position._latlng.lng;
        }
        if(addressradio.checked){
            lat =res[0].lat;
            lng=res[0].lon;
        }
        if(loopradio.checked) {
            const loopcall = new XMLHttpRequest();
            const loopurl = 'http://127.0.0.1:4567/loop/' +lat + '/' + lng + '/' + distance;
            loopcall.open("GET", loopurl);
            loopcall.send();
            loopcall.onreadystatechange = (e) => {
                var loopres = JSON.parse(loopcall.responseText);
                var points = loopres.points;
                L.marker(points[0]).addTo(mymap);
                L.marker(points[points.length - 1]).addTo(mymap);
                var polyline = L.polyline(points, { color: 'red' }).addTo(mymap);
                mymap.fitBounds(polyline.getBounds());
            }
        }
        if(patrimonialradio.checked){
            stops = document.getElementById("stops").value;
            const loopcall = new XMLHttpRequest();
            const loopurl = 'http://127.0.0.1:4567/patrimonial/' + lat + '/' + lng + '/' + distance + '/' +stops;
            loopcall.open("GET", loopurl);
            loopcall.send();
            loopcall.onreadystatechange = (e) => {
                var loopres = JSON.parse(loopcall.responseText);
                var points = loopres.points;
                L.marker(points[0]).addTo(mymap);
                L.marker(points[points.length - 1]).addTo(mymap);
                var polyline = L.polyline(points, { color: 'red' }).addTo(mymap);
                mymap.fitBounds(polyline.getBounds());
            }
        }
    }
}

function addStopSlider(){
    div = document.getElementById('distancediv');
    div.insertAdjacentHTML('afterend', '<div id=stopsdiv> <p id="brief" >Renseignez le nombre de monument que vous voulez visiter</p><p id=stopValue>3<p><p class="range-field"><input type="range" id="stops" min="1" max="5" onchange="showStopsValue()"/></p></div>');
}

function deleteStopSlider(){
    form = document.getElementById('form');
    div = document.getElementById('stopsdiv');
    form.removeChild(div);
}

function showStopsValue(){
    document.getElementById('stopValue').innerHTML=document.getElementById("stops").value;
}

function toggleLocate(){
    if(!mustLocate){
        mymap.locate({ setView: true, maxZoom: 13});
        div = document.getElementsByClassName('fixed-action-button');
        button = document.getElementsByClassName('btn-floating');
        div[0].removeChild(button[0]);
        div[0].insertAdjacentHTML('afterbegin', '<a class="btn-floating btn-large waves-effect waves-light red" onclick="toggleLocate()"><i class="material-icons">gps_fixed</i></a>');
    }else{
        mustLocate = false
        div = document.getElementsByClassName('fixed-action-button');
        button = document.getElementsByClassName('btn-floating');
        div[0].removeChild(button[0]);
        div[0].insertAdjacentHTML('afterbegin', '<a class="btn-floating btn-large waves-effect waves-light red" onclick="toggleLocate()"><i class="material-icons">gps_not_fixed</i></a>');
    }
}

var latlon = [48.1688,-2.9059];
var mymap = L.map('mapid', { zoomControl: false }).setView(latlon, 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
}).addTo(mymap);
L.control.zoom({ position: 'topright' }).addTo(mymap);

var div,button,mustLocate;

mustLocate = false;

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    
    //var elems = document.querySelectorAll('.fixed-action-btn');
    //var instances = M.FloatingActionButton.init(elems);

});

   // placeholders for the L.marker and L.circle representing user's current position and accuracy    
   var current_position, current_accuracy;

   function onLocationFound(e) {
    mustLocate = true
     // if position defined, then remove the existing position marker and accuracy circle from the map
     if (current_position) {
         mymap.removeLayer(current_position);
         mymap.removeLayer(current_accuracy);
     }

     var radius = e.accuracy / 2;

     current_position = L.circle(e.latlng, 1, { weight: mymap.getZoom()} ).addTo(mymap);
     current_accuracy = L.circle(e.latlng, radius).addTo(mymap);

    
   }

   function onLocationError(e) {
        mustLocate = false
        div = document.getElementsByClassName('fixed-action-button');
        button = document.getElementsByClassName('btn-floating');
        div[0].removeChild(button[0]);
        div[0].insertAdjacentHTML('afterbegin', '<a class="btn-floating btn-large waves-effect waves-light red" onclick="toggleLocate()"><i class="material-icons">gps_off</i></a>');
        mymap.removeLayer(current_position);
        mymap.removeLayer(current_accuracy);
   }

   mymap.on('locationfound', onLocationFound);
   mymap.on('locationerror', onLocationError);

   // wrap map.locate in a function    
   function locate() {
       if(mustLocate){
            mymap.locate();
       }else{
            mymap.removeLayer(current_position);
            mymap.removeLayer(current_accuracy);
        }
   }

   // call locate every 100ms seconds... forever
   setInterval(locate, 100);


