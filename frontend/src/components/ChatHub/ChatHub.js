import './ChatHub.css';
import Navigation from '../Navigation/Navigation';
import ChatContacts from '../ChatContacts/ChatContacts';
import ChatGroups from '../ChatGroups/ChatGroups';

const ChatHub = () => {
    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <Navigation />
            <div className="w-full p-2 flex items-center justify-center md:px-4 lg:px-8">
                <div className="w-full rounded-md border border-gray-300 shadow-sm bg-sky-200 text-center">
                    <h1 className="pb-2">Chat</h1>
                    <div className="w-full flex items-start justify-start flex-wrap">
                        <ChatContacts from="chat_hub"/>
                        {/* <ChatGroups /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHub;