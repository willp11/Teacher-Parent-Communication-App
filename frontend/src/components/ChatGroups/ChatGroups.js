import './ChatGroups.css';
import CreateChatGroup from '../CreateChatGroup/CreateChatGroup';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatGroups = (props) => {

    // need user account to check if they are the sender or recipient of a direct message - for the displayed group name
    const user_account = useSelector((state)=>state.auth.account)
    
    // list of chat groups you are member of
    let groups_member_of_list = props.groupsMemberOf.map(group=>{
        // show 5 members of group
        let group_members_string = "";
        group.group.chat_members.every((member, idx, arr)=>{
            if (idx < 5) {
                group_members_string += `${member.user.first_name} ${member.user.last_name}`;
                if (idx !== arr.length-1) {
                    group_members_string += ", "
                }
                return true;
            } else if (idx === 5) {
                group_members_string += "..."
                return false;
            }
        })
        // if direct message change group name to the other member of the group
        let group_name = group.group.name;
        if (group.group.direct_message === true) {
            if (user_account.account.id === group.group.group_owner.id) {
                group_name = `${group.group.recipient.first_name} ${group.group.recipient.last_name}`
            } else if (user_account.account.id === group.group.recipient.id) {
                group_name = `${group.group.group_owner.first_name} ${group.group.group_owner.last_name}`
            }
        }
        return (
            <div className="rounded bg-sky-100 shadow-md px-2 pt-2 pb-4 mb-4" key={group.group.id}>
                <Link className="text-blue-700 underline" to={`/chatGroup/${group.group.id}`}><h4 className="pb-1">{group_name}</h4></Link>
                <p className="text-sm p-1"><span className="font-bold">Members: </span><span>{group_members_string}</span></p>
            </div>
        )
    })

    // all groups div
    let groups_div = (
        <div>
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