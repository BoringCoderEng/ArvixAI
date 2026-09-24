import mongoose from "mongoose";

const conversationSchema= new mongoose.Schema({
    title:{
        type:String,
        default:"New Chat"
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    }

},{
    timestamps:true
})

const Conversation= mongoose.model("Conversation", conversationSchema)
export default Conversation