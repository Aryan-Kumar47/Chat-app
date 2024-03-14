import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  id : String,
  messages : [
    {
      id : String,
      senderId : String,
      receiverId : String,
      text : String,
      timeStamp : Date
    }
  ]
})

const Chat = mongoose.models.Chat || mongoose.model("Chat" , chatSchema)
export default Chat;