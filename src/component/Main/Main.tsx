import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainPage from "../MainPage/MainPage";

const Main: React.FC = () => {
    return (
       <div className="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
       </div>
    )
}


export default Main;