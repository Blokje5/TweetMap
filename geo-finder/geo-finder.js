const request = require('request');

class GeoFinder {
    constructor() {
        this.host = 'api.geonames.org';
    }
    
    getPath(query, fuzzy) {
        return `/searchJSON?q=${query}&maxRows=10&fuzzy=${fuzzy}&username=cs50Lennard`
    }

    async findLocation(tweet, location, callback) {
        const path = this.getPath(location, 0.8)
        request('http://' + this.host + path, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                // Always return the first result coordinates
                if(body.geonames != undefined && body.geonames.length > 0) {
                    const coordinates = [
                        body.geonames[0].lng,
                        body.geonames[0].lat
                    ]
                    const tweetObject = {
                        text: tweet.text,
                        coordinates: coordinates
                    }
                    callback(tweetObject)
                }
        })
    }
}

module.exports = new GeoFinder();