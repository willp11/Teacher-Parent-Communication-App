import { useNavigate } from "react-router-dom";

const Notification = (props) => {

    const navigate = useNavigate();

    let bg_color = "bg-white";
    if (!props.read) bg_color = "bg-sky-100";

    return (
        <div className={`w-full border border-gray-300 ${bg_color} shadow-md rounded p-2 cursor-pointer`} onClick={()=>navigate(`/chatGroup/${props.group.id}`)}>
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