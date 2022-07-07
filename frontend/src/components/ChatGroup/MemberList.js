
const MemberList = (props) => {

    let member_list = props.members.map((member)=>{
        return (
            <div key={member.user.id}>
                <p>{member.user.first_name} {member.user.last_name}</p>
            </div>
        )
    })

    let member_list_div = (
        <div className="member-list-div">
            <h2>Group Members</h2>
            {member_list}
        </div>
    )

    return member_list_div;
}

export default MemberList;