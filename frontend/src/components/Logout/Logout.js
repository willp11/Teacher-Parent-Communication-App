import './Logout.css';
import { useDispatch } from 'react-redux';
import authSlice from "../../store/slices/auth";
import Navigation from '../Navigation/Navigation';
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate('/login');
    }

    return (
        <div className="Logout">
            <Navigation />
            <h3 className="m-4">Are you sure you want to Logout?</h3>
            <button className="border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={handleLogout}>Confirm</button>
        </div>
    );
}

export default Logout;