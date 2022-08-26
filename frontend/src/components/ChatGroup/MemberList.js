import AddMembers from './AddMembers';
import { useEffect, useState } from 'react';
import { WifiIcon } from "@heroicons/react/outline";

const MemberList = (props) => {

    const [showAddMembers, setShowAddMembers] = useState(false);

    let member_list = props.members.map((member)=>{
        let connected_status = member.connected_to_chat;
        if (member.user.id === props.userId) {
            connected_status = true;
        }
        let stroke = 'stroke-red-500';
        if (connected_status) {
            stroke = 'stroke-green-500';
        }
        return (
            <div key={member.user.id} className="flex items-center justify-between w-36 mx-auto my-2">
                <p>{member.user.first_name} {member.user.last_name}</p>
                <WifiIcon className={`h-6 w-6 mr-4 ${stroke}`} />
            </div>
        )
    });
    
    let add_member_btn = (
        <button 
            onClick={()=>setShowAddMembers(true)} 
            className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-1 my-2"
        >
            Add Members
        </button>
    )

    let member_list_div = (
        <div className="w-full sm:w-[500px] max-h-[200px] overflow-auto bg-white p-2 mb-2 mt-4 border border-gray-300 shadow-lg rounded">
            <h2>Group Members</h2>
            {props.direct ? null : add_member_btn}
            {member_list}
            {showAddMembers ? <AddMembers groupId={props.groupId} members={props.members} getGroupMembers={props.getGroupMembers} hide={()=>setShowAddMembers(false)} /> : null}
        </div>
    )

    return member_list_div;
}

export default MemberList;