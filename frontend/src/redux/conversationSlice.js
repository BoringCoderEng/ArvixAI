import { createSlice } from "@reduxjs/toolkit";

const conversationSlice=createSlice({
    name:"conversation",
    initialState:{
      conversations:[],
      selectedConversation:null
    },
    reducers:{
       setConversations:(state,action)=>{
        state.conversations=action.payload
       },
       addConversation: (state, action) => {
            const exists = state.conversations.some(
                c => c._id === action.payload._id
            )

            if (exists) {
                state.conversations = state.conversations.map(
                    c => c._id === action.payload._id ? action.payload : c
                )
            } else {
                state.conversations.unshift(action.payload)
            }
        },
        setSelectedConversation:(state,action)=>{
        state.selectedConversation=action.payload
       },

      setConvTitle: (state, action) => {

    const {
        title,
        conversationId
    } = action.payload

    state.conversations =
        state.conversations.map(
            conv =>
                conv._id === conversationId
                    ? {
                        ...conv,
                        title
                    }
                    : conv
        )

    if (
        state.selectedConversation?._id ===
        conversationId
    ) {

        state.selectedConversation = {
            ...state.selectedConversation,
            title
        }
    }
}

    }
   
})

export const {setConversations,addConversation,setSelectedConversation,setConvTitle}=conversationSlice.actions 
export default conversationSlice.reducer