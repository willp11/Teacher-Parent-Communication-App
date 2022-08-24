
const Notification = (props) => {
    return (
        <div className="w-full border border-gray-300 bg-sky-50 shadow-md rounded p-2">
            <div className="w-full flex justify-between items-center mb-1">
                <div className="flex items-center">
                    <h3 className="font-semibold mr-4">{props.title}</h3>
                    <h3 className="font-semibold text-gray-600">({props.qty_missed})</h3>
                </div>
                <p className="text-sm">{`${props.updated_at.toLocaleDateString()} - ${props.updated_at.toLocaleTimeString()}`}</p>
            </div>
            <div className="w-full flex justify-start">
                <p className="text-sm">{props.group.name}</p>
            </div>
        </div>
    )
}

export default Notification;