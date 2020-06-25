const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(3000).sockets;

// Creating chat database for testing
mongo.connect("mongodb://localhost:27017/", function (err, monClient) {
  if (err) throw err;
  console.log("MongoDB connected...");

  // Socket.io connection
  client.on("connection", function (socket) {
    let chat = monClient.db("mongochat");

    //Create function to send status
    // Whenever you want to pass stuff from the server to the client you use the .emit funciton
    let sendStatus = function (s) {
      socket.emit("status", s);
    };

    // Get chats from mongo collection
    chat
      .collection("chats")
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function (err, result) {
        if (err) throw err;

        //Emit the messages to the client that requests on 'output'
        socket.emit("output", result);
      });

    // Input handler
    socket.on("input", function (data) {
      let name = data.name;
      let message = data.message;

      // Check if input was empty
      if (!name || !message) {
        sendStatus("Please enter name or message");
      } else {
        chat.insert({ name: name, message: message }, function () {
          client.emit("output", [data]);

          sendStatus({
            message: "Message sent",
            clear: true
          });
        });
      }
    });
    socket.on("clear", function (data) {
      //Remove all chats from collection
      chat.remove({}, function () {
        socket.emit("cleared");
      });
    });
  });
});
