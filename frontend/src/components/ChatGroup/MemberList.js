import AddMembers from './AddMembers';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const MemberList = (props) => {

    let member_list = props.members.map((member)=>{
        return (
            <div key={member.user.id}>
                <p>{member.user.first_name} {member.user.last_name}</p>
            </div>
        )
    })

    let add_member_popover = (
        <Popover>
            <Popover.Button className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2">
                Add Members
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute z-10 top-[80px] inset-x-0 p-2 transition transform origin-top-right"
                >
                    <AddMembers groupId={props.groupId} members={props.members}/>
                </Popover.Panel>
            </Transition>
        </Popover>
    )

    let member_list_div = (
        <div className="w-full sm:w-[500px] max-h-[500px] overflow-auto bg-sky-100 p-2 m-2 border border-gray-600 shadow-lg">
            <h2>Group Members</h2>
            {props.direct ? null : add_member_popover}
            {member_list}
        </div>
    )

    return member_list_div;
}

export default MemberList;