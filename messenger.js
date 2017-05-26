const request = require('request');

// Sending helpers
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
exports.sendAction = function (recipientId, actionType) {
  var messageData = {
    recipient: { id: recipientId },
    sender_action: actionType
  };

  exports.callSendAPI(messageData);
}

exports.sendTextMessage = function (recipientId, messageText) {
  var messageData = {
    recipient: { id: recipientId },
    message: { text: messageText }
  };

  exports.callSendAPI(messageData);
}

exports.sendGenericMessage = function (recipientId, elements) {
  var messageData = {
    recipient: { id: recipientId },
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
      // var recipientId = body.recipient_id;
      // var messageId = body.message_id;
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

exports.callMenu = function (menu) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: menu
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // var recipientId = body.recipient_id;
      // var messageId = body.message_id;
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

exports.parseAsElements = function (info) {
      var elements = []
      //info.data.slice(0,5).forEach(function (item, index) { elements[index] = messenger.templateForItems(item) })
      info.data.forEach(function (item, index) { elements[index] = this.templateForItem(item.show) })
      return elements
}

exports.templateForItem = function (info) {
   var elements = {
        title: info.name,
        subtitle: info.description,
        item_url: 'http://hulu.com/' + info.canonical_name,
        image_url: info.key_art_url,
        buttons: [{
          type: "web_url",
          url: "http://hulu.com/" + info.canonical_name,
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
