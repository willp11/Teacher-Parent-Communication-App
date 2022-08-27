import { useDispatch } from 'react-redux';
import authSlice from "../../store/slices/auth";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../Hooks/useNotifications';

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {setNotifications} = useNotifications();

    const handleLogout = () => {
        setNotifications([]);
        dispatch(authSlice.actions.logout());
        navigate('/login');
    }

    return (
        <div className="relative bg-white h-screen overflow-auto">
            <Navigation />
            <div className="bg-slate-100 h-[calc(100%-80px)] w-full flex flex-col items-center justify-start">
                <div className="w-full bg-indigo-500 text-white text-center py-2 mb-2">
                    <h1 className="drop-shadow-lg">Logout</h1>
                </div>
                <div className="bg-white w-full sm:w-[600px] text-center p-4 mt-4 border-2 border-gray-300 shadow-md rounded-md">
                    <h3 className="m-4">Are you sure you want to Logout?</h3>
                    <button className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" onClick={handleLogout}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default Logout;