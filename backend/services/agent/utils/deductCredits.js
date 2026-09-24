import axios from "axios"

export const deductCredits= async(userID,agent)=>{
    try {
        const {data}= axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`,{userID,agent})

        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
