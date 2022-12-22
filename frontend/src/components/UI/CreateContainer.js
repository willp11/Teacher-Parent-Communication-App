import {ChevronUpIcon, ChevronDownIcon} from '@heroicons/react/solid';

const CreateContainer = ({title, showForm, setShowForm, children}) => {
    return (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow-md shadow-gray-300 bg-white border-2 border-gray-300 text-center">
            <h3>{title}</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
            : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm && children}
        </div>
    )
}

export default CreateContainer;