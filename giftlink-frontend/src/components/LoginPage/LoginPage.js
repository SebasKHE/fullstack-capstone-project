import React, {useEffect, useState} from 'react'; 
import './LoginPage.css';
import {urlConfig} from '../../config';
import {useAppConext} from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import { post } from '../../../../giftlink-backend/routes/authRoutes';
import logger from '../../../../giftlink-backend/logger';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const {setIsLoggedIn} = useAppConext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-toekn')) {
            navigate('/app')
        }
    }, [navigate])
    
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : ''
                }, 
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const json = await response.json();
            console.log('Json', json);
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                document.getElementById('email').value="";
                document.getElementById("password").value="";
                setIncorrect('Wrong password. Try again');
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }
        } catch (e) {
            logger.error('Incorrect passpo')
        }
    }

    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-6 col-lg-4'>
                    <div className='login-card p-4 border rounded'>
                        <h2 className='text-center mb-4 font-weight-bold'>Login</h2>
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>Email</label>
                            <input 
                            type='text' 
                            className='form-control' 
                            id='email' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input 
                            type='password' 
                            className='' 
                            id='password' 
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        </div>
                        <button className='btn btn-primary w-100 mb-3' onClick={handleLogin}>Login</button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default LoginPage;