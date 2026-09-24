import api from "../../utils/axios"

export const updateConversation = async ({ id, title }) => {
    try {
        const { data } = await api.post(
            "/api/chat/update-conversation",
            {
                id,
                title
            }
        )


        return data

    } catch (error) {
        console.error(
            "UPDATE CONVERSATION ERROR:",
            error.response?.data || error
        )

        throw error
    }
}