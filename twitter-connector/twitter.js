const TwitterStreamChannels = require('twitter-stream-channels');
const credentials = require(global.__base + 'config.json');
const locationFinder = require(global.__base + 'twitter-connector/tweet-location-finder.js')

const client = new TwitterStreamChannels(credentials);

class TwitterChannel {
  constructor(client, channels) {
    this.client = client
    this.channels = channels
  }

  createStream(callback) {
    const stream = client.streamChannels({track:this.channels});

    stream.on('channels', (tweet) => {
      locationFinder(tweet, (coordinates) => {
        callback(coordinates)
      })
    })

    stream.on('error', (error) => {
      console.log(error);
    })
  }
}
const channels = {
    // "languages" : ['javascript','php','java','python','perl'],
    // "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    // "web" : ['javascript','nodejs','html5','css','angularjs']
    "politics": ['Donald Trump']
};

module.exports = new TwitterChannel(client, channels);

