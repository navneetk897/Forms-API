import React from "react";

import "./Header.scss";
import FormSelect from "./FormSelect";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

interface HeaderProps {
    showFormList: boolean;
    authClient: BrowserAuthorizationClient
}

const Header: React.FC<HeaderProps> = ({ showFormList, authClient }: HeaderProps) => {
    return (
        <div className="header">
            <div className="header-container">
                <img className="itwin-logo" src="https://www.bentley.com/wp-content/uploads/2022/04/itwin-software-logo-black-100X100.svg" alt=" "></img>
                <h1 className="header-title">Forms API</h1>
                {showFormList && <FormSelect />}
                {showFormList && <button className="logout" onClick={async () => {
                    await authClient.signOut();
                }}>Logout</button>}
            </div>
            <hr />
        </div>
    )
}

export default Header;