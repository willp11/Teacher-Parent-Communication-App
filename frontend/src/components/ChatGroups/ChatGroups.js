import './ChatGroups.css';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateChatGroup from '../CreateChatGroup/CreateChatGroup';

const ChatGroups = () => {

    const token = useSelector((state)=>state.auth.token);


    

    let chat_groups_div = (
        <div className="chat-groups-div">
            <h2>Chat Groups</h2>
            <CreateChatGroup />
        </div>
    )

    return chat_groups_div;
}

export default ChatGroups;