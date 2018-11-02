
var map;
const weatherKey = '3a6dd853fd1a36c4169866cadc5719d1';
const API_KEY = 'AIzaSyBH4Tt6Jy79ipq6OIt3u9sLxuX3dSyaLH0';

function initMap(lat, lng, zoom = 15) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: zoom
                })
        })
}

var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        icon: './img/map-marker.png',
        map: map,
        title: 'Your Location'
    });
    return marker;
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function loadWeather(lat, lon) {
    var prmWeather = fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&APPID=${weatherKey}`);
     return prmWeather.then(function(res){
        return res.json().then(function(data) {
            return {data:data, icon: data.weather[0].icon};
        }).catch (console.log('no weather to display'));
    })
}

export default {
    initMap,
    addMarker,
    loadWeather
}
