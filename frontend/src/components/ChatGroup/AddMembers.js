import ChatContacts from "../ChatContacts/ChatContacts";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Popover } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

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
                props.getGroupMembers();
            })
            .catch(err=>{
                console.log(err)
            })
    }

    // list of users to add to group
    let user_list = parentList.map(parent=>{
        return (
            <div key={parent.user.id} className="bg-white rounded-md shadow-md p-2 my-4 border border-gray-500">
                <p className="pt-2 pb-4 font-bold">{parent.user.first_name} {parent.user.last_name}</p>
                <button 
                    className="border-px shadow-md shadow-gray-500 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full px-4 py-1" 
                    onClick={()=>removeFromListHandler(parent)}
                >   
                    remove
                </button>
            </div>
        )
    })
    let user_list_div = (
        <div className="w-full sm:w-[500px] max-h-[300px] overflow-auto bg-sky-100 rounded border border-gray-600 shadow-md p-2 mx-auto my-4">
            <h3>Users to add</h3>
            {(parentList.length > 0) ? user_list : <p>No users added to list</p>}
            {(parentList.length > 0) ? <button 
                                            className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1" 
                                            onClick={submitParentListHandler}>submit
                                        </button> : null}
            <p style={{fontSize: "0.8rem"}}>{message}</p>
        </div>
    )

    let show_contacts_btn = (
        <button 
            className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2"
            onClick={toggleShowContacts}
        >
            {showContacts ? "Hide Contacts" : "Show Contacts"}
        </button>
    )

    return (
        <div className="w-full sm:w-[650px] h-fit overflow-auto mx-auto bg-sky-200 rounded border border-gray-600 shadow-lg p-2">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 border border-gray-600 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Close Add Members</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
            <h2 className="pt-2">Add to group</h2>
            {user_list_div}
            {show_contacts_btn}
            {showContacts ? <ChatContacts from="add_members" addToListHandler={addToListHandler}/> : null }
        </div>
    )
}

export default AddMembers;