import ChatContacts from "../ChatContacts/ChatContacts";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AddMembers = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // list of parents to add to group
    const [parentList, setParentList] = useState([]);

    // show contacts div
    const [showContacts, setShowContacts] = useState(true);

    // already member error message
    const [message, setMessage] = useState("");
    const [messageCount, setMessageCount] = useState(0);

    // remove error message after 5 seconds
    useEffect(()=>{
        let resetMsg = setTimeout(()=>{
            setMessage("");
        }, [5000]);

        return () => {
            clearTimeout(resetMsg);
        }
    }, [messageCount])

    // function to toggle showing contacts
    const toggleShowContacts = () => {
        setShowContacts(!showContacts);
    }

    // function to handle adding new parents to list
    const addToListHandler = (parent) => {
        // check user isn't already in list
        let userFound = false;
        parentList.forEach(p=>{
            if (p.user.id === parent.user.id) {
                userFound = true;
                setMessage(`${parent.user.first_name} ${parent.user.last_name} is already in the list`);
                setMessageCount(messageCount + 1);
            }
        })

        // check user isn't already a group member
        props.members.forEach(member=>{
            if (member.user.id === parent.user.id) {
                userFound = true;
                setMessage(`${parent.user.first_name} ${parent.user.last_name} is already in the group`);
                setMessageCount(messageCount + 1);
            } 
        })

        // add user to list
        if (userFound === false) {
            let list = [...parentList];
            list.push(parent);
            setParentList(list);
            console.log(list);
        }
    }
    
    // function to remove user from list
    const removeFromListHandler = (parent) => {
        // find user in list
        let index = null;
        parentList.forEach((p, idx)=>{
            if (p.user.id === parent.user.id) index=idx;
        })
        if (index !== null) {
            let list = [...parentList];
            list.splice(index, 1);
            setParentList(list);
            console.log(list);
        }
    }

    // function to submit list
    const submitParentListHandler = () => {
        console.log("submitting list")
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }

        // turn list of users into data required by API
        let data_arr = [];
        parentList.forEach(parent=>{
            let user = {
                user: parent.user.id,
                group: props.groupId
            }
            data_arr.push(user)
        })
        const url = `http://localhost:8000/api/v1/school/chat-group-add-members/${props.groupId}/`;
        axios.post(url, data_arr, {headers: headers})
            .then(res=>{
                console.log(res)
                setParentList([]);
            })
            .catch(err=>{
                console.log(err)
            })
    }

    // list of users to add to group
    let user_list = parentList.map(parent=>{
        return (
            <div key={parent.user.id} style={{margin: "10px", border: "1px solid grey", padding: "10px"}}>
                <p>{parent.user.first_name} {parent.user.last_name}</p>
                <button onClick={()=>removeFromListHandler(parent)}>remove</button>
            </div>
        )
    })
    let user_list_div = (
        <div className="add-users-inner-div">
            <h3>Users to add</h3>
            {(parentList.length > 0) ? user_list : <p>No users added to list</p>}
            {(parentList.length > 0) ? <button onClick={submitParentListHandler}>submit</button> : null}
            <p style={{fontSize: "0.8rem"}}>{message}</p>
        </div>
    )

    let show_contacts_btn = (
        <button style={{marginBottom: "10px"}} onClick={toggleShowContacts}>{showContacts ? "Hide Contacts" : "Show Contacts"}</button>
    )

    return (
        <div className="add-users-to-group-div">
            <h2>Add to group</h2>
            {user_list_div}
            {show_contacts_btn}
            {showContacts ? <ChatContacts from="add_members" addToListHandler={addToListHandler}/> : null }
        </div>
    )
}

export default AddMembers;