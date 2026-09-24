import api from "../../utils/axios"

async function sendMessage(payload) {
    try {

        const { data } = await api.post(
            "/api/agent/chat",
            payload
        )

        

        return data

    } catch (error) {

        console.error(
            "AGENT CHAT ERROR:",
            error
        )

        console.error(
            "AGENT CHAT ERROR RESPONSE:",
            error.response?.data
        )

        console.error(
            "AGENT CHAT ERROR STATUS:",
            error.response?.status
        )

        throw error
    }
}

export default sendMessage