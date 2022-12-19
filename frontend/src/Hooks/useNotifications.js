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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/notifications-get/`;
        if (token) {
            try {
                setLoading(true);
                const res = await axios.get(url, {headers: headers});
                console.log(res.data)
                setNotifications(res.data);
            } catch(err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    }, [token, setLoading, setNotifications])

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