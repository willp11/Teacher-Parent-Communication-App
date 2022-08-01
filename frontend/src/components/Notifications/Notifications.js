import Navigation from "../Navigation/Navigation";
import Notification from "./Notification";

const Notifications = () => {

    let notifications_div = (
        <div>
            <Notification title={"New Event"} content={"Birthday Party"} datetime={new Date()} />
            <Notification title={"New Announcement"} content={"Bring spelling books."} datetime={new Date()} />
            <Notification title={"New Story"} content={"Look at this activity we did today."} datetime={new Date()} />
        </div>
    )

    return (
        <div className="relative bg-white h-screen overflow-auto">
            <Navigation />
            <div className="bg-slate-100 h-[calc(100%-80px)] w-full flex flex-col items-center justify-start">
                <div className="w-full bg-indigo-500 text-white text-center py-2 mb-2">
                    <h1 className="drop-shadow-lg">Notifications</h1>
                </div>
                <div className="w-full sm:w-[600px] h-[500px] bg-white text-center mt-2 border border-gray-300 rounded shadow-md overflow-auto">
                    {notifications_div}
                </div>
            </div>
        </div>
    )
}

export default Notifications;