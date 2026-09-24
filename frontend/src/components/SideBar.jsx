import React, { useEffect, useState } from 'react'
import {
    Coins,
    LogOut,
    Menu,
    MessageSquare,
    PanelLeftIcon,
    PanelRight,
    PenSquare,
    Plus,
    User,
    X
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import { getConversations } from '../features/getConversations.js'
import { createConversation } from '../features/createConversation.js'
import logOut from '../features/logOut.js'

import {
    addConversation,
    setConversations,
    setSelectedConversation
} from '../redux/conversationSlice.js'

import { setUserdata } from '../redux/userSlice.js'

import BillingDrawer from './BillingDrawer.jsx'


function SideBar() {

    const [collapsed, setCollapsed] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [showBilling, setShowBilling] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const dispatch = useDispatch()

    const {
        conversations = [],
        selectedConversation
    } = useSelector(state => state.conversation)

    const {
        userData
    } = useSelector(state => state.user)


    // --------------------------------------------------
    // LOAD SAVED CONVERSATIONS
    // --------------------------------------------------

    useEffect(() => {
        if (!userData) {
        dispatch(setConversations([]))
        dispatch(setSelectedConversation(null))
        return
    }

        const loadConversations = async () => {

            try {

                const data = await getConversations()

                

                if (!Array.isArray(data)) {
                    console.error(
                        "Expected conversations array but received:",
                        data
                    )

                    dispatch(setConversations([]))
                    dispatch(setSelectedConversation(null))

                    return
                }

                dispatch(setConversations(data))


                // Restore a conversation after refresh
                if (data.length > 0) {

                    

                    dispatch(
                        setSelectedConversation(data)
                    )

                } else {

                    dispatch(
                        setSelectedConversation(null)
                    )

                }

            } catch (error) {

                console.error(
                    "Failed to load conversations:",
                    error
                )

                dispatch(setConversations([]))
                dispatch(setSelectedConversation(null))
            }
        }


        loadConversations()

    }, [userData,dispatch])


    // --------------------------------------------------
    // CREATE NEW CONVERSATION
    // --------------------------------------------------

    const handleCreateConversation = async () => {

        try {

            const data = await createConversation()

            

            if (!data?._id) {
                console.error(
                    "Invalid conversation returned:"
                )
                return
            }

            dispatch(addConversation(data))

            // Important:
            // newly created conversation becomes active
            dispatch(setSelectedConversation(data))

        } catch (error) {

            console.error(
                "Failed to create conversation:",
                error
            )
        }
    }


    // --------------------------------------------------
    // SELECT CONVERSATION
    // --------------------------------------------------

    const handleSelectConversation = (conversation) => {

        if (!conversation?._id) {
            console.error(
                "Invalid conversation selected:",
                conversation
            )
            return
        }

       
        dispatch(
            setSelectedConversation(conversation)
        )

        // Close mobile sidebar after selecting
        setMobileOpen(false)
    }


    // --------------------------------------------------
    // NEW CHAT
    // --------------------------------------------------

    const handleNewChat = () => {

        dispatch(
            setSelectedConversation(null)
        )

        setMobileOpen(false)
    }


    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    const handleLogout = async () => {

        try {

            await logOut()

            dispatch(
                setUserdata(null)
            )

            dispatch(
                setSelectedConversation(null)
            )

            dispatch(
                setConversations([])
            )

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            )
        }
    }


    // --------------------------------------------------
    // COLLAPSED SIDEBAR
    // --------------------------------------------------

    if (collapsed) {

        return (

            <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0'>

                {/* Expand sidebar */}

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1'
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight size={17} />
                </button>


                {/* New chat */}

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                    onClick={handleNewChat}
                >
                    <Plus size={17} />
                </button>


                {/* Conversations */}

                <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5'>

                    {conversations.map((conv) => {

                        const isActive =
                            selectedConversation?._id === conv?._id

                        return (

                            <div
                                key={conv._id}
                                onClick={() =>
                                    handleSelectConversation(conv)
                                }
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                                ${
                                    isActive
                                        ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                                        : "bg-transparent border-transparent"
                                }`}
                            >

                                <div
                                    className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
                                    ${
                                        isActive
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "bg-white/[0.05] text-slate-500"
                                    }`}
                                >

                                    <MessageSquare size={13} />

                                </div>

                            </div>
                        )
                    })}

                </div>


                {/* User */}

                <div className='relative shrink-0'>

                    {
                        userData?.avatar && !imageError

                            ?

                            <img
                                className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                                src={userData.avatar}
                                alt='profile'
                                onError={() =>
                                    setImageError(true)
                                }
                            />

                            :

                            <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>

                                <User
                                    size={15}
                                    className='text-slate-400'
                                />

                            </div>
                    }

                </div>

            </div>
        )
    }


    // --------------------------------------------------
    // NORMAL SIDEBAR
    // --------------------------------------------------

    return (

        <>

            {/* Mobile open button */}

            <button
                className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer'
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={14} />
            </button>


            {/* Mobile overlay */}

            {
                mobileOpen && (

                    <div
                        onClick={() => setMobileOpen(false)}
                        className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
                    />

                )
            }


            {/* Sidebar */}

            <div
                className={`fixed lg:static inset-y-0 left-0 z-50
                w-[270px] h-screen shrink-0
                bg-[#0d0f14] border-r border-white/[0.06]
                transition-transform duration-250
                ${
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >

                <div className='flex flex-col h-full'>


                    {/* Header */}

                    <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>

                        {/* Collapse */}

                        <div
                            className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                            onClick={() => setCollapsed(true)}
                        >
                            <PanelLeftIcon size={16} />
                        </div>


                        {/* Mobile close */}

                        <button
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className='lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                        >
                            <X size={16} />
                        </button>


                        <span className='text-[16px] font-semibold text-slate-100 tracking-tight flex-1'>
                            ArvixAI
                        </span>


                        <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide'>
                            {userData?.plan || "free"}
                        </span>


                        {/* New chat */}

                        <button
                            onClick={handleNewChat}
                            className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                        >
                            <PenSquare size={14} />
                        </button>

                    </div>


                    {/* New chat button */}

                    <div className='px-4 pt-4 pb-1'>

                        <button
                            className='w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150'
                            onClick={handleNewChat}
                        >
                            <Plus size={15} />
                            New Chat
                        </button>

                    </div>


                    {/* Recent heading */}

                    {
                        conversations.length === 0

                            ?

                            <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                                No Recent Conversations
                            </div>

                            :

                            <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                                Recents
                            </div>
                    }


                    {/* Conversation list */}

                    <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>

                        {
                            conversations.map((conv) => {

                                const isActive =
                                    selectedConversation?._id === conv?._id

                                return (

                                    <div
                                        key={conv._id}
                                        onClick={() =>
                                            handleSelectConversation(conv)
                                        }
                                        className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                                        ${
                                            isActive
                                                ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                                                : "bg-transparent border-transparent"
                                        }`}
                                    >

                                        {/* Icon */}

                                        <div
                                            className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
                                            ${
                                                isActive
                                                    ? "bg-indigo-500/15 text-indigo-400"
                                                    : "bg-white/[0.05] text-slate-500"
                                            }`}
                                        >
                                            <MessageSquare size={13} />
                                        </div>


                                        {/* Title */}

                                        <span
                                            className={`text-[13px] font-medium truncate
                                            ${
                                                isActive
                                                    ? "text-slate-100"
                                                    : "text-slate-300"
                                            }`}
                                        >
                                            {conv?.title || "New Chat"}
                                        </span>

                                    </div>
                                )
                            })
                        }

                    </div>


                    {/* Divider */}

                    <div className='mx-2.5 h-px bg-white/[0.06]' />


                    {/* User section */}

                    <div className='px-3.5 py-3.5'>

                        {
                            userData

                                ?

                                <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>

                                    {/* Avatar */}

                                    <div className='relative shrink-0'>

                                        {
                                            userData?.avatar &&
                                            !imageError

                                                ?

                                                <img
                                                    className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                                                    src={userData.avatar}
                                                    alt='profile'
                                                    onError={() =>
                                                        setImageError(true)
                                                    }
                                                />

                                                :

                                                <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>

                                                    <User
                                                        size={15}
                                                        className='text-slate-400'
                                                    />

                                                </div>
                                        }

                                    </div>


                                    {/* User information */}

                                    <div className='flex-1 min-w-0'>

                                        <p className='text-[13.5px] font-semibold text-slate-100 truncate'>
                                            {userData?.name || "user"}
                                        </p>

                                        <p className='text-[11px] text-slate-600 mt-px'>
                                            {userData?.plan || "free plan"}
                                        </p>

                                    </div>


                                    {/* Actions */}

                                    <div className='flex gap-1'>

                                        {/* Credits / billing */}

                                        <button
                                            onClick={() =>
                                                setShowBilling(true)
                                            }
                                            className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'
                                        >
                                            <Coins size={16} />
                                        </button>


                                        {/* Logout */}

                                        <button
                                            className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                        </button>

                                    </div>

                                </div>

                                :

                                <button
                                    className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'
                                >
                                    Login
                                </button>
                        }

                    </div>

                </div>

            </div>


            {/* Billing */}

            <BillingDrawer
                open={showBilling}
                onClose={() =>
                    setShowBilling(false)
                }
            />

        </>
    )
}


export default SideBar