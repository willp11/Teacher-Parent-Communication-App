import './AwardSticker.css';
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import starImg from '../../Assets/Images/star-sticker.jpg';
import dinosaurImg from '../../Assets/Images/dinosaur-sticker.jpg';
import catImg from '../../Assets/Images/cat-sticker.jpg';

const AwardSticker = (props) => {
    
    const token = useSelector((state)=>state.auth.token);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    // Award sticker function
    const awardSticker = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            student: props.student.id,
            type: selectedSticker
        }
        const url = 'http://localhost:8000/api/v1/school/sticker-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setSelectedSticker(null);
                setSuccessMsg(`Sticker awarded to ${props.student.name}`);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // Sticker image styles
    const img_style = {height: "50px", width: "50px"};
    const selected_img_style = {height: "50px", width: "50px", border: "1px solid grey", borderRadius: "25px"};

    return (
        <div className="student-award-sticker-div">
            <h4>Award Sticker</h4>
            <div className="student-award-sticker-div-inner">
                <img src={starImg} alt="star" onClick={()=>setSelectedSticker(1)} style={selectedSticker === 1 ? selected_img_style : img_style} />
                <img src={dinosaurImg} alt="dinosaur" onClick={()=>setSelectedSticker(2)} style={selectedSticker === 2 ? selected_img_style : img_style} />
                <img src={catImg} alt="cat" onClick={()=>setSelectedSticker(3)} style={selectedSticker === 3 ? selected_img_style : img_style} />
            </div>
            <button onClick={awardSticker}>Submit</button>
            <p style={{margin: "5px", fontSize: "0.9rem"}}>{successMsg}</p>
        </div>
    )
}

export default AwardSticker;