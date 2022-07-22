import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MemberList from './MemberList';
import Navigation from '../Navigation/Navigation';
import Messages from './Messages';

const ChatGroup = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [socket, setSocket] = useState(null);

    // receive new messages, we update the refs and pass to messages component so it can render new messages and scroll down
    const messagesRef = useRef();
    const messageCountRef = useRef(0)

    // connect to websocket - called inside getGroupData
    const connectSocket = useCallback(() => {
        const chatSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${id}/${token}/`
        );
        // when receive new message, write to chat log div
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            writeMessage(data)
        };
        // if socket closes write error message to console
        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
        setSocket(chatSocket)
    }, [id, token]);

    // Get all data for this chat group
    const getGroupData = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `http://localhost:8000/api/v1/school/chat-group-get/${id}/`;
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setGroup(res.data);
                setMessages(res.data.chat_messages);
                setGroupMembers(res.data.chat_members);
                console.log(res.data.chat_members)
                messagesRef.current = res.data.chat_messages;
                connectSocket();
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id, connectSocket])

    // Get list of members for this chat group (doesn't need to connect to sockets again)
    // called from AddMembers, through MemberList (via props)
    const getGroupMembers = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `http://localhost:8000/api/v1/school/chat-group-members-list/${id}/`;
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setGroupMembers(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id])

    // need to update 
    useEffect(()=>{
        getGroupMembers()
    }, [getGroupMembers])

    // Function to send chat socket message
    const sendMessage = (message) => {
        if (socket !== null) {
            socket.send(JSON.stringify({
                'message': message
            }));
        }
    }

    // Function to add received messages to messages state
    const writeMessage = (message) => {
        let obj = {
            sender: {user: message.user},
            content: message.message,
            id: message.id
        }
        // need to get messages from ref - as otherwise get new empty array each time
        let messagesList = [...messagesRef.current]
        messagesList.push(obj);
        setMessages(messagesList);

        // update the messages ref
        messagesRef.current.push(obj);

        // update new message count so we scroll more 
        messageCountRef.current += 1;
    }

    // On Mount - get group data, also connects to websocket inside getGroupData then function
    useEffect(()=>{
        getGroupData()
    }, [getGroupData])

    // show loading if not retrieved data
    let group_div = <p>Loading...</p>
    if (group !== null) {
        group_div = (
            <div className="w-full text-center">
                <div className="w-full bg-indigo-500 py-2">
                    <h1 className="font-white drop-shadow-lg text-white">{group.direct_message ? "Direct Message" : group.name}</h1>
                </div>
                <div className="w-[calc(100%-1rem)] mx-auto flex flex-col items-center">
                    <MemberList groupId={id} members={groupMembers} direct={group.direct_message} getGroupMembers={getGroupMembers} />
                    <Messages groupId={id} messages={messages} sendMessage={sendMessage} newMessage={messageCountRef.current}/>
                </div>
            </div>
        )
    }

    return (
        <div className="relative bg-slate-100 overflow-auto h-screen">
            <Navigation />
            <div className="w-full flex items-center justify-center">
                {group_div}
            </div>
        </div>
    )
}

export default ChatGroup;