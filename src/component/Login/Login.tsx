import { BrowserAuthorizationClient } from '@itwin/browser-authorization';
import React from 'react';


import "./Login.scss";

interface LoginProps {
    authClient: BrowserAuthorizationClient
}

const Login: React.FC<LoginProps> = ({ authClient }: LoginProps) => {
    return (
       <div className="login-container">
            <button className="login-btn" onClick={async () => {
                try {
                    await authClient.signIn();
                } catch {
                    console.log('signin failed');
                }
            }}>Login</button>
       </div>
    )
}

export default Login;