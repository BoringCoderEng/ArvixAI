import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../utils/uploadtToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"



export const imageGenAgent= async(state)=>{



    try {
        await checkAgentLimit(state.userID,"image")
        
        const llm= await getModel("image")
    const res=await llm.invoke(`
        You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}

        `)

    const prompt= res.content.trim()
    console.log("Generated image prompt:", prompt)
    const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

    const imageRes= await axios.get(imageUrl,{responseType :"arraybuffer",timeout: 120000})
    console.log(
            "Image generated successfully:",
            imageRes.status,
            imageRes.headers["content-type"]
        )

    
    

    const buffer= Buffer.from(imageRes.data)
    const filename= `image-${Date.now()}.png`

    await uploadToS3(filename,buffer,"image/png")
    console.log("Image uploaded to S3:", filename)
    const downloadUrl= await getFromS3(filename, 24*60)
    await deductCredits(state.userID,"imageGen")
    return {
        ...state,
        aiResponse:`
![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`
    }
    } catch (error) {
        console.error("IMAGE GENERATION ERROR")

        console.error("Message:", error.message)
        console.error("Response status:", error.response?.status)
        console.error("Response data:", error.response?.data)
        return {
            ...state,
            aiResponse:
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Failed to generate image"
        }
    }
    
}