import axios from "axios"

export const deductCredits= async(userID,agent)=>{
    try {
        const {data}= await axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`,{userID,agent},{ timeout: 5000 })

        return data
    } catch (error) {
        console.log(error.message)
        return null
    }
}
