import locService from './services/loc.service.js'
import mapService from './services/map.service.js'

const coordKey = 'AIzaSyDB9ee7mbpGYRZNjW_fYL08hlIrLKuQcrg';

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    var urlParams = new URLSearchParams(window.location.search);
    var lat = +urlParams.get('lat');
    var lng = +urlParams.get('lng');
    if (!lat) {
        lat = 32.0749831;
        lng = 34.9120554;
    }

    mapService.initMap(lat,lng)
    getAddressByCoords(lat, lng);
    updateWeather(lat, lng);

    var elBtnMyLoction = document.getElementById('btn-my-location');
    elBtnMyLoction.addEventListener('click', ev => myLocation());

    var elBtn = document.getElementById('btn-location');
    var searchPlace = document.getElementById('search-line');
    elBtn.addEventListener('click', ev => getMapByAddress(searchPlace.value));
}

function getAddressByCoords(lat, lng) {
    var prm = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${coordKey}&language=en`)
    prm.then(function (res) {
        var prmJson = res.json();
        prmJson.then(function(data) {
            var loc = data.results[4].formatted_address;
            document.getElementById('show-location').innerHTML = loc;
            document.getElementById('modal-location').innerHTML = loc;      //modal weather
        })
    })
}

function myLocation () {
    locService.getPosition()
    .then(data => {
        var coords = data.coords;
        var lat = coords.latitude;
        var lng = coords.longitude;
        getAddressByCoords(lat, lng);
        mapService.initMap(lat, lng, 15).then(locate => mapService.addMarker({ lat: lat, lng: lng }))
        updateWeather(lat, lng);
        
        var elBtn = document.getElementById('btn-copy-location');
        elBtn.addEventListener('click', ev => copyAddress(lat, lng));
    }).catch(() => {
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
}

function getMapByAddress(place) {
    var prm = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${coordKey}&language=en`)
    prm.then(function (res) {
        var prmJson = res.json();
        prmJson.then(function(data) {
            var coords = data.results[0].geometry.location;
            var fullLoc = data.results[0].formatted_address;
            var lat = coords.lat;
            var lng = coords.lng; 
            mapService.initMap(lat, lng, 12).then(locate => mapService.addMarker({ lat: lat, lng: lng }))
            updateWeather(lat, lng)
            document.getElementById('show-location').innerHTML = fullLoc;
            document.getElementById('modal-location').innerHTML = fullLoc;

            var elBtn = document.getElementById('btn-copy-location');
            elBtn.addEventListener('click', ev => copyAddress(lat, lng));
        })
    })
}

function updateWeather(lat, lng) {
    mapService.loadWeather(lat, lng).then(function (res) {
        renderWeather(res.data, res.icon)
    });
}

function renderWeather(data, icon)  {
    var icon = `https://openweathermap.org/img/w/${icon}.png`;
    document.getElementById('weather-icon').src = icon;
    
    var countryCode = data.sys.country;
    var code = `https://www.countryflags.io/${countryCode}/flat/64.png`;
    document.getElementById('flag').src = code;
    
    var weather = data.main;
    var [temp, tempMin, tempMax, humidity, wind, desc] = [weather.temp, weather.temp_min, weather.temp_max, weather.humidity, data.wind.speed, data.weather[0].description]
    
    var strHtmls = `:  ${desc}`;
    document.getElementById('desc').innerHTML = strHtmls;

    temp = Math.round(temp);
    var strHtmls = `${temp}𝇈c `;
    document.getElementById('temp').innerHTML = strHtmls;

    var strHtmls = `temparature from ${tempMin}𝇈c to ${tempMax}𝇈c`;
    document.getElementById('temp-range').innerHTML = strHtmls;

    wind = Math.round(wind * 3600/1000);
    var strHtmls = `wind ${wind} km/h`;
    document.getElementById('wind').innerHTML = strHtmls;
    
    var strHtmls = `humidity: ${humidity}%`;
    document.getElementById('humidity').innerHTML = strHtmls;
}

function copyAddress(lat, lng) {
    var address = ` https://adi-gonnen.github.io/travel-tip/?lat=${lat}&lng=${lng}`;
    var el = document.createElement('textarea');
    el.value = address;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

