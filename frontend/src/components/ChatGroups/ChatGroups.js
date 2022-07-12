import './ChatGroups.css';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CreateChatGroup from '../CreateChatGroup/CreateChatGroup';
import { Link } from 'react-router-dom';

const ChatGroups = () => {

    const token = useSelector((state)=>state.auth.token);

    const [groupsOwned, setGroupsOwned] = useState([]);
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
                setGroupsOwned(res.data.chat_groups_owned);
                setGroupsMemberOf(res.data.chat_group_member);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // On component mount - get all user's chat groups they own and are a member of
    useEffect(()=>{
        getUserChatGroups();
    }, [getUserChatGroups])

    // JSX
    // list of chat groups you own
    let groups_owned_list = groupsOwned.map(group=>{
        return (
            <div className="border" key={group.id}>
                <Link to={`/chatGroup/${group.id}`}><h4>{group.name}</h4></Link>
                <p style={{fontSize: "0.8rem"}}>Owned by: You</p>
            </div>
        )
    })
    
    // list of chat groups you are member of
    let groups_member_of_list = groupsMemberOf.map(group=>{
        return (
            <div className="border" key={group.group.id}>
                <Link to={`/chatGroup/${group.group.id}`}><h4>{group.group.name}</h4></Link>
                <p style={{fontSize: "0.8rem"}}>Owned by: {group.group.group_owner.first_name} {group.group.group_owner.last_name}</p>
            </div>
        )
    })

    // all groups div
    let groups_div = (
        <div>
            {groups_owned_list}
            {groups_member_of_list}
        </div>
    )

    let chat_groups_div = (
        <div className="w-full sm:w-[600px] rounded-md border border-gray-300 shadow-sm bg-white text-center m-2">
            <h2 className="pb-2">Chat Groups</h2>
            <CreateChatGroup getUserChatGroups={getUserChatGroups}/>
            {groups_div}
        </div>
    )

    return chat_groups_div;
}

export default ChatGroups;