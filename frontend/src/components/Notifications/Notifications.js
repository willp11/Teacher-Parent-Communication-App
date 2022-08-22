import Navigation from "../Navigation/Navigation";
import Notification from "./Notification";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

const Notifications = () => {

    const token = useSelector(state=>state.auth.token);
    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState([]);
    
    const getNotifications = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/notifications-get/';
        setLoading(true);
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setNotifications(res.data.notifications);
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [token])

    useEffect(()=>{
        getNotifications()
    }, [getNotifications])

    let notifications_div = notifications.map(notification=>{
        return <Notification key={notification.id} title={notification.title} content={notification.content} datetime={new Date(notification.created_at)} />
    })

    return (
        <div className="relative bg-white h-screen overflow-auto">
            <Navigation />
            <div className="bg-slate-100 h-[calc(100%-80px)] w-full flex flex-col items-center justify-start">
                <div className="w-full bg-indigo-500 text-white text-center py-2 mb-2">
                    <h1 className="drop-shadow-lg">Notifications</h1>
                </div>
                <div className="w-full sm:w-[600px] h-[500px] bg-white text-center mt-2 border border-gray-300 rounded shadow-md overflow-auto">
                    {loading ? <p>Loading...</p> : notifications_div}
                </div>
            </div>
        </div>
    )
}

export default Notifications;