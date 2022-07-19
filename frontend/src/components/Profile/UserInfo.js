import ProfileImg from '../../Assets/Images/blank-profile.png';

const UserInfo = (props) => {

    let account_type = null;
    if (props.profile.teacher !== null) {
        account_type = "Teacher"
    } else if (props.profile.parent !== null) {
        account_type = "Parent"
    }

    const user_info_div = (
        <div className="rounded-md bg-sky-50 shadow-md mt-2 mb-4 p-4">
            <h2 className="pb-2 text-md text-gray-600">User Details</h2>
            <div className="flex flex-row">
                <div className="w-1/2 flex items-center justify-center">
                    <img src={ProfileImg} className="w-[130px] h-[130px] rounded-full" alt=""/>
                </div>
                <div className="text-left w-1/2">
                    <h2 className="text-gray-600 text-sm text-left">Name</h2>
                    <p className="pb-2">{props.profile.first_name} {props.profile.last_name}</p>
                    <h2 className="text-gray-600 text-sm text-left">Email</h2>
                    <p className="pb-2">{props.profile.email}</p>
                    <h2 className="text-gray-600 text-sm text-left">Account Type</h2>
                    <p className="pb-2">{account_type}</p>
                </div>
            </div>
        </div>
    )

    return user_info_div;
}

export default UserInfo;