
const Notification = (props) => {
    return (
        <div className="w-full border border-gray-300 bg-sky-50 shadow-md rounded p-2">
            <div className="w-full flex justify-between items-center mb-1">
                <h3>{props.title}</h3>
                <p className="text-sm">{`${props.datetime.toLocaleDateString()} - ${props.datetime.toLocaleTimeString()}`}</p>
            </div>
            <div className="w-full flex justify-start">
                <p className="text-sm">{props.content}</p>
            </div>
        </div>
    )
}

export default Notification;