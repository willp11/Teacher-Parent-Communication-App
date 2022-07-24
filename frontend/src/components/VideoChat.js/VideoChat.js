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

    // const [groupMembers] = useGroupMembers(token, id);
    const {groupMembers, loadingMembers} = useGroupMembers(token, id);
    
    const [connected, setConnected] = useState(false);

    // other user's ID
    const [otherUser, setOtherUser] = useState(null);
    const [otherUserName, setOtherUserName] = useState("");

    const [remoteRTCMessage, setRemoteRTCMessage] = useState(null);
    const [iceCandidatesFromCaller, setIceCandidatesFromCaller] = useState([]);
    const [callInProgress, setCallInProgress] = useState(false);
    const [callSocket, setCallSocket] = useState(null);

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
    }, [groupMembers])

    /////////////////////////
    //// DIV STYLES
    /////////////////////////

    const [callDivStyle, setCallDivStyle] = useState({display: "none"});
    const [callingDivStyle, setCallingDivStyle] = useState({display: "none"});
    const [inCallDivStyle, setInCallDivStyle] = useState({display: "none"});
    const [answerDivStyle, setAnswerDivStyle] = useState({display: "none"});
    const [videoDivStyle, setVideoDivStyle] = useState({display: "none"});

    //////////////////////////////////////////////
    //// FUNCTIONS
    ///////////////////////////////////////////////

    const login = () => {
        setCallDivStyle({display: "block"});

        connectSocket();
    }

    // get the peer connection and send the call
    const call = async () => {
        let peerConnection = await beReady();
        processCall(peerConnection, otherUser)
    }

    // get the peer connection and answer the call
    const answer = async () => {
        let peerConnection = await beReady();

        processAccept(peerConnection);

        setAnswerDivStyle({display: "none"});
    }

    // connect to websocket
    const connectSocket = () => {

        let callSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/call/${token}/`
        );
    
        callSocket.onopen = event =>{
            callSocket.send(JSON.stringify({
                type: 'login',
                data: {
                }
            }));
        }

        callSocket.onclose = (e) => {
            console.log("connection closed");
            setConnected(false);
            setCallDivStyle({display: "none"})
        }
    
        callSocket.onmessage = (e) =>{
            let response = JSON.parse(e.data);
            let type = response.type;
    
            if(type === 'connection') {
                console.log(response.data.message)
                setConnected(true);
            }
    
            if(type === 'call_received') {
                // console.log(response);
                onNewCall(response.data)
            }
    
            if(type === 'call_answered') {
                onCallAnswered(response.data);
            }
    
            if(type === 'ICEcandidate') {
                onICECandidate(response.data);
            }

            if(type === 'call_cancelled') {
                onCallCancelled(response.data);
            }
        }

        const onCallCancelled = (data) => {
            console.log(`Call with ${data.user} cancelled`);
            setAnswerDivStyle({display: "none"})
            setCallDivStyle({display: "none"});
            setCallingDivStyle({display: "none"});
            setInCallDivStyle({display: "none"});

            stop()
        }
    
        const onNewCall = (data) =>{
            setRemoteRTCMessage(data.rtcMessage);
            setCallDivStyle({display: "none"});
            setAnswerDivStyle({display: "block"})
        }
    
        const onCallAnswered = (data) =>{
            setRemoteRTCMessage(data.rtcMessage);
            connection.current.setRemoteDescription(new RTCSessionDescription(data.rtcMessage));
            setCallingDivStyle({display: "none"});
    
            callProgress()
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

        setCallSocket(callSocket)
    
    }

    // disconnect from websocket
    const disconnect = () => {
        if (callSocket !== null) {
            callSocket.close()
            setCallSocket(null)
            setConnected(false)
            stop()
            setCallDivStyle({display: "none"});
        }
    }
    
    // send call
    const sendCall = (data) => {
        callSocket.send(JSON.stringify({
            type: 'call',
            data
        }));

        setCallDivStyle({display: "none"});
        setCallingDivStyle({display: "block"});
    }

    // cancel call
    const cancelCall = () => {
        callSocket.send(JSON.stringify({
            type: 'cancel_call'
        }))

        setCallDivStyle({display: "block"});
        setCallingDivStyle({display: "none"});
    }
    
    // answer call
    const answerCall = (data) => {
        callSocket.send(JSON.stringify({
            type: 'answer_call',
            data
        }));
        callProgress();
    }
    
    // send ICE candidate
    const sendICEcandidate = (data) => {
        callSocket.send(JSON.stringify({
            type: 'ICEcandidate',
            data
        }));
    }

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

    const processCall = (peerConnection, userName) => {
        peerConnection.createOffer((sessionDescription) => {
            peerConnection.setLocalDescription(sessionDescription);
            sendCall({
                name: userName,
                rtcMessage: sessionDescription
            })

            connection.current = peerConnection;
            console.log("processed call")
        }, (error) => {
            console.log(error);
        });
    }

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

    /////////////////////////////////////////////////////////

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

            console.log('Created RTCPeerConnnection');
            return peerConnection;
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;
        }
    }

    const handleIceCandidate = (event) => {
        // console.log('icecandidate event: ', event);
        if (event.candidate) {
            console.log("Local ICE candidate");
            // console.log(event.candidate.candidate);

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

    const handleRemoteStreamAdded = (event) => {
        console.log('Remote stream added.');

        remoteVideoRef.current.srcObject = event.stream;
    }

    const handleRemoteStreamRemoved = (event) => {
        console.log('Remote stream removed. Event: ', event);

        localVideoRef.current = null;
        remoteVideoRef.current = null;
    }

    window.onbeforeunload = function () {
        if (callInProgress) {
            stop();
        }
    };
    
    const stop = () => {

        if (localVideoRef.current.srcObject !== null) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        setCallInProgress(false);

        if (connection.current !== null) {
            connection.current.close();
            connection.current = null;
        }

        setCallDivStyle({display: "block"});
        setAnswerDivStyle({display: "none"});
        setInCallDivStyle({display: "none"});
        setCallingDivStyle({display: "none"});
        setVideoDivStyle({display: "none"});

        // setOtherUser(null);
        cancelCall();
    }
    
    const callProgress = () => {
        setVideoDivStyle({display: "block"});
        setInCallDivStyle({display: "block"});
        setCallInProgress(true);
    }


    /////////////////////////
    //// JSX
    ////////////////////////

    const localVideo = (
        <video width="100px" id="localVideo" autoPlay muted playsInline ref={localVideoRef} />
    )
    const remoteVideo = (
        <video style={{width: "500px"}} id="remoteVideo" autoPlay playsInline ref={remoteVideoRef} />
    )

    const callDiv = (
        <div id="call" className="w-full" style={callDivStyle}>
            <div className="bg-white w-full sm:w-[500px] mx-auto my-2 px-2 py-4 border border-gray-300 rounded shadow-md flex flex-col items-center justify-start">
                <h2>Send Call</h2>
                <button className="w-32 rounded p-2 mt-2 text-white font-semibold bg-sky-500 hover:bg-indigo-500" onClick={call}>Call</button>
            </div>
        </div>
    )

    const answerDiv = (
        <div id="answer" className="w-full" style={answerDivStyle}>
            <div className="bg-white w-full h-[300px] sm:w-[500px] mx-auto my-2 p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h2>Incoming Call</h2>
                <img className="w-[100px] h-[100px] rounded-full my-2" src={profileImg} alt="" />
                <h3><span id="callerName">{otherUserName}</span></h3>
                <button className="w-32 rounded bg-green-600 hover:bg-green-700 border border-gray-300 text-white font-semibold p-2 m-2" onClick={answer}>Answer</button>
            </div>
        </div>
    )

    const callingDiv = (
        <div id="calling" className="w-full" style={callingDivStyle}>
            <div className="bg-white w-full h-[300px] sm:w-[500px] mx-auto my-2 p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h2>Calling</h2>
                <img className="w-[100px] h-[100px] rounded-full my-2" src={profileImg} alt=""/>
                <h3><span id="otherUserNameCA">{otherUserName}</span></h3>
                <button className="w-32 rounded bg-red-600 hover:bg-red-700 border border-gray-300 text-white font-semibold p-2 m-2" onClick={cancelCall}>Cancel</button>
            </div>
        </div>
    );

    const inCallDiv = (
        <div id="inCall" className="w-full" style={inCallDivStyle}>
            <div className="bg-white w-full sm:w-[500px] mx-auto p-2 border border-gray-300 rounded shadow-md flex flex-col items-center justify-center">
                <h3>On Call With</h3>
                <h2><span id="otherUserNameC">{otherUserName}</span></h2>
            </div>
        </div>
    )

    const videosDiv = (
        <div id="videos" style={videoDivStyle} className="text-center">
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
                    <MemberList members={groupMembers} loading={loadingMembers} connected={connected} disconnect={disconnect} login={login}/>

                    {callDiv}

                    {answerDiv}

                    {callingDiv}

                    {inCallDiv}

                    <br/>

                    {videosDiv}
                </div>
            </div>
        </div>
    )
}

export default VideoChat;