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
            <h3>Are you sure you want to Logout?</h3>
            <button onClick={handleLogout}>Confirm logout</button>
        </div>
    );
}

export default Logout;