import './ChatGroup.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MemberList from './MemberList';
import Navigation from '../Navigation/Navigation';
import Messages from './Messages';

const ChatGroup = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);

    const [group, setGroup] = useState(null);

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
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id])

    // On Mount - get group data
    useEffect(()=>{
        getGroupData()
    }, [getGroupData])

    // show loading if not retrieved data
    let group_div = <p>Loading...</p>
    if (group !== null) {
        group_div = (
            <div className="w-full bg-white text-center">
                <h1 className="pb-2">{group.direct_message ? "Direct Message" : group.name}</h1>
                <div className="w-full flex flex-col items-center">
                    <MemberList groupId={id} members={group.chat_members} direct={group.direct_message} />
                    <Messages messages={group.chat_messages}/>
                </div>
            </div>
        )
    }

    return (
        <div className="relative bg-white overflow-auto h-screen">
            <Navigation />
            <div className="w-full px-2 flex items-center justify-center md:px-4 lg:px-8">
                {group_div}
            </div>
        </div>
    )
}

export default ChatGroup;