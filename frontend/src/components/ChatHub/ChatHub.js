import './ChatHub.css';
import Navigation from '../Navigation/Navigation';
import ChatContacts from '../ChatContacts/ChatContacts';

const ChatHub = () => {
    return (
        <div className="ChatHub">
            <Navigation />
            <h1>Chat</h1>
            <ChatContacts />
        </div>
    )
}

export default ChatHub;