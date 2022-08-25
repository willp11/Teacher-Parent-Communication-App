import Navigation from "../Navigation/Navigation";
import Notification from "./Notification";
import { useNotifications } from "../../Hooks/useNotifications";

const Notifications = () => {

    const {notifications, loading} = useNotifications();

    let notifications_div = notifications.map(notification=>{
        return <Notification 
            key={notification.id} 
            type={notification.type}
            title={notification.title}
            group={notification.group}
            updated_at={new Date(notification.updated_at)}
            read={notification.read}
            qty_missed={notification.qty_missed}
        />
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