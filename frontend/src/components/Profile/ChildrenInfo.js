import { Link } from "react-router-dom";

const ChildrenInfo = (props) => {

    // Parent accounts only - list of their children
    let children_list = props.profile.parent.children.map(child => {
        return (
            <div key={child.id} className="border border-gray-500 rounded-md shadow-md w-64 mx-auto my-2 bg-white">
                <Link to={"/studentProfile/"+child.id}><h4 className="text-blue-700 underline">{child.name}</h4></Link>
                <p>{child.school_class.school.name}</p>
                <p>{child.school_class.name}</p>
            </div>
        )
    })

    let children_info_div = (
        <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="text-md">Children</h2>
            {children_list}
        </div>
    )

    return children_info_div;
}

export default ChildrenInfo;