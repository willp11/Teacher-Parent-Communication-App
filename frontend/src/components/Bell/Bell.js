import { BellIcon } from "@heroicons/react/outline";

const Bell = (props) => {
    return (
        <div className={`relative h-[28px] w-[28px] cursor-pointer`}>
            <BellIcon className={`h-[28px] w-[28px]`} />
            {
                props.quantity &&
                <div className={`h-[18px] w-[18px] rounded-full border border-gray-400 absolute top-[-4px] right-[-4px] bg-white flex items-center justify-center`}>
                    <p className="text-sm font-semibold">{props.quantity}</p>
                </div>
            }
        </div>
    )
}

export default Bell;