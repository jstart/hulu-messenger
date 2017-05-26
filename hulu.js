'use strict'
// http://www.hulu.com/sapi/popular_shows?distro=apple&distroplatform=phone
const http = require('http');
const request = require('request');
const messenger = require('./messenger')
const popularCache = require('./popular_shows')

exports.search = function(senderID, search) {
    messenger.sendAction(senderID, "typing_on")
    http.get("http://www.hulu.com/sapi/search/shows?q=" + search
    , function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            if (parsed.data.length > 0) {
              var show = parsed.data[0].show

              var cardTitle = show.name;
              var cardContent = show.description;

              var imageObj = {
                  smallImageUrl: show.key_art_url,
                  largeImageUrl: show.key_art_url
              };
              var pluralSeasons = 's'
              if (show.seasons_count == 1) {
                pluralSeasons = ''
              }
              var pluralEpisodes = 's'
              if (show.episodes_count == 1) {
                pluralEpisodes = ''
              }
              var speechOutput = show.name + ' has ' + show.seasons_count + ' season' + pluralSeasons + ' and ' + show.episodes_count + ' episode' + pluralEpisodes + ' available'
              var item = messenger.templateForItems(parsed.data[0])
              console.log(item)
              messenger.sendGenericMessage(senderID, [item])
              messenger.sendTextMessage(senderID, speechOutput)
            } else {
              messenger.sendTextMessage(senderID, "Sorry, I don't understand, give me one second.")
            }
        });
    });
}

exports.callPopular = function callPopular(senderID) {
  messenger.sendAction(senderID, "typing_on")

  if (popularCache.data != undefined) {
    messenger.sendTextMessage(senderID, "Welcome to HuluBot! You can search for content on Hulu by saying \"Handmaids Tale\" or \"Seinfeld\". Here are the most popular shows on Hulu.")
    parseAndSend(popularCache, senderID)
    return
  }
  request({
    uri: 'https://www.hulu.com/sapi/popular_shows?distro=apple&distroplatform=phone&items_per_page=5',
    method: 'GET'
  }, function (error, response, body, popularCache) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      popularCache = info
      //console.log(info.data[0].show.name)
      messenger.sendTextMessage(senderID, "Welcome to HuluBot! You can search for content on Hulu by saying show me Handmaids Tale or search for Seinfeld. Here are the most popular shows on Hulu.")
      parseAndSend(popularCache, senderID)
    } else {
      console.error("Unable to fetch popular shows.");
      console.error(response.statusCode);
      console.error(error);
    }
  });  
}

function parseAndSend(info, senderID) {
      var elements = Array()
      //info.data.slice(0,5).forEach(function (item, index) { elements[index] = messenger.templateForItems(item) })
      info.data.forEach(function (item, index) { elements[index] = messenger.templateForItems(item) })
      messenger.sendGenericMessage(senderID, elements)
}