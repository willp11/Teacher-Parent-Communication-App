import './ChatGroups.css';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CreateChatGroup from '../CreateChatGroup/CreateChatGroup';
import { Link } from 'react-router-dom';

const ChatGroups = (props) => {

    // const token = useSelector((state)=>state.auth.token);

    // // const [groupsOwned, setGroupsOwned] = useState([]);
    // const [groupsMemberOf, setGroupsMemberOf] = useState([]);

    // // Get list of user's chat groups
    // const getUserChatGroups = useCallback(() => {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + token
    //     }
    //     const url = 'http://localhost:8000/api/v1/school/chat-group-user-get/';
    //     axios.get(url, {headers: headers})
    //         .then(res=>{
    //             console.log(res);
    //             // setGroupsOwned(res.data.chat_groups_owned);
    //             setGroupsMemberOf(res.data.chat_group_member);
    //         })
    //         .catch(err=>{
    //             console.log(err);
    //         })
    // }, [token])

    // // On component mount - get all user's chat groups they own and are a member of
    // useEffect(()=>{
    //     getUserChatGroups();
    // }, [getUserChatGroups])

    // JSX
    // list of chat groups you own
    // let groups_owned_list = groupsOwned.map(group=>{
    //     return (
    //         <div className="border" key={group.id}>
    //             <Link to={`/chatGroup/${group.id}`}><h4>{group.name}</h4></Link>
    //             <p style={{fontSize: "0.8rem"}}>Owned by: You</p>
    //         </div>
    //     )
    // })
    
    // list of chat groups you are member of
    let groups_member_of_list = props.groupsMemberOf.map(group=>{
        let group_members_string = "";
        group.group.chat_members.every((member, idx, arr)=>{
            group_members_string += `${member.user.first_name} ${member.user.last_name}`;
            // just show 5 members names
            if (idx < arr.length-1) {
                if (idx < 5) {
                    group_members_string += ", "
                } else {
                    group_members_string += "..."
                    return false;
                }
            }
        })
        return (
            <div className="rounded bg-sky-100 shadow-md px-2 pt-2 pb-4 mb-4" key={group.group.id}>
                <Link className="text-blue-700 underline" to={`/chatGroup/${group.group.id}`}><h4 className="pb-1">{group.group.name}</h4></Link>
                {/* <p className="text-sm p-1">Owned by: {group.group.group_owner.first_name} {group.group.group_owner.last_name}</p> */}
                <p className="text-sm p-1"><span className="font-bold">Members: </span><span>{group_members_string}</span></p>
            </div>
        )
    })

    // all groups div
    let groups_div = (
        <div>
            {/* {groups_owned_list} */}
            {groups_member_of_list}
        </div>
    )

    let chat_groups_div = (
        <div className="w-full sm:w-[600px] rounded-md shadow-md bg-white text-center m-2 p-4">
            <h2 className="pb-2">Chats</h2>
            <CreateChatGroup getUserChatGroups={props.getUserChatGroups}/>
            {groups_div}
        </div>
    )

    return chat_groups_div;
}

export default ChatGroups;