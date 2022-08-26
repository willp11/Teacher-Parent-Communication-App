import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Notification = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const setNotificationRead = async (type) => {
        let endpoint = '';
        if (type === 'Announcement' || type === 'Event' || type === 'Story') {
            endpoint = 'class-notification-update';
        } else if (type === 'Message' || type === 'IsCalling' || type === 'MissedCall' || type === 'CallCancelled') {
            endpoint = 'chat-notification-update';
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        console.log(type);
        const url = `http://127.0.0.1:8000/api/v1/school/${endpoint}/${props.id}/`
        const data = {read: true}
        try {
            const res = await axios.put(url, data, {headers: headers});
            console.log(res);
            props.getNotifications();
        } catch(err) {
            console.log(err);
        }
    }

    let navigate_dst = `/chatGroup/${props.group?.id}`;
    if (props.title === "Missed call") navigate_dst = `/videoChat/${props.group?.id}`;
    if (props.school_class) navigate_dst = `/class/${props.school_class?.id}`
    
    let group_name = props.group?.name;
    if (props.group?.direct_message) group_name = `${props.group.recipient?.first_name} ${props.group.recipient?.last_name}`

    if (props.school_class) group_name = props.school_class?.name

    return (
        <div className={`w-full border border-gray-300 bg-gray-50 shadow-md rounded p-2`}>
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center">
                    <h3 className="text-lg font-semibold mr-2">{props.title}</h3>
                    <h3 className="font-semibold text-gray-500">({props.qty_missed})</h3>
                </div>
                <button className="border border-gray-red-300 bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded hover:bg-red-700" onClick={()=>setNotificationRead(props.type)}>Clear</button>
            </div>
            <div className="w-full flex justify-between items-center">
                <Link to={navigate_dst}><p className="text-base text-blue-500 underline font-semibold">{group_name}</p></Link>
                <p className="text-sm">{`${props.updated_at.toLocaleDateString()} - ${props.updated_at.toLocaleTimeString()}`}</p>
            </div>
        </div>
    )
}

export default Notification;