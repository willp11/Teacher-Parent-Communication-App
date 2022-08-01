import { BellIcon } from "@heroicons/react/outline";

const Bell = (props) => {
    return (
        <div className={`relative h-[${props.height}px] w-[${props.width}px]`}>
            <BellIcon className={`h-[${props.height}px] w-[${props.width}px]`} />
            <div className={`h-[${props.height/2}px] w-[${props.width/2}px] rounded-full border border-gray-400 absolute top-0 right-0 bg-white flex items-center justify-center`}>
                <p className="text-sm font-semibold">{props.quantity}</p>
            </div>
        </div>
    )
}

export default Bell;