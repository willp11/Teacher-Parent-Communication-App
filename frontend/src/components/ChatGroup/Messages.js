import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

const Messages = (props) => {

    const account = useSelector((state)=>state.auth.account);

    // new message
    const [msg, setMsg] = useState("");

    // message div
    const messagesRef = useRef()
    const inputRef = useRef()

    // create messages JSX
    let last_msg_sender = null;
    let show_name = true;
    let messages_div = props.messages.map((msg)=>{
        if (msg.content !== undefined) {
                // deal with messages where sender left the group
                if (msg.sender === null || msg.sender === undefined) {
                    msg.sender = {user: {id: 0, first_name: "User left the group"}}
                }
    
                // check if message was sent by same - determines whether to show name
                if (last_msg_sender === msg.sender.user?.id) {
                    show_name = false;
                } else {
                    show_name = true;
                }
                last_msg_sender = msg.sender.user?.id;
                let last_sender = (
                    <div className="flex align-center justify-start pl-2">
                        <p className="text-sm text-gray-500 mb-1">{msg.sender.user?.first_name}</p>
                    </div>
                )
                let msg_content = (
                    <div className="w-2/3 rounded-lg bg-gray-300 p-2 flex align-center justify-start text-left">
                        {msg?.content}
                    </div>
                )
    
                // check if the message author is the user - if yes, change colours
                if (account.id === msg.sender.user?.id) {
                    last_sender = (
                        <div className="w-full flex justify-end">
                            <div className="w-2/3 flex align-center justify-start pl-2">
                                <p className="text-sm text-gray-500 mb-1">You</p>
                            </div>
                        </div>
                    )
                    msg_content = (
                        <div className="w-full flex justify-end">
                            <div className="w-2/3 rounded-lg bg-sky-500 text-white p-2 flex align-center justify-start text-left">
                                {msg?.content}
                            </div>
                        </div>
                    )
                }
                return (
                    <div className="my-2" key={msg.id}>
                        {show_name ? last_sender : null}
                        {msg_content}
                    </div>
                )
        } else {
            return null;
        }
    })

    // On component mount - scroll to bottom
    useEffect(()=>{
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [])

    // Everytime receive new message - scroll down, focus on input again
    useEffect(()=>{
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        inputRef.current.focus()
    }, [props.newMessage])

    // reset message input, send message
    const sendMessageHandler = (event) => {
        event.preventDefault();
        setMsg("");
        props.sendMessage(msg);
    }

    return (
        <div className="relative h-[400px] w-full sm:w-[500px] bg-white rounded border border-gray-300 shadow-md my-2">
            <div className="h-[calc(100%-2.5rem)] overflow-auto" ref={messagesRef}>
                {messages_div}
            </div>
            <form>
                <input ref={inputRef} value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Type message..." className="w-3/4 absolute bottom-0 left-0 border border-gray-600 h-10 pl-1" />
                <button type="submit" onClick={(e)=>sendMessageHandler(e)} className="w-1/4 absolute bottom-0 right-0 border border-black bg-sky-500 hover:bg-indigo-500 text-white font-bold h-10 rounded">Send</button>
            </form>
        </div> 
    )
}

export default Messages;