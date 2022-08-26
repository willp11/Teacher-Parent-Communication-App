import Navigation from "../Navigation/Navigation";
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
        const url = 'http://127.0.0.1:8000/api/v1/school/all-notifications-update/';
        const data = {};
        try {
            const res = await axios.put(url, data, {headers: headers});
            console.log(res);
            getNotifications();
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="relative bg-white h-screen overflow-auto">
            <Navigation />
            <div className="bg-slate-100 h-[calc(100%-80px)] w-full flex flex-col items-center justify-start">
                <div className="w-full bg-indigo-500 text-white text-center py-2 mb-2">
                    <h1 className="drop-shadow-lg">Notifications</h1>
                </div>
                <div className="w-full sm:w-[600px] h-[500px] bg-white text-center mt-2 border border-gray-300 rounded shadow-md overflow-auto">
                    <button className="rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold my-2" onClick={clearAllHandler}>Clear All</button>
                    {loading ? <p>Loading...</p> : notifications_div}
                </div>
            </div>
        </div>
    )
}

export default Notifications;