import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import profileImg from '../../Assets/Images/blank-profile.png';
import Navigation from "../Navigation/Navigation";
import { useGroupMembers } from "../../Hooks/useGroupMembers";
import MemberList from "./MemberList";

const VideoChat = () => {

    ///////////////////////
    //// STATE
    ///////////////////////

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);
    const account = useSelector((state)=>state.auth.account);

    const {groupMembers, loadingMembers} = useGroupMembers(token, id);
    
    const [connected, setConnected] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [isInCall, setIsInCall] = useState(false);

    // other user's ID
    const [otherUser, setOtherUser] = useState(null);
    const [otherUserName, setOtherUserName] = useState("");

    const [remoteRTCMessage, setRemoteRTCMessage] = useState(null);
    const [iceCandidatesFromCaller, setIceCandidatesFromCaller] = useState([]);
    // const [callInProgress, setCallInProgress] = useState(false);

    const socketRef = useRef(null);
    const connection = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Determine who the other user is
    useEffect(()=>{
        if (groupMembers.length === 2) {
            groupMembers.every((member)=>{
                if (member.user.id !== account.id) {
                    setOtherUser(`${member.user.id}`)
                    setOtherUserName(member.user.first_name)
                    return false;
                }
                return true;
            })
        }
    }, [groupMembers, account.id])

    // Clear socket and peer connection when unmount
    useEffect(()=>{
        return () => {
            if (socketRef.current !== null) {
                socketRef.current.close()
                socketRef.current = null
            }
            if (connection.current !== null) {
                connection.current.close();
                connection.current = null;
            }
        }
    }, [])

    // connect to socket
    const connect = () => {
        connectSocket();
    }

    // get the peer connection and send the call
    const call = async () => {
        let peerConnection = await beReady();
        console.log(peerConnection)
        processCall(peerConnection, otherUser)
        setIsCalling(true);
    }

    // get the peer connection and answer the call
    const answer = async () => {
        let peerConnection = await beReady();
        processAccept(peerConnection);
        setIsReceivingCall(false);
        setIsInCall(true);
    }

    // connect to websocket
    const connectSocket = () => {

        const callSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/call/${id}/${token}/`
        );
    
        callSocket.onopen = (e) =>{
            callSocket.send(JSON.stringify({
                type: 'login',
                data: { }
            }));
            socketRef.current = callSocket;
            setConnected(true);
        }

        callSocket.onclose = (e) => {
            console.log("connection closed");
            setConnected(false);
            stop();
        }
    
        callSocket.onmessage = (e) =>{
            let response = JSON.parse(e.data);
            let type = response.type;
    
            if(type === 'connection') {
                console.log(response.data.message)
                setConnected(true);
            }
    
            if(type === 'call_received') {
                setRemoteRTCMessage(response.data.rtcMessage);
                setIsReceivingCall(true);
            }
    
            if(type === 'call_answered') {
                setRemoteRTCMessage(response.data.rtcMessage);
                connection.current.setRemoteDescription(new RTCSessionDescription(response.data.rtcMessage));
                setIsInCall(true);
                setIsCalling(false);
            }
    
            if(type === 'ICEcandidate') {
                onICECandidate(response.data);
            }

            if(type === 'call_cancelled') {
                removePeerConnection();
                setIsReceivingCall(false);
                setIsCalling(false);
                setIsInCall(false);
            }
        }
    
        const onICECandidate = (data) =>{
            console.log("GOT ICE candidate");
    
            let message = data.rtcMessage
    
            let candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
    
            if (connection.current) {
                console.log("ICE candidate Added");
                connection.current.addIceCandidate(candidate);
            } else {
                console.log("ICE candidate Pushed");
                let newIceCandidatesFromCaller = [...iceCandidatesFromCaller];
                newIceCandidatesFromCaller.push(candidate);
                setIceCandidatesFromCaller(newIceCandidatesFromCaller);
            }
    
        }
    
    }
    
    /////////////////////////////////////////////////////////////
    // functions for sending messages to socket
    /////////////////////////////////////////////////////////////

    // send call
    const sendCall = (data) => {
        socketRef.current.send(JSON.stringify({
            type: 'call',
            data
        }));
        setIsCalling(true);
    }

    // cancel call
    const cancelCall = () => {
        socketRef.current.send(JSON.stringify({
            type: 'cancel_call'
        }))
        setIsCalling(false);
    }
    
    // answer call
    const answerCall = (data) => {
        socketRef.current.send(JSON.stringify({
            type: 'answer_call',
            data
        }));
        setIsReceivingCall(false);
        setIsInCall(true);
    }
    
    // send ICE candidate
    const sendICEcandidate = (data) => {
        socketRef.current.send(JSON.stringify({
            type: 'ICEcandidate',
            data
        }));
    }

    /////////////////////////////////////////////////////////
    // Functions for creating peer connection, sending ICE candidates to other user and getting remote stream
    ///////////////////////////////////////////////////////

    // IN PRODUCTION WE NEED TO SETUP STUN AND TURN SERVERS
    // let pcConfig = {
    //     "iceServers":
    //         [
    //             { "url": "stun:stun." },
    //             {
    //                 "url": "turn:turn.",
    //                 "username": "guest",
    //                 "credential": "somepassword"
    //             }
    //         ]
    // };

    // Get local media stream and create peer connection
    const beReady = async () => {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            localVideoRef.current.srcObject = stream;
            let peerConnectionWithStream = createPeerConnectionAddStream(stream)
            return peerConnectionWithStream;
        } catch(e) {
            alert('getUserMedia() error: ' + e.name);
        }
        
    }

    // Send connection offer to peer
    const processCall = (peerConnection, userName) => {
        peerConnection.createOffer((sessionDescription) => {
            peerConnection.setLocalDescription(sessionDescription);
            sendCall({
                name: userName,
                rtcMessage: sessionDescription
            })
            connection.current = peerConnection;
        }, (error) => {
            console.log(error);
        });
    }

    // Answer connection offer from peer
    const processAccept = (peerConnection) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
        peerConnection.createAnswer((sessionDescription) => {
            peerConnection.setLocalDescription(sessionDescription);
            answerCall({
                caller: otherUser,
                rtcMessage: sessionDescription
            });
            connection.current = peerConnection;
            console.log("answered call")
        }, (error) => {
            console.log(error);
        })
    }

    // Create peer connection and add local stream to connection. Set functions to deal with getting ICE candidates (send to peer) and on stream added/removed events
    const createPeerConnectionAddStream = (stream) => {
        try {
            // WHEN WE USE STUN AND TURN SERVERS WE PASS CONFIG AS ARG HERE
            // peerConnection = new RTCPeerConnection(pcConfig);
            
            // create peer connection
            let peerConnection = new RTCPeerConnection();
            peerConnection.onicecandidate = handleIceCandidate;
            peerConnection.onaddstream = handleRemoteStreamAdded;
            peerConnection.onremovestream = handleRemoteStreamRemoved;

            // add stream
            peerConnection.addStream(stream);

            return peerConnection;
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;
        }
    }

    // Send ICE candidates to peer
    const handleIceCandidate = (event) => {
        if (event.candidate) {
            console.log("Local ICE candidate");

            sendICEcandidate({
                user: otherUser,
                rtcMessage: {
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                }
            })

        } else {
            console.log('End of candidates.');
        }
    }

    // Remote stream added event - set the remote video object
    const handleRemoteStreamAdded = (event) => {
        console.log('Remote stream added.');

        remoteVideoRef.current.srcObject = event.stream;
    }

    // Remove stream removed event - set the remote and local video objects to null
    const handleRemoteStreamRemoved = (event) => {
        console.log('Remote stream removed. Event: ', event);

        localVideoRef.current = null;
        remoteVideoRef.current = null;
    }

    window.onbeforeunload = function () {
        if (isInCall) {
            stop();
        }
    };

    ////////////////////////////////////////////////////////////
    // Reset functions - reset UI, disconnect from socket, remove video stream objects
    /////////////////////////////////////////////////////////////

    // Reset - remove video ref and peer connection
    const removePeerConnection = () => {
        if (localVideoRef.current !== null) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        if (connection.current !== null) {
            connection.current.close();
            connection.current = null;
        }
    }
    
    // Stop - reset and send cancel call message to socket to notify other user that call is cancelled
    const stop = () => {
        removePeerConnection();
        cancelCall();
        setIsInCall(false);
    }

    // Function for disconnecting from websocket manually (user clicks disconnect button)
    const disconnect = () => {
        if (socketRef.current !== null) {
            socketRef.current.close()
            socketRef.current = null
            setConnected(false)
            stop()
        }
    }

    /////////////////////////
    //// JSX
    ////////////////////////

    const localVideo = (
        <video width="100px" id="localVideo" autoPlay muted playsInline ref={localVideoRef} />
    )
    const remoteVideo = (
        <video className="w-[500px]" id="remoteVideo" autoPlay playsInline ref={remoteVideoRef} />
    )

    const callDiv = (
        <div id="call" className="w-full">
            <div className="bg-white w-full sm:w-[500px] mx-auto my-2 px-2 py-4 border border-gray-300 rounded shadow-md flex flex-col items-center justify-start">
                <h2>Send Call</h2>
                <button className="w-32 rounded p-2 mt-2 text-white font-semibold bg-sky-500 hover:bg-indigo-500" onClick={call}>Call</button>
            </div>
        </div>
    )

    const answerDiv = (
        <div id="answer" className="w-full">
            <div className="bg-white w-full h-[300px] sm:w-[500px] mx-auto my-2 p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h2>Incoming Call</h2>
                <img className="w-[100px] h-[100px] rounded-full my-2" src={profileImg} alt="" />
                <h3><span id="callerName">{otherUserName}</span></h3>
                <button className="w-32 rounded bg-green-600 hover:bg-green-700 border border-gray-300 text-white font-semibold p-2 m-2" onClick={answer}>Answer</button>
            </div>
        </div>
    )

    const callingDiv = (
        <div id="calling" className="w-full">
            <div className="bg-white w-full h-[300px] sm:w-[500px] mx-auto my-2 p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h2>Calling</h2>
                <img className="w-[100px] h-[100px] rounded-full my-2" src={profileImg} alt=""/>
                <h3><span id="otherUserNameCA">{otherUserName}</span></h3>
                <button className="w-32 rounded bg-red-600 hover:bg-red-700 border border-gray-300 text-white font-semibold p-2 m-2" onClick={cancelCall}>Cancel</button>
            </div>
        </div>
    );

    const inCallDiv = (
        <div id="inCall" className="w-full">
            <div className="bg-white w-full sm:w-[500px] mx-auto p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h3>On Call With</h3>
                <h2><span id="otherUserNameC">{otherUserName}</span></h2>
            </div>
        </div>
    )

    const videosDiv = (
        <div id="videos" className={isInCall ? "text-center" : "hidden"}>
            <div className="absolute top-4 right-2">
                {localVideo}
            </div>
            <div id="remoteVideoDiv">
                {remoteVideo}
            </div>
            <button className="w-32 rounded bg-sky-500 hover:bg-indigo-500 border border-gray-300 text-white font-semibold p-2 mx-2 mt-4" onClick={stop}>End call</button>
        </div>
    )

    return (
        <div className="relative bg-slate-100 overflow-auto h-screen">
            <Navigation />
            <div className="w-full flex-col items-center justify-center">
                <div className="w-full bg-indigo-500 py-2">
                    <h1 className="font-white drop-shadow-lg text-white">Video Chat</h1>
                </div>
                <div className=" relative w-[calc(100%-1rem)] mx-auto flex flex-col items-center">
                    <MemberList members={groupMembers} loading={loadingMembers} connected={connected} disconnect={disconnect} connect={connect}/>

                    {connected && !isCalling && !isInCall && !isReceivingCall ? callDiv : null}

                    {connected && isReceivingCall ? answerDiv : null}

                    {connected && isCalling ? callingDiv : null}

                    {connected && isInCall ? inCallDiv : null}

                    <br/>
                    {videosDiv}
                </div>
            </div>
        </div>
    )
}

export default VideoChat;