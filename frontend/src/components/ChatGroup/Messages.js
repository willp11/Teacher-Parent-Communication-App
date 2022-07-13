import { useSelector } from "react-redux";

const Messages = (props) => {

    const account = useSelector((state)=>state.auth.account.account);

    console.log(account);

    // fill chat with the original messages
    let last_msg_sender = null;
    let show_name = true;
    let messages = props.messages.map((msg)=>{
        // check if message was sent by same - determines whether to show name
        if (last_msg_sender === msg.sender.user.id) {
            show_name = false;
        } else {
            show_name = true;
        }
        last_msg_sender = msg.sender.user.id;
        let last_sender = <div className="flex align-center justify-start pl-2"><p className="text-sm text-gray-500 mb-1">{msg.sender.user.first_name}</p></div>
        let msg_content = <div className="w-2/3 rounded-lg bg-gray-300 p-2 flex align-center justify-start text-left">{msg.content}</div>

        // check if the message author is the user - if yes, change colours
        if (account.id === msg.sender.user.id) {
            last_sender = <div className="flex align-center justify-start pl-2"><p className="text-sm text-gray-500 mb-1">You</p></div>
            msg_content = <div className="w-2/3 rounded-lg bg-sky-500 text-white p-2 flex align-center justify-start text-left">{msg.content}</div>
        }

        return (
            <div className="my-2">
                {show_name ? last_sender : null}
                {msg_content}
            </div>
        )
    })

    return (
        <div className="relative h-[400px] w-full sm:w-[500px] bg-white rounded-sm border border-gray-600 shadow-md my-2">
            <div className="h-[calc(100%-2rem)] overflow-auto">
                {messages}
            </div>
            <input placeholder="Type message..." className="w-3/4 absolute bottom-0 left-0 border border-gray-600" />
            <button className="w-1/4 absolute bottom-0 right-0 border border-black bg-sky-500 hover:bg-indigo-500 text-white font-bold">Send</button>
        </div> 
    )
}

export default Messages;