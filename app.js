const express = require("express");
const app = express();
app.set('view  engine','ejs');
const path = require("path");
const fs = require('fs');
const port = process.env.PORT || 3000;
const cookie_parser = require("cookie-parser");
const game_details = require("./models/gameschema");
const register = require("./models/accountschema");
const {connecttomongodb}=require( './models/connect')
const Message = require("./models/messageschema");

connecttomongodb('mongodb://localhost:27017/user').then(() => {
  console.log("DB CONNECTED");
})
.catch(() => {
  console.log("Failed to Connect");
});

// to add the games to the database uncomment below one  and comment above code and run only once. then undo the changes 

// connecttomongodb('mongodb://localhost:27017/user').then(async () => {

// try {
//   const filePath = path.join(__dirname, 'models', 'games.json');
//   const data = await  readDataFromJSONFile(filePath);
//   await Promise.all(data.map(async (gameData) => {
//     const game = new game_details(gameData);
//     await game.save();
//   }));
//   console.log("DB CONNECTED");
//   console.log("Data saved successfully to games collection !");
// } catch (error) {
//   console.error("Error reading or saving data:", error);
// } 
// })
// .catch(() => {
//   console.log("Failed to Connect");
// });


app.use(cookie_parser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const router=require('./routes/router') 
app.use(router);//it is a middleware

app.listen(port, () => {
  console.log("Server Is Running On " + port);
});



function readDataFromJSONFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

//
app.post('/game-data', async (req, res) => {
  const { gameName } = req.body;
  try {
      
      const updatedGameData = await game_details.findOne({game_name:gameName});
      res.json({ updatedGameData });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch game data" });
  }
});




// usefull to show all the users who had messaged already in the past just shows the user_name who had messaged in the past
app.get("/user_chat", async (req, res) => {
  res.sendFile(__dirname + "/public/user_chat.html");
});


//typically used for invidual chat b/w two users
app.get("/chat", async (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

app.post("/send", async (req, res) => {
  try {
    const senderId= req.cookies.username;
    
    const { recipientId, content } = req.body;
    console.log(recipientId);
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content,
    });
    await message.save();
    res.redirect("/user_chat")
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Sever Error" });
  }
});


app.get("/messages/:recipientId", async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.cookies.username;

   
    const timeout = 30000; 
    const startTime = Date.now();

    
    const checkMessages = async () => {
    
      const messages = await Message.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId },
        ],
      }).sort({ timestamp: 1 });

    
      if (messages.length > 0) {
        res.json(messages);
      } else {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < timeout) {
          setTimeout(checkMessages, 1000); 
        } else {
          res.json([]);
        }
      }
    };

   
    checkMessages();
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Sever Error" });
  }
});

app.post("/msg", async (req, res) => {
  try {
    const senderId = req.cookies.username;
    const { recipientId, content } = req.body;
    
   
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content,
    });
    await message.save();

   
    const updatedMessages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(updatedMessages);
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});



app.get("/userChat", async (req, res) => {
  try {
    const contacts = new Set(); 
    const curr_user = req.cookies.username;

    // find based on the sender based
    const sender_based = await Message.find({ sender: curr_user });
    if (sender_based) {
      const contact_data = sender_based.map(msg => msg.recipient);
      contact_data.forEach(contact => contacts.add(contact)); 
    }

    // find based on the recipient based
    const recipient_based = await Message.find({ recipient: curr_user });
    const contact_data2 = recipient_based.map(msg => msg.sender);
    contact_data2.forEach(contact => contacts.add(contact));

    // Convert Set to an array to send it as a response
    const uniqueContacts = [...contacts];

    res.status(200).json(uniqueContacts);
  } catch (error) {
    res.status(401).json({ errorMessage: "Couldn't collect chat Data right now" });
  }
});


app.post("/cart-purschase", async (req, res) => {
  try {
    const username = await req.cookies.username;
    const games = req.body;

    const activeuser = await register.findOne({ username: username });
    if (!activeuser) {
      return res.status(404).json({ errorMessage: "PLEASE DO LOGIN!!!" });
    }

    let alreadyPurchased = false;

    for (const game of games) {
      if (activeuser.purchase.includes(game.game_name)) {
        alreadyPurchased = true;
        break;
      }
    }

    if (alreadyPurchased) {
      return res.status(200).json({
        paymessage: "YOU HAVE ALREADY DOWNLOADED THE GAME",
        downloadmessage: ""
      });
    }

    for (const game of games) {
      activeuser.purchase.push(game.game_name);
    }

    await activeuser.save();

    return res.status(200).json({
      paymessage: "Successfully purchased games",
      downloadmessage: "Now you can download the game(s)!"
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

app.post("/cart-buy", async (req, res) => {
  try {
    const username = await req.cookies.username;
    const games = req.body;

    const activeuser = await register.findOne({ username: username });
    if (activeuser) {
      for (const game of games) {
        activeuser.download.push(game.game_name);
      }
      await activeuser.save();
      res.status(200).json({
        message: "Successfully downloaded games",
      });
    } else {
      res.status(404).json({ errorMessage: "activeuser not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

app.get("/cart-payment",async(req,res)=>{
  res.render(path.join(__dirname,"./views/cartpayment.ejs"));
})