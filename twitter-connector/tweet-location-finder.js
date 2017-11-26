const geoFinder = require(global.__base + 'geo-finder/geo-finder.js')
const math = require('mathjs')


function boundingBoxCenter(boundingBox) {
    // https://stackoverflow.com/questions/34549767/how-to-calculate-the-center-of-the-bounding-box
    let x,y,z = 0;
    boundingBox.forEach((coordinate) => {
        // Twitter bounding box contains arrays with [longitude, langitude] data
        const lng = coordinate[0];
        const lat = coordinate[1];
        x += math.cos(lng) * math.cos(lat);
        y += math.cos(lng) * math.cos(lat);
        z += math.sin(lat);
    })

    x = x/boundingBox.length
    y = y/boundingBox.length
    z = z/boundingBox.length

    return {
        lng: math.atan2(z, math.sqrt(x * x + y * y)),
        lat: math.atan2(y, x)
    };
}

module.exports= (tweet, callback) => {
    if(tweet.coordinates != null) {
        // if coordinates are available, tweet has geo-location
        callback(tweet.coordinates.coordinates[0]);
    }

    else if(tweet.places != null) {
        // Tweet has a place associated with it
        // calculate center of boundingBox and use that as a location
        coordinates = boundingBoxCenter(tweet.places.bounding_box.coordinates[0])
        callback(coordinates)
    }

    else if(tweet.user != null) {
        // Use the location of the user if tweet is not associated with a location
        // Use geonames api to find the location, fuzzy match to try to find best match
        geoFinder.findLocation(tweet.user.location, callback)
    }

    // sadly no known location for the user
}
