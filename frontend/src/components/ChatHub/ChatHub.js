import './ChatHub.css';
import Navigation from '../Navigation/Navigation';
import ChatContacts from '../ChatContacts/ChatContacts';
import ChatGroups from '../ChatGroups/ChatGroups';

const ChatHub = () => {
    return (
        <div className="ChatHub">
            <Navigation />
            <h1>Chat</h1>
            <ChatGroups />
            <ChatContacts />
        </div>
    )
}

export default ChatHub;