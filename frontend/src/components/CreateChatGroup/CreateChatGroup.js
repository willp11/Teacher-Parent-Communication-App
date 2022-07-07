import './CreateChatGroup.css';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

const CreateChatGroup = () => {
    const token = useSelector((state)=>state.auth.token);
    const [newGroupName, setNewGroupName] = useState("");
    const [message, setMessage] = useState("");
    const [countMsgUpdates, setCountMsgUpdates] = useState(0); // stops useEffect getting called again when message is updated

    useEffect(()=>{
        const remove_msg = setTimeout(()=>{
            setMessage("");
        }, 5000)
        return () => {
            clearTimeout(remove_msg);
        }
    }, [countMsgUpdates])

    const handleCreateGroup = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name: newGroupName.trim()
        }
        const url = "http://localhost:8000/api/v1/school/chat-group-create/"
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setNewGroupName("");
                setMessage("Group created successfully");
                setCountMsgUpdates(countMsgUpdates+1);
            })
            .catch(err=>{
                console.log(err);
                setMessage("Error creating group");
            })
    }

    let create_group_div = (
        <div className="create-group-div">
            <h3>Create Chat Group</h3>
            <input value={newGroupName} placeholder="Group name" onChange={(e)=>setNewGroupName(e.target.value)} />
            <button onClick={handleCreateGroup}>Submit</button>
            <p style={{fontSize: "0.9rem"}}>{message}</p>
        </div>
    )

    return create_group_div;
}

export default CreateChatGroup;