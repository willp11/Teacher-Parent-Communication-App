const MemberList = (props) => {

    let member_list = props.members.map((member)=>{
        return (
            <div key={member.user.id}>
                <p>{member.user.first_name} {member.user.last_name}</p>
            </div>
        )
    })
    
    let member_list_div = (
        <div className="w-full sm:w-[500px] max-h-[200px] text-center overflow-auto bg-white p-2 my-2 border border-gray-600 shadow-lg">
            <h2>Group Members</h2>
            {member_list}
        </div>
    )

    return member_list_div;
}

export default MemberList;