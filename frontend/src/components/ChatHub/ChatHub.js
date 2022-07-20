import './ChatHub.css';
import Navigation from '../Navigation/Navigation';
import ChatContacts from '../ChatContacts/ChatContacts';
import ChatGroups from '../ChatGroups/ChatGroups';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Contacts from './Contacts';

const ChatHub = () => {

    const token = useSelector((state)=>state.auth.token);
    const [groupsMemberOf, setGroupsMemberOf] = useState([]);

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
                setGroupsMemberOf(res.data.chat_group_member);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // On component mount - get all user's chat groups they own and are a member of
    useEffect(()=>{
        getUserChatGroups()
    }, [getUserChatGroups])

    // return (
    //     <div className="relative bg-white overflow-hidden min-h-screen">
    //         <Navigation />
    //         <div className="w-full px-2 flex items-center justify-center md:px-4 lg:px-8">
    //             <div className="w-full bg-white text-center p-2">
    //                 <h1 className="pb-2">Chat</h1>
    //                 <div className="w-full flex items-start justify-center flex-wrap">
    //                     <ChatContacts from="chat_hub" groupsMemberOf={groupsMemberOf}/>
    //                     <ChatGroups getUserChatGroups={getUserChatGroups} groupsMemberOf={groupsMemberOf}/>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <Navigation />
            <div className="w-full max-h-screen h-[600px] px-2 flex flex-col items-center justify-start md:px-4 lg:px-8">
                <h1 className="pb-2">Chat</h1>
                <div className="h-full w-full md:w-[750px] lg:w-[800px] border-2 border-gray-300 flex flex-col md:flex-row">
                    <Contacts groupsMemberOf={groupsMemberOf} />
                    <div className="w-full md:w-2/3 h-1/2 md:h-full md:border-l-2 md:border-gray-300">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHub;