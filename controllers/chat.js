const express = require("express");
const app = express();
const path = require("path");
const user_chatpath=path.join(__dirname, "../public/user_chat.html")
const chatpath=path.join(__dirname, "../public/chat.html")
const Message = require("../models/messageschema");

 async function getuserchatpage(req, res)  {
    res.sendFile(user_chatpath);
  };
  
  
  //typically used for invidual chat b/w two users
  async function getchat (req, res){
    res.sendFile(chatpath);
  }
async function postsend(req, res){
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
  };
  
  
 async function getmessages(req, res){
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
  }
  
 async function postmessage(req, res){
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
  };
  
  
  
async function getuserchat(req, res){
    try {
      const contacts = new Set(); 
      const curr_user = req.cookies.username;
  
      // find based on the sender based
      const sender_based = await Message.find({ sender: curr_user });
      if (sender_based) {
        const contact_data = sender_based.map(msgmsg.recipient);
        contact_data.forEach(contact=>contacts.add(contact)); 
      }
  
      // find based on the recipient based
      const recipient_based = await Message.find({ recipient: curr_user });
      const contact_data2 = recipient_based.map(msgmsg.sender);
      contact_data2.forEach(contact=>contacts.add(contact));
  
      // Convert Set to an array to send it as a response
      const uniqueContacts = [...contacts];
  
      res.status(200).json(uniqueContacts);
    } catch (error) {
      res.status(401).json({ errorMessage: "Couldn't collect chat Data right now" });
    }
  };

module.exports={getuserchatpage,getchat,postsend,getmessages,postmessage,getuserchat}
  