import React, { useCallback, useEffect, useState } from "react";
import Container from "./component/Container";
import { Auth } from "./Auth";

import "./App.scss";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import Login from "./component/Login/Login";
import Header from "./component/Header/Header";
import Spinner from "./component/Spinner";
import FormsAPIClient from "./api/FormsAPIClient";


if (!process.env.IMJS_ITWIN_ID) {
  throw new Error('Add iTwinid in .env file');
}
const iTwinId: string = process.env.IMJS_ITWIN_ID;


const App: React.FC = () => {
  
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const authClient: BrowserAuthorizationClient = Auth.getClient();

  const formApiClient: FormsAPIClient = new FormsAPIClient(authClient, iTwinId);
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

  // API Testing useEffect

  useEffect(() => {
    (async () => {
      if (login) {
        console.log(await formApiClient.getFormsDefinitions());
      }
    })();
  }, [login]);
 
  return (
    <Container>
      <Header showFormList={login} authClient={authClient}/>
      {loading ? <div style={{height: 'calc(100vh - 60px)'}}><Spinner /></div> : 
      !login ? <Login authClient={authClient}/> : 
      <div>LoggedIn</div>}
    </Container>
  );
};

export default App;
