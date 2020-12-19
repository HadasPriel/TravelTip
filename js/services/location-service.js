import { utilService } from './utils-service.js'

export const locationService = {
    getLocations,
    addLocation,
    getCoords
}

const KEY = 'locationsKey'

const gLocations = [
    //     {
    //     lat: 17,
    //     lng: 19,
    //     name: 'Puki Home'
    // }
];

function getLocations() {
    return Promise.resolve(gLocations)
}

var gLocIdx = 1

function _createLocation(name, lat, lng) {

    let location = {
        id: gLocIdx++,
        name: name,
        lat: lat,
        lng: lng,
        createdAt: Date.now(),
        updatedAt: Date.now(),

    }
    const prmAddress = getAddress(lat, lng)
        .then(address => {
            location.address = address
            console.log(location.address);
        })
        .catch(err => { console.log('err: ', err); })

    const prmWeather = getWeather(lat, lng).then(weather => {
        location.weather = weather
    })

    Promise.all([prmAddress, prmWeather])
        .then(() => {
            gLocations.push(location)
            utilService.saveToStorage(KEY, gLocations)
            console.log(gLocations)
        })
        .catch(err => { console.log('err: ', err); })
}

function addLocation(name, lat, lng) {
    _createLocation(name, lat, lng)
    console.log('gLocations', gLocations);
}

function getAddress(lat, lng) {
    const apiKey = 'AIzaSyCuux99t7oaSByMfS8aqcymt_TZuBWYda0'
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    return axios.get(url)
        .then(res => res.data)

    .then(data => {
        console.log(data)
        return data.results[0].formatted_address
    })

}


function getWeather(lat, lng) {

    const apiKey = '69bf369a618f32fad78ec068f20acb8e'
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    return axios.get(url)
        .then(res => res.data)

}


function getCoords(address) {
    let searchAddress = address.split(' ').join('+')
    const apiKey = 'AIzaSyCuux99t7oaSByMfS8aqcymt_TZuBWYda0'
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchAddress}&key=${apiKey}`
    return axios.get(url)
        .then(res => res.data)

    .then(data => {
        console.log(data.results[0].geometry.location)
        return data.results[0].geometry.location
    })
}