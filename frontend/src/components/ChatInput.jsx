import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useState ,forwardRef, useImperativeHandle} from 'react'
import sendMessage from '../features/sendMessage.js'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice.js'
import { createConversation } from '../features/createConversation.js'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice.js'
import { updateConversation } from '../features/updateConversation.js'
import { useRef } from 'react'



const ChatInput = forwardRef(function ChatInput({ conversationId, onMessagesUpdated }, ref) {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages, isLoading } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileRef = useRef(null)
  const dispatch = useDispatch()

  
  useEffect(() => {
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = ""

      for (let index = event.resultIndex; index < event.results.length; index++) {

        transcript += event.results[index][0].transcript
      }
      setValue(transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("speech recognition not supported")
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }

  }

  const handleSendMessage = async (overrideText) => {   // accept param
    const textToSend = overrideText ?? value             //use override if given

    if (!textToSend.trim() || isLoading) {
        return
    }

    dispatch(setIsLoading(true))

    try {
        let conversation = selectedConversation

        if (!conversation?._id) {
            dispatch(setMessages([]))
            const conv = await createConversation()
            conversation = conv
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))   

        }
        const title = textToSend.trim().slice(0, 40)
        if (conversation?.title === "New Chat") {
            const updatedConversation = await updateConversation({ id: conversation._id, title })
            conversation = updatedConversation
            dispatch(addConversation(updatedConversation))
            dispatch(setSelectedConversation(updatedConversation))
            dispatch(setConvTitle({ conversationId: conversation._id, title }))
        }

        const prompt = textToSend.trim()
        const formData = new FormData()
        formData.append("prompt", prompt)
        formData.append("conversationId", conversation._id)
        formData.append("agent", selectedAgent.toLowerCase())
        if (selectedFile) formData.append("file", selectedFile)

        dispatch(addMessage({ role: "user", content: prompt }))
        setValue("")

        const response = await sendMessage(formData)
        if (!response?.answer) {
            console.error("AI RESPONSE IS EMPTY")
            return
        }

        

        dispatch(addMessage({
    role: "assistant",
    content: response.answer,
    images: response.images || [],
    artifacts: response.artifacts || []
}))
       
        dispatch(setArtifacts(response.artifacts || []))

    } catch (error) {
        console.error("FAILED TO GENERATE CHAT:", error)
        console.error("FAILED TO GENERATE CHAT RESPONSE:", error?.response?.data)
        console.error("FAILED TO GENERATE CHAT STATUS:", error?.response?.status)
    } finally {
        dispatch(setIsLoading(false))
        setSelectedFile(null)
    }
  }

    useImperativeHandle(ref, () => ({
    sendPrompt: (text) => handleSendMessage(text)
  }))



const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()       // stops newline from being inserted
    handleSendMessage()
  }
}


  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },

    {
      id: "imageGen",
      icon: ImageIcon,
      label: "ImageGen"
    },

    {
      id: "search",
      icon: Globe,
      label: "Search"
    }

  ]


  
  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>
      <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>

        <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon
            return (
              <div key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
            flex-shrink-0
            cursor-pointer
            inline-flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-full
            text-xs
            font-medium
            border
            transition-all

            ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                  }
          `}>

                <Icon size={14}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  } />

                {agent.label}

              </div>
            )

          })}
        </div>

        {
          selectedFile && <div className='my-3'>

            <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
              {
                selectedFile?.type === "application/pdf" ? <FileText size={16}

                  className="text-red-400"
                /> : selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-xl object-cover mt-3"
                />
              }

              <div>
                <p className='text-xs text-white'>
                  {selectedFile?.name}
                </p>
                <p className='text-[10px] text-slate-500'>
                  {Math.ceil(selectedFile.size)}KB
                </p>

              </div>
              <button className='ml-2' onClick={() => { setSelectedFile(null); fileRef.current.value = "" }}><X size={14} className='text-slate-500 hover:text-white' /></button>
            </div>


          </div>
        }


        <textarea
          placeholder='Ask Anything...'
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>

            <input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setSelectedFile(file)
              }
            }} />

            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer' onClick={() => fileRef.current.click()}>
              <Paperclip size={16} />
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg  transition-all duration-150 cursor-pointer ${listening ?"bg-red-500 text-white":"text-slate-600 hover:bg-white/[0.05]" }`}>
             {listening?<Mic size={16} />:<MicOff size={16}/>} 
            </button>
          </div>
          <button
            disabled={!value && isLoading}
            onClick={() => handleSendMessage()}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}>
          <Send size={15} />
        </button>
      </div>
    </div>
    </div >
  )
})

export default ChatInput
