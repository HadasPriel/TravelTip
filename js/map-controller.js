import { locationService } from './services/location-service.js'


// console.log('locationService', locationService);

var gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            getUserPosition()
                .then(pos => {
                    console.log('pos:', pos);
                    locationService.addLocation('You are here', pos.coords.latitude, pos.coords.longitude)
                    panTo(pos.coords.latitude, pos.coords.longitude)
                })
                .then(() => renderUserPlaces())
                .catch(err => {
                    console.log('err!!!', err);
                })
        })
        .catch(console.log('INIT MAP ERROR'));

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })

    document.querySelector('.btn-go-to-location').addEventListener('click', (ev) => {

        const userPos = document.querySelector('.user-input').value
        locationService.getCoords(userPos)
            .then(data => panTo(data.lat, data.lng))
    })


    document.querySelector('.btn-go-to-my-location').addEventListener('click', () => {

        getUserPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                panTo(pos.coords.latitude, pos.coords.longitude)
            })
            .catch(err => {
                console.log('err!!!', err);
            })

    })



}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', gGoogleMap);

            gGoogleMap.addListener('click', (event) => {
                console.log(event);
                let lat = event.latLng.lat()
                let lng = event.latLng.lng()
                var locationName = prompt('Enter location name')
                locationService.addLocation(locationName, lat, lng)

                renderUserPlaces()
            })
        })

}


function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = ''; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function renderUserPlaces() {
    locationService.getLocations()
        .then(locations => {
            console.log(locations);
            if (locations.length === 0) return
            document.querySelector('.user-places').hidden = false
            let strHTMLs = locations.map((location) => {
                console.log(location.createdAt);
                return `
            <tr>
                <td class="table-cell">${location.name}</td>
                <td class="table-cell">${location.createdAt}</td>
                <td class="table-cell">${location.address}</td>
                <td class="table-cell"> <button  class="goTo-btn" onclick="onGoToPlace(${location.lat},${location.lng})"> Go there </button> 
                 <button  class="delete-btn" onclick="onDeletePlace('${location.id}')"> Delete </button> </td>
            </tr>
        `
            })
            document.querySelector('.user-locations').innerHTML = strHTMLs.join('')
        })
}