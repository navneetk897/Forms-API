import React, { useCallback, useEffect, useState } from "react";
import Container from "./component/Container";
import { Auth } from "./Auth";

import "./App.scss";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import Login from "./component/Login/Login";
import Header from "./component/Header/Header";
import Spinner from "./component/Spinner";



const App: React.FC = () => {
  
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const authClient: BrowserAuthorizationClient = Auth.getClient();

  const tryLogin = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      console.log('SilentSign Failed.');
      setLoading(false);
    }
  }, [authClient]);


  useEffect(() => {
    void tryLogin();
  }, [tryLogin]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (authClient.isAuthorized) {
        setLogin(true);
        setLoading(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [authClient, authClient.isAuthorized]);
 
  return (
    <Container>
      <Header showFormList={login}/>
      {loading ? <div style={{height: 'calc(100vh - 60px)'}}><Spinner /></div> : 
      !login ? <Login authClient={authClient}/> : 
      <div>LoggedIn</div>}
    </Container>
  );
};

export default App;
