import { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import starImg from '../../Assets/Images/star-sticker.jpg';
import dinosaurImg from '../../Assets/Images/dinosaur-sticker.jpg';
import catImg from '../../Assets/Images/cat-sticker.jpg';
import {useMessage} from '../../Hooks/useMessage';
import SubmitBtn from "../UI/SubmitBtn";

const AwardSticker = (props) => {
    
    const token = useSelector((state)=>state.auth.token);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    // Award sticker function
    const awardSticker = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            student: props.studentId,
            type: selectedSticker
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/sticker-create/`;
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setSelectedSticker(null);
                setMessage(`Sticker awarded to ${props.name}`);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // Sticker image styles
    const img_classname = "h-[50px] w-[50px] p-1 mx-2 cursor-pointer";
    const selected_img_classname = "h-[50px] w-[50px] border-2 border-black rounded-full p-1 mx-2"

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={awardSticker}
            textContent="Submit"
        />
    )

    return (
        <div className="w-64 max-w-full mx-auto my-2 p-2 text-center">
            <h4>Award student sticker</h4>
            <div className="flex align-center justify-center my-2">
                <img src={starImg} alt="star" onClick={()=>setSelectedSticker(1)} className={selectedSticker === 1 ? selected_img_classname : img_classname} />
                <img src={dinosaurImg} alt="dinosaur" onClick={()=>setSelectedSticker(2)} className={selectedSticker === 2 ? selected_img_classname : img_classname} />
                <img src={catImg} alt="cat" onClick={()=>setSelectedSticker(3)} className={selectedSticker === 3 ? selected_img_classname : img_classname} />
            </div>
            <div className="flex justify-center mt-2">
                {submit_btn}
            </div>
            <p className="text-sm">{message}</p>
        </div>
    )
}

export default AwardSticker;