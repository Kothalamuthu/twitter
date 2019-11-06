// const config=require('./config')
const twit=require('twitter') //node module to get tweets  

//credrntials of twitter account
const T=new twit({
	consumer_key: 'GqpCJTCdq4DBpOiduihQI65zQ',
    consumer_secret: 'VZ6S1DmY05dhwaYbaUOKjBQDObkaBvXu3hIH9gnwVXK981V3Lm',
    access_token_key: '960839896372932608-WqQQA0C8XSwibUzNiGWXEUj6Be3UNMJ',
    access_token_secret: 'zzFSMJArOKKlmb7dj4oHet4anCmSA93H3nXidPlcFs4Qd'
});

//required modules
const express = require("express");
const cors = require("cors");
// const emojiRegex = require('emoji-regex');
const uEmojiParser = require('universal-emoji-parser');


const app = express();
app.use(cors());

//json result structure 
statJson = {
    "Seconds":0,
    "Minutes":0,
    "totalTweets":0,
    "Tweets_per_Seconds":0,
    "Tweets_per_Minutes":0,
    "urls":0,
    "hashtags":0,
    "emojis":0,
    "pics": 0,
    "urls%": 0,
    "hashtags%" : 0,
    "emojis%" : 0,
    "pics%": 0,
    "TopURL":{},
    "TopHashTag":{},
    "TopEmoji":{},
    "urlJson":{},
    "hashtagJson":{},
    "emojiJson":{}
}

// this function will receive tweets one by one and pass that to 'getStatistics' tp perform Statistics operation
function storeStream(list,a,callback){
    statJson['totalTweets'] = statJson['totalTweets'] + 1
    b = new Date()
    getStatistics(list)
    if (b-a > 1000){
        statJson['Seconds'] = statJson['Seconds'] + 1
        // statJson["Tweets_per_Seconds"] =  Math.floor(statJson["totalTweets"]/statJson["Seconds"]);
        if (statJson['Seconds'] % 60 == 0){
            statJson['Minutes'] = statJson['Minutes'] + 1
            statJson["Tweets_per_Minutes"] =  Math.floor(statJson["totalTweets"]/statJson["Minutes"]);
        }
        return callback(new Date());
    }
    
}

//this function will perform the statistics for each tweets
function getStatistics(data){
    // statJson['totalTweets'] = statJson['totalTweets'] + 1
    if (data.entities.urls.length != 0){
        statJson['urls'] = statJson['urls'] + 1
        arr = data.entities.urls
        arr.forEach(element => { 
            // console.log(element)
            if(statJson['urlJson'].hasOwnProperty(element.url)){
                statJson['urlJson'][element.url] = statJson['urlJson'][element.url] + 1
            }
            else{
                statJson['urlJson'][element.url] = 1
            }
        }); 
    }
    if (data.entities.hashtags.length != 0){
        statJson['hashtags'] = statJson['hashtags'] + 1
        arr = data.entities.hashtags
        arr.forEach(element => { 
            if(statJson['hashtagJson'].hasOwnProperty(element.text)){
                statJson['hashtagJson'][element.text] = statJson['hashtagJson'][element.text] + 1
            }
            else{
                statJson['hashtagJson'][element.text] = 1
            }
        });
    }
    if (data.entities.media != undefined){
        statJson['pics'] = statJson['pics'] + 1
    } 
    emojiAnalyze(data.text)
    
}

//function will perform emoji related anaalyse
function emojiAnalyze(text) {
    result = uEmojiParser.parse(text)
    arr = result .split('alt=')
    arr = arr.slice(1,arr.length)
    if (arr.length > 0){
        statJson['emojis'] = statJson['emojis'] + 1
    }
    arr.forEach(element => { 
        element = element.split(' ')[0]
        element = element.split('\"')[1]
        if(statJson['emojiJson'].hasOwnProperty(element)){
            statJson['emojiJson'][element] = statJson['emojiJson'][element] + 1
        }
        else{
            statJson['emojiJson'][element] = 1
        }
      });
}

//here we get the twitter streams 
a = new Date()
T.stream('statuses/sample', function(stream) {
    stream.on('data', function (data) {
        storeStream(data,a,function(response){
            // console.log(response)
            a = response
        })
    });
  });


//API to view the collected statistics
app.get('/analyze', async (req, res, next) => {
    var maxProp = null
    var maxValue = -1
    for (var prop in statJson['urlJson']) {
        if (statJson['urlJson'].hasOwnProperty(prop)) {
            var value = statJson['urlJson'][prop]
            if (value > maxValue) {
            maxProp = prop
            maxValue = value
            }
        }
    }
    statJson['TopURL']['URL'] = maxProp
    statJson['TopURL']['Count'] = maxValue

    var maxProp = null
    var maxValue = -1
    for (var prop in statJson['hashtagJson']) {
        if (statJson['hashtagJson'].hasOwnProperty(prop)) {
            var value = statJson['hashtagJson'][prop]
            if (value > maxValue) {
            maxProp = prop
            maxValue = value
            }
        }
    }
    statJson['TopHashTag']['HashTag'] = maxProp
    statJson['TopHashTag']['Count'] = maxValue

    var maxProp = null
    var maxValue = -1
    for (var prop in statJson['emojiJson']) {
        if (statJson['emojiJson'].hasOwnProperty(prop)) {
            var value = statJson['emojiJson'][prop]
            if (value > maxValue) {
            maxProp = prop
            maxValue = value
            }
        }
    }
    statJson['TopEmoji']['Emoji'] = maxProp
    statJson['TopEmoji']['Count'] = maxValue

    statJson["Tweets_per_Seconds"] =  Math.floor(statJson["totalTweets"]/statJson["Seconds"]);
    // if (statJson['Seconds'] % 60 == 0){
    //     statJson["Tweets_per_Minutes"] =  Math.floor(statJson["totalTweets"]/statJson["Minutes"]);
    // }
    statJson["urls%"] = statJson["urls"] /statJson["totalTweets"] *100,
    statJson["hashtags%"] = statJson["hashtags"] / statJson["totalTweets"] *100,
    statJson["emojis%"] = statJson["emojis"] / statJson["totalTweets"] *100,
    statJson["pics%"] = statJson["pics"] / statJson["totalTweets"] * 100;

    res.send(statJson)
});

//server start point
app.listen(2093, () => {
  console.log(`App running on port http://localhost:2093`);
});