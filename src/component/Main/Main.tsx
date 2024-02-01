import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainPage from "../MainPage/MainPage";
import FormData from "../FormData/FormData";



interface MainProps {
    toggleFilter: (filter: boolean) => void;
}

const Main: React.FC<MainProps> = ({ toggleFilter }) => {


    return (
       <div className="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage toggleFilter={toggleFilter}/>} />
                    <Route path="/forms/:id" element={<FormData toggleFilter={toggleFilter} />} />
                </Routes>
            </BrowserRouter>
       </div>
    )
}


export default Main;