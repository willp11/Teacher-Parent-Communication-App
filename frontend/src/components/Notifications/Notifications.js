// import Navigation from "../Navigation/Navigation";
import Notification from "./Notification";
import { useNotifications } from "../../Hooks/useNotifications";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Notifications = () => {

    const token = useSelector((state)=>state.auth.token);
    const {notifications, loading, getNotifications} = useNotifications();

    // Sort notifications by last updated
    const sortedNotifications = useMemo(()=>{
        const notifs = [...notifications];
        notifs.sort((a,b)=>{
            return Date.parse(b.updated_at) - Date.parse(a.updated_at)
        })
        return notifs;
    }, [notifications]);

    let notifications_div = sortedNotifications.map(notification=>{
        return <Notification 
            key={`${notification.type}${notification.id}`} 
            id={notification.id}
            type={notification.type}
            title={notification.title}
            group={notification?.group}
            school_class={notification?.school_class}
            updated_at={new Date(notification.updated_at)}
            read={notification.read}
            qty_missed={notification.qty_missed}
            getNotifications={getNotifications}
        />
    })

    const clearAllHandler = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.API_URL}/api/v1/school/all-notifications-update/`;
        const data = {};
        try {
            const res = await axios.put(url, data, {headers: headers});
            console.log(res);
            getNotifications();
        } catch(err) {
            console.log(err);
        }
    }

    let clearAllCursor = "cursor-pointer";
    if (notifications.length === 0) clearAllCursor = "cursor-not-allowed";

    return (
        <div className="w-full sm:w-[620px] h-[500px] bg-white text-center mt-2 border border-gray-300 rounded shadow-lg overflow-auto z-20">
            <h2 className="mt-2">Notifications</h2>
            <button 
                className={`border border-gray-red-300 bg-red-600 text-white font-semibold py-1 px-2 rounded hover:bg-red-700 my-2 ${clearAllCursor}`} 
                onClick={clearAllHandler}
                disabled={notifications.length === 0}
            >
                Clear All
            </button>
            {loading ? <p>Loading...</p> : notifications_div}
        </div>
    )
}

export default Notifications;