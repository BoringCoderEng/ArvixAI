import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"


// ========================================
// CREATE CONVERSATION
// ========================================

export const createConversation = async (req, res) => {

    try {

        const userID = req.headers["x-user-id"]

        console.log(
            "CREATE CONVERSATION USER:",
            userID
        )

        if (!userID) {

            return res.status(401).json({
                message: "User ID is missing"
            })
        }

        const conversation =
            await Conversation.create({
                userID,
                title: "New Chat"
            })

        console.log(
            "CREATED CONVERSATION:",
            conversation
        )

        return res.status(201).json(
            conversation
        )

    } catch (error) {

        console.error(
            "CREATE CONVERSATION ERROR:",
            error
        )

        return res.status(500).json({
            message: error.message
        })
    }
}


// ========================================
// GET CONVERSATIONS
// ========================================

export const getConversations = async (req, res) => {

    try {

        const userID = req.headers["x-user-id"]

        console.log(
            "GET CONVERSATIONS USER:",
            userID
        )

        if (!userID) {

            return res.status(401).json({
                message: "User ID is missing"
            })
        }

        const conversations =
            await Conversation
                .find({ userID })
                .sort({ updatedAt: -1 })

        console.log(
            "CONVERSATIONS FOUND:",
            conversations.length
        )

        return res.status(200).json(
            conversations
        )

    } catch (error) {

        console.error(
            "GET CONVERSATIONS ERROR:",
            error
        )

        return res.status(500).json({
            message: error.message
        })
    }
}


// ========================================
// UPDATE CONVERSATION TITLE
// ========================================

export const updateConversations = async (req, res) => {

    try {

        const { id, title } = req.body

        console.log(
            "UPDATE REQUEST BODY:",
            req.body
        )

        if (!id) {

            return res.status(400).json({
                message: "Conversation ID is required"
            })
        }

        if (!title || !title.trim()) {

            return res.status(400).json({
                message: "Conversation title is required"
            })
        }

        const conversation =
            await Conversation.findByIdAndUpdate(
                id,
                {
                    $set: {
                        title: title.trim()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )

        console.log(
            "UPDATED CONVERSATION:",
            conversation
        )

        if (!conversation) {

            return res.status(404).json({
                message: "Conversation not found"
            })
        }

        return res.status(200).json(
            conversation
        )

    } catch (error) {

        console.error(
            "UPDATE CONVERSATION ERROR:",
            error
        )

        return res.status(500).json({
            message: error.message
        })
    }
}


// ========================================
// SAVE MESSAGE
// ========================================

export const saveMessage = async (req, res) => {

    try {

        const {
            conversationId,
            role,
            content,
            images,
            artifacts
        } = req.body

        if (!conversationId) {

            return res.status(400).json({
                message: "Conversation ID is required"
            })
        }

        const conversation =
            await Conversation.findById(
                conversationId
            )

        if (!conversation) {

            return res.status(404).json({
                message: "Conversation not found"
            })
        }

        const message =
            await Message.create({
                conversationId,
                content,
                role,
                images: images || [],
                artifacts: artifacts || []
            })


        // Update conversation's updatedAt
        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $set: {
                    updatedAt: new Date()
                }
            }
        )

        return res.status(201).json(
            message
        )

    } catch (error) {

        console.error(
            "SAVE MESSAGE ERROR:",
            error
        )

        return res.status(500).json({
            message: error.message
        })
    }
}


// ========================================
// GET MESSAGES
// ========================================

export const getMessages = async (req, res) => {

    try {

        const {
            conversationId
        } = req.params

        console.log(
            "GET MESSAGES FOR:",
            conversationId
        )

        if (!conversationId) {

            return res.status(400).json({
                message: "Conversation ID is required"
            })
        }

        const messages =
            await Message
                .find({
                    conversationId
                })
                .sort({
                    createdAt: 1
                })

        console.log(
            "MESSAGES FOUND:",
            messages.length
        )

        return res.status(200).json(
            messages
        )

    } catch (error) {

        console.error(
            "GET MESSAGES ERROR:",
            error
        )

        return res.status(500).json({
            message: error.message
        })
    }
}