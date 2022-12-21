import { XIcon } from "@heroicons/react/outline";

const EditModal = ({title, toggleEditMode, children}) => {
    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            <div className="relative w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
                <h3>{title}</h3>
                <XIcon 
                    className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                    onClick={toggleEditMode}
                />
                {children}
            </div>
        </div>
    )
}

export default EditModal;