
var map;
const weatherKey = '3a6dd853fd1a36c4169866cadc5719d1';
const API_KEY = 'AIzaSyBH4Tt6Jy79ipq6OIt3u9sLxuX3dSyaLH0';

function initMap(lat, lng, zoom = 15) {
    // console.log('lat: ', lat, 'lng: ', lng);
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: zoom
                })
            console.log('Map!', map);
        })
}

// console.log('iconBase', iconBase);
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
// var icons = {
//   parking: {
//     icon: iconBase + 'parking_lot_maps.png'
//   },
//   library: {
//     icon: iconBase + 'library_maps.png'
//   },
//   info: {
//     icon: iconBase + 'info-i_maps.png'
//   }
// };
function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        // icon: './img/flag-Map-marker.jpg',
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
    // console.log(lat, lon);
    var prmWeather = fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&APPID=${weatherKey}`);
     return prmWeather.then(function(res){
        return res.json().then(function(data) {
            return {data:data, icon: data.weather[0].icon};
            // console.log('temp2: ', data);
        }).catch (console.log('no weather to display'));
    })
    // console.log('Sent the Request');
}


export default {
    initMap,
    addMarker,
    loadWeather
}
