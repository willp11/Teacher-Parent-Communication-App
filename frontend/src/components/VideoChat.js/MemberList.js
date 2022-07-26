import { WifiIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";

const MemberList = (props) => {

    const account = useSelector((state)=>state.auth.account);

    // Member list
    let member_list = props.members.map((member)=>{
        let stroke = "stroke-red-500";
        if (member.user.id === account.id) stroke = "stroke-green-500";
        let width = ""
        if (props.connected) width = "w-36"
        return (
            <div key={member.user.id} className="flex flex-col items-center justify-center">
                <div className={`flex justify-between items-center mb-2 truncate mx-auto ${width}`}>
                    <p className="w-full text-center">{member.user.id === account.id ? "You" : `${member.user.first_name} ${member.user.last_name}`}</p>
                    {props.connected ? <WifiIcon className={`h-[24px] w-[24px] ${stroke}`} /> : null}
                </div>
            </div>
        )
    })

    // Connect button
    let connect_btn_style = "w-32 rounded bg-sky-500 hover:bg-green-600 border border-gray-300 text-white font-semibold p-2 m-2"
    if (props.connected) connect_btn_style = "w-32 rounded bg-red-600 hover:bg-red-700 border border-gray-300 text-white font-semibold p-2 m-2"
    const connectBtn = (
        <div>
            <div>
                <button
                    className={connect_btn_style}
                    onClick={props.connected ? props.disconnect : props.connect}
                >
                    {props.connected ? "Disconnect" : "Connect"}
                </button>
            </div>
        </div>
    )

    let loading_div = <p>Loading...</p>
    
    let member_list_div = (
        <div className="w-full sm:w-[500px] max-h-[200px] text-center overflow-auto bg-white p-2 mb-2 mt-4 border border-gray-300 rounded shadow-md">
            <h2 className="py-2">Group Members</h2>
            {props.loading ? loading_div : member_list}
            {props.loading ? null : connectBtn}
        </div>
    )

    return member_list_div;
}

export default MemberList;