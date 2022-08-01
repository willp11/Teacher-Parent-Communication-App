import { XIcon } from "@heroicons/react/outline";

const HelperList = (props) => {

    let helpers = props.helpers.map(helper=>{
        return (
            <p key={helper.id} className="my-1">{`${helper.parent.user.first_name} ${helper.parent.user.last_name}`}</p>
        )
    })

    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            <div className="relative w-full sm:w-[500px] h-[500px] overflow-auto p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
                <XIcon 
                    className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                    onClick={()=>props.setShowHelperList(false)}
                />
                <h2 className="pb-2">Helpers</h2>
                {props.helpers.length === 0 ? <p>There are no helpers registered.</p> : helpers}
            </div>
        </div>
    )
}

export default HelperList;