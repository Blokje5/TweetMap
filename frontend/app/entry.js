const d3 = require('d3');
const eulerAngles = require('./math.js');
const io = require('socket.io-client');

let projection = d3.geoAzimuthalEqualArea()
    .scale(341 / Math.PI * 2)
    .center([0, 0])
    .clipAngle(90)
    .translate([640, 400]);

 let pointProjection = d3.geoAzimuthalEqualArea()
    .scale(340 / Math.PI * 2)
    .center([0, 0])
    .clipAngle(90)
    .translate([640, 400]);

let path = d3.geoPath()
    .projection(projection);

let pointPath = d3.geoPath()
    .projection(pointProjection);

let svg = d3.select('#worldMap').append('svg')
    .attr('width', 1280)
    .attr('height', 800);

let g = svg.append('g');

d3.json('http://mbostock.github.io/d3/talk/20111018/world-countries.json', function(collection) {
    console.log(collection);
  let p = g.selectAll('path')
      .data(collection.features)
      .enter()
      .append('svg:path')
      .attr('d', path)
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged));

  p.append('svg:title')
      .text((d) => {
          return d.properties.name;
        });
});

let gpos0;

/**
 * Define starting point
 */
function dragstarted() {
    gpos0 = projection.invert(d3.mouse(this));
}
/**
 * On drag rerotate projection
 */
function dragged() {
    const gpos1 = projection.invert(d3.mouse(this));
    const o0 = projection.rotate();
    const o1 = eulerAngles(gpos0, gpos1, o0);
    projection.rotate(o1);
    svg.selectAll('path').attr('d', path);
}

const g2 = svg.append('g');
/**
 * render points for the locations of the tweets
 * @param {*} tweetData array with [lng, lat] arrays of tweets
 */
function renderTweets(tweetData) {
        let points = g2.selectAll('path')
            .data(tweetData);
        let removedPoints = points.exit()
            .remove()
            
        let addedPoints = points.enter()
            .append('svg:path')
            .attr('d', pointPath)
            .attr('fill', 'red');
}

// io connetion
/**
 * Generates the url for the socket connection 
 * @param {string} text - channel to follow
 */
function generateSocketURL(text) {
    return `/tweet?channel=${text}`
}

let tweetData = [];
window.tweetSocket = null;

function setupSocket(text, tweetData) {
    // cleanup old connection
    if(window.tweetSocket != null) {
        window.tweetSocket.disconnect();
    }

    // cleanup old tweets
    if (tweetData.length > 0) {
        tweetData = [];
        // redraw with empty dataset
        renderTweets(tweetData);
    }
    
    // generate url with token
    const url = generateSocketURL(text);
    // setup socket
    window.tweetSocket = io(url);
    window.tweetSocket.on('tweet', (tweet) => {
        console.log('received'); 
        // Limit size of tweet points
        if (tweetData.length > 500)
        {
            tweetData.shift()
        }
        tweetData.push(tweet);
        renderTweets(tweetData);
    });
}
// register event for input
document.getElementById('tweetButton').addEventListener("click", () => {
    // get channel
    const text = document.getElementById('tweetInput').value;
    if (text != '' && text != undefined) {
        setupSocket(text, tweetData);
    }

})