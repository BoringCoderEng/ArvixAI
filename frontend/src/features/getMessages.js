import api from "../../utils/axios"

const getMessages = async (conversationId) => {

    try {

        const { data } = await api.get(
            `/api/chat/get-messages/${conversationId}`
        )

       

        return data

    } catch (error) {

        console.error(
            "GET MESSAGES ERROR:",
            error.response?.data || error
        )

        throw error
    }
}

export default getMessages