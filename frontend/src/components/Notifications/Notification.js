import { useNavigate } from "react-router-dom";

const Notification = (props) => {

    const navigate = useNavigate();

    let bg_color = "bg-white";
    let border_color = "border-gray-300"
    if (!props.read) {
        bg_color = "bg-sky-200";
        border_color = "border-sky-500"
    }

    return (
        <div className={`w-full border ${border_color} ${bg_color} shadow-md rounded p-2 cursor-pointer`} onClick={()=>navigate(`/chatGroup/${props.group.id}`)}>
            <div className="w-full flex justify-start items-center">
                <div className="flex items-center">
                    <h3 className="text-lg font-semibold mr-2">{props.title}</h3>
                    <h3 className="font-semibold text-gray-500">({props.qty_missed})</h3>
                </div>
            </div>
            <div className="w-full flex justify-between items-center">
                <p className="text-base">{props.group.name}</p>
                <p className="text-sm">{`${props.updated_at.toLocaleDateString()} - ${props.updated_at.toLocaleTimeString()}`}</p>
            </div>
        </div>
    )
}

export default Notification;