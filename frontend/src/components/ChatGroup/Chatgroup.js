import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MemberList from './MemberList';
import Navigation from '../Navigation/Navigation';
import Messages from './Messages';
import { useGroupMembers } from '../../Hooks/useGroupMembers';

const ChatGroup = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);
    const userId = useSelector((state)=>state.auth.account.id);

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);

    const {groupMembers, setGroupMembers, getGroupMembers} = useGroupMembers(token, id);

    const groupMembersRef = useRef();

    // after re-render group members, update ref
    useEffect(()=>{
        groupMembersRef.current = groupMembers;
    }, [groupMembers]);

    // update group member's connection status
    const updateGroupMembers = useCallback((event) => {
        // need to ref (not state) otherwise it is stale reference in the call from websocket.onmessage
        let members = [...groupMembersRef.current];
        groupMembersRef.current.forEach((member, index)=>{
            if (member.user.id === event.data.user) {
                if (event.type === 'user_connected') {
                    members[index].connected_to_chat = true;
                } else if (event.type === 'user_disconnected') {
                    members[index].connected_to_chat = false;
                }     
            }
        })
        // update state to force re-render
        setGroupMembers(members);
    }, [groupMembersRef, setGroupMembers])

    // receive new messages, we update the refs and pass to messages component so it can render new messages and scroll down
    const messagesRef = useRef();
    const messageCountRef = useRef(0)

    // keep socket in ref so doesn't set null, so we can close it on unmount
    const socketRef = useRef(null)

    // connect to websocket - called inside getGroupData
    const connectSocket = useCallback(() => {
        const chatSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${id}/${token}/`
        );
        // print that we have connected successfully
        chatSocket.onopen = function(e) {
            console.log("opened socket", chatSocket);
            socketRef.current = chatSocket;
        }
        // when receive new message, write to chat log div
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.type === 'chat_message') {
                writeMessage(data);
            } else if (data.type === 'user_connected' || data.type === 'user_disconnected') {
                updateGroupMembers(data)
            }
        };
        // if socket closes write error message to console
        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    }, [id, token, updateGroupMembers]);

    // Get all data for this chat group - then connect to sockets
    const getGroupData = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.API_URL}/api/v1/school/chat-group-get/${id}/`;
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setGroup(res.data);
                setMessages(res.data.chat_messages);
                setGroupMembers(res.data.chat_members);
                // groupMembersRef.current = res.data.chat_members
                messagesRef.current = res.data.chat_messages;
                connectSocket();
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id, connectSocket, setGroupMembers])

    // On Mount - get group data, also connects to websocket inside getGroupData then function. On unmount close the socket
    useEffect(()=>{
        getGroupData()

        return () => {
            try {
                socketRef.current.close()
            } catch {
                console.log("error closing socket...")
            }
        }
    }, [getGroupData])

    // Function to send chat socket message
    const sendMessage = (message) => {
        if (socketRef.current !== null) {
            socketRef.current.send(JSON.stringify({
                'message': message
            }));
        }
    }

    // Function to add received messages to list so can be rendered by UI
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

    // show loading if not retrieved data
    let group_div = <p>Loading...</p>
    if (group !== null) {
        group_div = (
            <div className="w-full text-center">
                <div className="w-full bg-indigo-500 py-2">
                    <h1 className="font-white drop-shadow-lg text-white">{group.direct_message ? "Direct Message" : group.name}</h1>
                </div>
                <div className="w-[calc(100%-1rem)] mx-auto flex flex-col items-center">
                    <MemberList groupId={id} members={groupMembers} direct={group.direct_message} getGroupMembers={getGroupMembers} userId={userId} />
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