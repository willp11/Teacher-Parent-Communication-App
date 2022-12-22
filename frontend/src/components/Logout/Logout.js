import { useDispatch, useSelector } from 'react-redux';
import authSlice from "../../store/slices/auth";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../Hooks/useNotifications';
import { useState, useEffect } from 'react';
import PageTitle from '../UI/PageTitle';
import SubmitBtn from '../UI/SubmitBtn';

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {setNotifications} = useNotifications();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state)=>state.auth.token);

    useEffect(()=>{
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        setLoading(true);
        setNotifications([]);
        dispatch(authSlice.actions.logout());
        navigate('/login');
        setLoading(false);
    }

    return (
        <div className="relative bg-white h-screen overflow-auto">
            <Navigation />
            <div className="bg-slate-100 h-[calc(100%-80px)] w-full flex flex-col items-center justify-start">
                <PageTitle title="Logout" />
                <div className="bg-white w-full sm:w-[600px] text-center p-4 mt-4 border-2 border-gray-300 shadow-md rounded-md">
                    <h3 className="mb-4 ">Are you sure you want to Logout?</h3>
                    <div className="flex justify-center">
                        <SubmitBtn 
                            loading={loading}
                            textContent="Confirm"
                            clickHandler={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Logout;