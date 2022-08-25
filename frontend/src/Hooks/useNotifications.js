import React, {useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const NotificationContext = React.createContext();

export const NotificationsProvider = ({children}) => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const contextValue = [notifications, setNotifications, loading, setLoading]

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const token = useSelector((state) => state.auth.token);
    const [notifications, setNotifications, loading, setLoading] = useContext(NotificationContext);

    const getNotifications = useCallback(async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://127.0.0.1:8000/api/v1/school/notifications-get/';
        try {
            console.log("getting notifications")
            setLoading(true);
            const res = await axios.get(url, {headers: headers});
            let notifs = [...res.data.chat_notifications];
            setNotifications(notifs);
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [token])

    useEffect(()=>{
        getNotifications();
    }, [getNotifications])

    return {
        notifications, 
        setNotifications,
        loading,
        getNotifications
    }
}