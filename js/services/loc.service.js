var locs = [{lat: 11.22, lng: 22.11}]


function getLocs() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(locs);
        }, 1000)
    });

}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

export default {
    getLocs :getLocs,
    getPosition: getPosition
}