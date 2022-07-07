import './ChatGroup.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AddMembers from './AddMembers';
import MemberList from './MemberList';

const ChatGroup = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);

    const [groupMembers, setGroupMembers] = useState([]);

    // Get all members and messages for this chat group
    const getGroupMessages = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `http://localhost:8000/api/v1/school/chat-group-messages-list/${id}/`;
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id])

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

    // On Mount - get all group members and messages
    useEffect(()=>{
        getGroupMembers()
        getGroupMessages()
    }, [getGroupMembers, getGroupMessages])

    return (
        <div className="ChatGroup">
            <h1>Group: {id}</h1>
            <div style={{display: "flex", flexDirection: "row"}}>
                <MemberList members={groupMembers} />
                <AddMembers groupId={id} members={groupMembers} />
            </div>
        </div>
    )
}

export default ChatGroup;