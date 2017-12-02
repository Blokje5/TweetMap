const TwitterStreamChannels = require('twitter-stream-channels');
const credentials = require(global.__base + 'config.json');
const locationFinder = require(global.__base + 'twitter-connector/tweet-location-finder.js')

const client = new TwitterStreamChannels(credentials);

class TwitterChannel {
  constructor(client) {
    this.client = client
  }

  createStream(channels, callback) {
    console.log(channels)
    const stream = client.streamChannels({track:channels});

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

module.exports = new TwitterChannel(client);

