import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages, setArtifacts } from "../redux/messageSlice.js"
import getMessages from "../features/getMessages.js"
import Nav from "./Nav"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"



function ChatArea() {

    const dispatch = useDispatch()
    
    const { selectedConversation } = useSelector(
        state => state.conversation
    )
    const { isLoading } = useSelector(state => state.message)
    const chatInputRef = useRef(null)
    const isLoadingRef = useRef(isLoading)

    useEffect(() => {                                            
        isLoadingRef.current = isLoading
    }, [isLoading])
     const [suggestionPrompt, setSuggestionPrompt] = useState("") 

    useEffect(() => {

        const loadMessages = async () => {

            const conversationId = selectedConversation?._id

            

            

            // No conversation selected
            if (!conversationId) {

                dispatch(setMessages([]))
                dispatch(setArtifacts([]))

                return
            }

            try {

                const data = await getMessages(conversationId)
                if ((data || []).length === 0 && isLoadingRef.current) {
                    return
                }
                

                dispatch(setMessages(data || []))

                // Find latest message containing artifacts
                const latestArtifactMessage =
                    [...(data || [])]
                        .reverse()
                        .find(
                            msg =>
                                msg?.artifacts &&
                                msg.artifacts.length > 0
                        )

                dispatch(
                    setArtifacts(
                        latestArtifactMessage?.artifacts || []
                    )
                )

            } catch (error) {

                console.error(
                    "CHAT AREA - FAILED TO LOAD MESSAGES:",
                    error
                )

                dispatch(setMessages([]))
                dispatch(setArtifacts([]))
            }
        }

        loadMessages()

    }, [selectedConversation?._id, dispatch])


    return (
        <div className="flex-1 flex flex-col min-w-0">

            <Nav />

            <MessageList onSuggestionClick={(text) => chatInputRef.current?.sendPrompt(text)}/>

            <ChatInput  ref={chatInputRef}   
                conversationId={selectedConversation?._id}/>

        </div>
    )
}

export default ChatArea