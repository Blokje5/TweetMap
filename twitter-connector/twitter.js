const TwitterStreamChannels = require('twitter-stream-channels');
const credentials = require('../config.json');
console.log(credentials)
const client = new TwitterStreamChannels(credentials);


const channels = {
    // "languages" : ['javascript','php','java','python','perl'],
    // "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    // "web" : ['javascript','nodejs','html5','css','angularjs']
    "politics": ['Donald Trump']
};
const stream = client.streamChannels({track:channels});

stream.on('channels', (tweet) => {
  console.log(tweet.user.location)
  console.log(tweet.place)
})

