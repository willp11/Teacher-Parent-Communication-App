import Navigation from '../Navigation/Navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Contacts from './Contacts';
import GroupChats from './GroupChats';

const ChatHub = () => {

    const token = useSelector((state)=>state.auth.token);
    const accountType = useSelector((state)=>state.auth.accountType);
    console.log(accountType)
    // const [groupsMemberOf, setGroupsMemberOf] = useState([]);
    const [directChats, setDirectChats] = useState([]);
    const [groupChats, setGroupChats] = useState([]);

    // Get list of user's chat groups
    const getUserChatGroups = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/chat-group-user-get/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                // setGroupsMemberOf(res.data.chat_group_member);
                // sort groups into list of group chats and direct messages
                let direct_chats = [];
                let group_chats = [];
                res.data.chat_group_member.forEach((g)=>{
                    (g.group.direct_message) ? direct_chats.push(g) : group_chats.push(g)
                })
                setDirectChats(direct_chats);
                setGroupChats(group_chats);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // On component mount - get all user's chat groups they own and are a member of
    useEffect(()=>{
        getUserChatGroups()
    }, [getUserChatGroups])

    return (
        <div className="relative bg-white overflow-auto min-h-screen">
            <Navigation />
            <div className="w-full max-h-screen h-[750px] px-2 flex flex-col items-center justify-start md:px-4 lg:px-8">
                <h1 className="pb-2">Chat</h1>
                <div className="h-full w-full md:w-[750px] lg:w-[800px] border-2 border-gray-300 flex flex-col md:flex-row rounded-md shadow-md">
                    <Contacts directChats={directChats} accountType={accountType}/>
                    <GroupChats groupChats={groupChats} getUserChatGroups={getUserChatGroups} />
                </div>
            </div>
        </div>
    )
}

export default ChatHub;