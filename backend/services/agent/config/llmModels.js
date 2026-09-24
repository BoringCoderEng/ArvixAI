import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {ChatOpenRouter} from "@langchain/openrouter"


const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  maxTokens:12000
});



const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  maxOutputTokens: 2048,
});

const openrouter= new ChatOpenRouter({
    model:"openai/gpt-oss-120b",
    temperature:0,
    maxTokens:12000
})



export const getModel=async (agent)=>{
    switch (agent) {
        case "chat":
            return groq;
        case "search" :    
           return groq;
        case "coding": 
           return groq;    
        case "imageAnalyzer": 
           return gemini;
        default:
            return groq;
    }
}