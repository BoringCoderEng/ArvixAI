

import { checkAgentLimit } from "../config/agentLimit.js"
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js"

export const searchAgent= async(state)=>{
    try {
       await checkAgentLimit(state.userID,"ppt")

        const results= await searchTool.invoke({
            query: state.prompt
        })

        await deductCredits(state.userID,"search")
        
        return{
            ...state,
            searchResults:results,
            images:results.images
        }

    } catch (error) {
        console.log(error)
        return{
            ...state,
            searchResults:[],
            images:[]
        }
    }
}