import React from "react";

import "./Header.scss";
import FormSelect from "./FormSelect";

interface HeaderProps {
    showFormList: boolean;
}

const Header: React.FC<HeaderProps> = ({ showFormList }: HeaderProps) => {
    return (
        <div className="header">
            <div className="header-container">
                <img className="itwin-logo" src="https://www.bentley.com/wp-content/uploads/2022/04/itwin-software-logo-black-100X100.svg" alt=" "></img>
                <h1 className="header-title">Forms API</h1>
                {showFormList && <FormSelect />}
            </div>
            <hr />
        </div>
    )
}

export default Header;