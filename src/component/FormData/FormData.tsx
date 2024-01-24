import React, { useEffect, useState } from "react";

import "./FormData.scss";
import {  useParams, useSearchParams } from "react-router-dom";
import InspectionFormData from "./InspectionFormData/InspectionFormData";
import DailyLogFormData from "./DailyLogFormData/DailyLogFormData";
import Attachments from "./Attachments/Attachments";
import Comments from "./Comments/Comments";
import AuditTrail from "./AuditTrail/AuditTrail";
import { formApiClient } from "../..";
import ReactDOM from "react-dom";
import AssigneeModel from "./AssigneeModel/AssigneeModel";

interface FormDataProps {
    toggleFilter: (filter: boolean) => void;
}


const FormData: React.FC<FormDataProps> = ({ toggleFilter }) => {

    const [showComments, setShowComments] = useState<boolean>(false);
    const [showAttachment, setShowAttachment] = useState<boolean>(false);
    const [showAuditTrial, setShowAuditTrial] = useState<boolean>(false);

    const [showAssignModel, setShowAssignModel] = useState<boolean>(false);
    

    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const params = useParams();

    useEffect(() => {
        toggleFilter(false);
    }, [toggleFilter]);


    const onDownload = async () => {
        if (params && params.id) {
            const blob = await formApiClient.downloadFormAsFile(params.id);
            if (blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = type + '_' + params.id + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }
    }

    const onExport = async () => {
        if (params && params.id) {
            const res = await formApiClient.exportFormToStorage(params.id);
            if (res) {
                alert('Form is exported to iTwin storage.');
            }
        }
    }


    return (
        <div className="formData-container">
            <div className="buttons-container">
                <button className="btn" onClick={() => { 
                    setShowComments(true);
                    setShowAttachment(false);
                    setShowAuditTrial(false);
                }}>Comments</button>
                <button className="btn" onClick={() => {
                    setShowAttachment(true);
                    setShowComments(false);
                    setShowAuditTrial(false);
                }}>Attachments</button>
                <button className="btn" onClick={() => {
                    setShowAuditTrial(true);
                    setShowComments(false);
                    setShowAttachment(false);
                }}>Audit Trial</button>
                <button className="btn" onClick={onDownload}>Download Form</button>
                <button className="btn" onClick={onExport}>Export Form</button>
                <button className="btn" onClick={() => setShowAssignModel(true)}>Assign Form</button>
            </div>
            <hr />
            <div className="form-container">
                {type === 'Inspection' ? <InspectionFormData /> : <DailyLogFormData />}
                {(showComments || showAttachment || showAuditTrial) && <div className="form-overlay" onClick={() => {
                    setShowAttachment(false);
                    setShowAuditTrial(false);
                    setShowComments(false);
                }}/>}
                {showComments && <Comments close={setShowComments} />}
                {showAttachment && <Attachments close={setShowAttachment}/>}
                {showAuditTrial && <AuditTrail close={setShowAuditTrial} />}
            </div>
                {showAssignModel && ReactDOM.createPortal(<div className="overlay" onClick={() => setShowAssignModel(false)}/>, document.getElementById('overlays')!)}
                {showAssignModel && ReactDOM.createPortal(<AssigneeModel setShowAssignModel={setShowAssignModel}/>, document.getElementById('models')!)}
        </div>
    )
}

export default FormData;