const TwitterStreamChannels = require('twitter-stream-channels');
const credentials = require(global.__base + 'config.json');
const locationFinder = require(global.__base + 'twitter-connector/tweet-location-finder.js')

const client = new TwitterStreamChannels(credentials);


const channels = {
    // "languages" : ['javascript','php','java','python','perl'],
    // "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    // "web" : ['javascript','nodejs','html5','css','angularjs']
    "politics": ['Donald Trump']
};
const stream = client.streamChannels({track:channels});

stream.on('channels', (tweet) => {
  locationFinder(tweet, (coordinates) => console.log(coordinates))
})

module.exports = {}

