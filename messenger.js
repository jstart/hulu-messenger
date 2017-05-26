const request = require('request');

// Sending helpers
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
exports.sendAction = function (recipientId, actionType) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: actionType
  };

  exports.callSendAPI(messageData);
}

exports.sendTextMessage = function (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  exports.callSendAPI(messageData);
}

exports.sendGenericMessage = function (recipientId, elements) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };  

  exports.callSendAPI(messageData);
}

exports.callSendAPI = function (messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      //console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender
exports.callProfileAPI = function (senderID) {
  request({
    uri: 'https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'GET'
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

function templateForMenu(genre) {
    var menuItem = {
                "title":genre.name,
                "type":"postback",
                "payload":genre.id
              }
    return menuItem
}

exports.callMenu = function () {

  var menuData = { 
    "get_started": { "payload":"GET_STARTED_PAYLOAD" },
    "greeting":[
      {
        "locale":"default",
        "text":"Discover all the great content on Hulu! You can say things like, search for Seinfeld, or tell me about The Handmaids Tale."
      }
    ],
    "persistent_menu":[
      {
        "locale":"default",
        "call_to_actions":[
          {
            "title":"Browse Genres",
            "type":"web_url",
            "url":"https://hulu.com/genres",
            "webview_height_ratio":"full"
          },
          {
            "title":"Movies",
            "type":"web_url",
            "url":"https://hulu.com/movies",
            "webview_height_ratio":"full"
          },
          {
            "title":"Hulu Originals",
            "type":"web_url",
            "url":"https://hulu.com/originals",
            "webview_height_ratio":"full"
          }
        ]
      }
    ]
  }
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: menuData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      //console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

exports.templateForItems = function (info) {
   var elements = {
        title: info.show.name,
        subtitle: info.show.description,
        item_url: 'http://hulu.com/' + info.show.canonical_name,               
        image_url: info.show.key_art_url,
        buttons: [{
          type: "web_url",
          url: "http://hulu.com/" + info.show.canonical_name,
          title: "Watch Now!"
        },
        {
        "type":"element_share"
        }]
     // , {
     //      type: "postback",
     //      title: "More like this",
     //      payload: info.show.id,
     //    }
      }
   return elements
}
