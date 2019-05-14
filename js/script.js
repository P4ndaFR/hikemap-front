function clearMap() {
    for (i in mymap._layers) {
        if (mymap._layers[i].options.format == undefined) {
            try {
                if(mymap._layers[i]._url == undefined) {
                    mymap.removeLayer(mymap._layers[i]);
                }
            } catch (e) {
                console.log("problem with " + e + mymap._layers[i]);
            }
        }
    }/*
    if(trace != null){
        console.log(trace)
        mymap.removeLayer(trace);
    }*/
}

function getLoop() {

    clearMap();

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
        if(positioncall.readyState == 4 && positioncall.status==200){
            if(positioncall.responseText) {
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
                    const loopurl = 'https://hikemap-api.blondeau.me/loop/' +lat + '/' + lng + '/' + distance;
                    loopcall.open("GET", loopurl);
                    loopcall.send();
                    loopcall.onreadystatechange = (e) => {
                        if(loopcall.readyState == 4 && loopcall.status==200){
                            var loopres = JSON.parse(loopcall.responseText);
                            var points = loopres.points;
                            L.marker(points[0]).addTo(mymap);
                            //L.marker(points[points.length - 1]).addTo(mymap);
                            trace = L.polyline(points, { color: 'red' }).addTo(mymap);
                            mymap.fitBounds(trace.getBounds());
                        }
                    }
                }
                if(patrimonialradio.checked) {
                    stops = document.getElementById("stops").value;
                    const loopcall = new XMLHttpRequest();
                    const loopurl = 'https://hikemap-api.blondeau.me/patrimonial/' + lat + '/' + lng + '/' + distance + '/' +stops;
                    loopcall.open("GET", loopurl);
                    loopcall.send();
                    loopcall.onreadystatechange = (e) => {
                        if(loopcall.readyState == 4 && loopcall.status==200){
                            if(loopcall.responseText) {
                                var loopres = JSON.parse(loopcall.responseText);
                                var points = loopres.points;
                                L.marker(points[0], {color: 'green' }).addTo(mymap);
                                //L.marker(points[points.length - 1]).addTo(mymap);
                                trace = L.polyline(points, { color: 'red' }).addTo(mymap);
                                if(loopres.success) {
                                    for(var j=0; j < loopres.historic_points.length; j++){
                                        var hp = L.marker([loopres.historic_points[j].lat,loopres.historic_points[j].lon]).bindPopup("placeholder").addTo(mymap);
                                        var tagobject = loopres.historic_points[j].tags;
                                        var tagsarray = Object.keys(tagobject).map(function(key){return [ key, tagobject[key] ];});
                                        tagsarray.sort();
                                        var popuptext="";
                                        for(var k = 0; k < tagsarray.length; k++){
                                            popuptext=popuptext+"<p>"+tagsarray[k][0]+" : "+tagsarray[k][1]+"</p>"
                                        }
                                        hp._popup.setContent(popuptext);
                                    }
                                }else{
                                    M.toast({html: 'Pas assez de sites patrimoniaux dans la zone de recherche'});
                                }
                                mymap.fitBounds(trace.getBounds());
                            }
                        }
                    }
                }
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
        mustLocate = true;        
    }else{
        mustLocate = false
        div = document.getElementsByClassName('fixed-action-button');
        button = document.getElementsByClassName('btn-floating');
        div[0].removeChild(button[0]);
        div[0].insertAdjacentHTML('afterbegin', '<a class="btn-floating btn-large waves-effect waves-light red" onclick="toggleLocate()"><i class="material-icons">gps_not_fixed</i></a>');
        if (current_position) {
            mymap.removeLayer(current_position);
            mymap.removeLayer(current_accuracy);
        }
    }
}
function onLocationFound(e) {
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
    if (current_position != undefined) {
        mymap.removeLayer(current_position);
        mymap.removeLayer(current_accuracy);
    }
}

function locate() {
    if(mustLocate){
         mymap.locate();
    }else{
         if (current_position != undefined) {
             mymap.removeLayer(current_position);
             mymap.removeLayer(current_accuracy);
         }
     }
}

var latlon = [48.1688,-2.9059];
var mymap = L.map('mapid', { zoomControl: false }).setView(latlon, 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
}).addTo(mymap);
L.control.zoom({ position: 'topright' }).addTo(mymap);

var div,button,mustLocate,start,stop,trace;
trace=null;

mustLocate = false;

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

var current_position, current_accuracy;
mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);
setInterval(locate, 600);


