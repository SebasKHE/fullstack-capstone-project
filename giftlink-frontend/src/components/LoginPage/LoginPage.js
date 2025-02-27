import React, {use, useState} from 'react'; 
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = () => {
        console.log('Inside handleLogin');
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
                        </div>
                        <button className='btn btn-primary w-100 mb-3' onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;