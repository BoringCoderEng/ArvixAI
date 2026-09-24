import api from "../../utils/axios"

async function saveMessage(payload) {

    try {

        const { data } = await api.post(
            "/api/chat/save-message",
            payload
        )

        
        return data

    } catch (error) {

        console.error(
            "SAVE MESSAGE ERROR:",
            error
        )

        console.error(
            "SAVE MESSAGE ERROR RESPONSE:",
            error.response?.data
        )

        throw error
    }
}

export default saveMessage