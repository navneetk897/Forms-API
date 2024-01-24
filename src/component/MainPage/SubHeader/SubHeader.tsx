import React, { useEffect, useState } from "react";

import "./SubHeader.scss";
import { formApiClient } from "../../..";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { fetchFormDataInstance } from "../../../store/slices/formDataSlice";
import InspectionFormModel from "./FormModel/InspectionFormModel/InspectionFormModel";
import ReactDOM from "react-dom";
import DailyLogFormModel from "./FormModel/DailyLogFormModel/DailyLogFormModel";

interface SubHeaderProps {
    deleteIds: string[];
    addDeletedIds: (ids: string[]) => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({ deleteIds, addDeletedIds }) => {
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();
    const [dataHover, setDataHover] = useState(false);
    const [showModel, setShowModel] = useState<boolean> (false);


    useEffect(() => {
        if (deleteIds.length > 0) {
            setDataHover(true);
        } else {
            setDataHover(false);
        }
    }, [deleteIds]);

    console.log(selectedFormDef?.type);
    
    return (
        <>
            <div className="sub-header">
                <button className="create-btn" onClick={() => {
                    setShowModel(!showModel);
                }}>Create New</button>
                <button data-hover={dataHover ? 'active' : 'inactive'} className="delete-btn" onClick={async () => {
                    await Promise.all(
                        deleteIds.map(id => formApiClient.deleteFormData(id))
                    );
                    if (deleteIds.length > 0) {
                        dispatch(fetchFormDataInstance(selectedFormDef!.type));
                    }
                    addDeletedIds([]);
                }}>Delete</button>
            </div>
            <hr />
            {showModel && ReactDOM.createPortal(<div className="overlay" onClick={() => setShowModel(!showModel)}/>, document.getElementById('overlays')!)}
            {showModel && selectedFormDef && selectedFormDef.type === 'Inspection' && ReactDOM.createPortal(<InspectionFormModel setShowModel={setShowModel}/>, document.getElementById('models')!)}
            {showModel && selectedFormDef && selectedFormDef.type === 'Daily Log' && ReactDOM.createPortal(<DailyLogFormModel setShowModel={setShowModel}/>, document.getElementById('models')!)}
        </>
    )
}

export default SubHeader