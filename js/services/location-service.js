import { utilService } from './utils-service.js'

export const locationService = {
    getLocations,
    addLocation
}

const KEY = 'locationsKey'
const KEY_ADDRESS = 'curr_address'
const gLocations = [{
    lat: 17,
    lng: 19,
    name: 'Puki Home'
}];

function getLocations() {
    return Promise.resolve(gLocations)
}

var gLocIdx

function _createLocation(name, lat, lng) {

    let location = {
        id: gLocIdx++,
        name: name,
        lat: lat,
        lng: lng,
        // weather: getWether(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        address: getAddress(lat, lng)
    }
    location.address = utilService.loadFromStorage(KEY_ADDRESS)
    console.log(location.address);
    gLocations.push(location)
    utilService.saveToStorage(KEY, gLocations)
    console.log(location.address);
}

function addLocation(name, lat, lng, weather) {
    _createLocation(name, lat, lng, weather)
}

function getAddress(lat, lng) {
    const apiKey = ''
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    return axios.get(url)
        .then(res => res.data)
        .then(data => data.results[0].formatted_address)
        .then(address => utilService.saveToStorage(KEY_ADDRESS, address))
}