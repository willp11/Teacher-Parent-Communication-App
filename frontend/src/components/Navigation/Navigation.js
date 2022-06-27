import './Navigation.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {

    const token = useSelector((state)=>state.auth.token);

    let nav_content = (
        <div className="Nav">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    );
    
    if (token !== null ) {
        nav_content = (
            <div className="Nav">
                <Link to="/logout">Logout</Link>
                <Link to="/profile">Profile</Link>
            </div>
        );
    }

    return nav_content;

}

export default Navigation;