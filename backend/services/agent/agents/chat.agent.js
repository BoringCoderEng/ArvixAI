import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"


export const chatAgent= async(state)=>{


    try {

   await checkAgentLimit(state.userID,"chat")

        const llm= await getModel("chat")

    const history= await getMemory(state.conversationId) || []

    const searchContext= state.searchResults?`Web Search Results:
     ${JSON.stringify(state.searchResults)} 
     Answer the user using only the above search results.`
     : ""

    const systemPrompt= 
    `You are ArvixAI an intelligent AI assistant
    
    ${searchContext}

    If searchContext exists:
    -use search results to answer
    -Do not mention internal tools

Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`

    const messages=[
        new SystemMessage(systemPrompt)
    ]

    history.forEach(msg=>{
        if(msg.role=="user"){
            messages.push(new HumanMessage(msg.content))
        }else{
            messages.push(new AIMessage(msg.content))

        }
    })

    messages.push(new HumanMessage(state.prompt))

    const response= await llm.invoke(messages)
    await deductCredits(state.userID,"chat")


    return {
        ...state,
        aiResponse: (await response).content
    }
    } catch (error) {
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate chat"
        }
    }
}