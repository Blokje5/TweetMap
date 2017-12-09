# TweetMap

A worldmap displaying the location of tweets

# location
[Find the project on github] (https://github.com/Blokje5/TweetMap)

## installation
* git clone the project
* run npm install inside the project directory
* create a config.json file with the following structure:
```
{
    "consumer_key": "Your consumer key",
    "consumer_secret": "Your consumer secret",
    "access_token": "Your access token",
    "access_token_secret": "Your token secret"
}
```
* fill config.json with your twitter api keys and tokens

## running
run npm run start to run the project. It wil run on localhost on port 3000

## notes
* Locations are in latitude, longitude format
* Locations are not always known from the twitter api: First, we look into the coordinates associated with a tweet. Secondly, we look if the tweet has a place associated with it. If all else fails, we check the location of the sender of the tweet.
* The location of the sender of the tweet is always entered by the sender as a string. To transform the string into a valid location, we use the geonames api. The first found match is considered the location of the sender.
