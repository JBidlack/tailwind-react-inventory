import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function withAuth(Component){
    return function Authenticated(props) {
        const navigate = useNavigate();

        function isAuthenticated() {
            const token = localStorage.getItem('token');
        
            return token !== null;
        }

        useEffect(() => {
            if(!isAuthenticated()) {
                navigate('/');
            }
        }, []);
        return <Component {...props} />
    }
}

export default withAuth;