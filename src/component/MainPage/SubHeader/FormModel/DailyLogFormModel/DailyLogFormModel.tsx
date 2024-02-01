import React, { useState } from "react";
import { formApiClient } from "../../../../..";

import "./DailyLogFormModel.scss";
import { useAppSelector } from "../../../../../store/hooks";
import { useDispatch } from "react-redux";
import { fetchFormDataInstance } from "../../../../../store/slices/formDataSlice";
import ReactDOM from "react-dom";
import Spinner from "../../../../Spinner";

interface DailyLogformModelProps {
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const DailyLogFormModel: React.FC<DailyLogformModelProps> = ({ setShowModel }) => {
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [concern, setConcern] = useState<string>('');
    const [workforce, setWorkforce] = useState<number>();
    const [milestone, setMiletone] = useState<number>();
    const [sign, setSign] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async () => {
        if (name.length === 0) return;
        if (date.length === 0) return;
        if (concern.length === 0) return;
        if (!workforce) return;
        if (!milestone) return;
        setLoading(true);
        const data = {
            formId: selectedFormDef?.id,
            properties: {
                Name: name,
                Date: date,
                Workforce: workforce,
                Milestones: milestone,
                Concern: concern
            }
        };
        const result = await formApiClient.createFormData(data);
        if (result && sign) {
            const updateData = {
                properties: {
                    Sign: result.formData.assignee.displayName,
                    Signdate: new Date(),
                    Signid: result.formData.assignee.id
                }
            };
            await formApiClient.updateFormData(result.formData.id, updateData);
        }
        if (file) {
            await formApiClient.addAttachmentToForm(result.formData.id, { 
                fileName: file.name
            });
            const { attachments }  = await formApiClient.getFormDataAttachment(result.formData.id);
            const attachmentId = attachments[0].id;
            const res = await formApiClient.uploadAttachmentToForm(result.formData.id, attachmentId, file);
            if (res) {
                console.log('file uploaded successfully.');
            }
        }

        setLoading(false);
        setShowModel(false);
        dispatch(fetchFormDataInstance(selectedFormDef!.type));
    }

    return (
        <div className="dailyLogForm-model">
            <div className="title">Daily Log</div>
            <div className="grid-container">
                <div className="name">
                    <label>Inspector's Name</label>
                    <input type="text" required value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}/>
                </div>
                <div className="date">
                    <label>Date</label>
                    <input type="date" required value={date} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setDate(event.target.value);
                    }}/>
                </div>
                <div className="workforce">
                    <label>Workforce on Site</label>
                    <input type="number" value={workforce} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWorkforce(Number(event.target.value));
                    }}/>
                </div>
                <div className="milestone">
                    <label>Milestone achieved</label>
                    <input type="number" value={milestone} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setMiletone(Number(event.target.value));
                    }}/>
                </div>
                <div className="text-area">
                    <label data-type="issue">Issues and concern</label>
                   <textarea value={concern} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setConcern(event.target.value);
                   }}/>
                </div>
                <div className="file-attachment">
                    <label>Attachment</label>
                    <label className="file-upload">
                        <p>File Upload</p>
                        <input style={{ display: 'none'}} type="file" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setFile(event.target.files ? event.target.files[0] : null);
                        }}/>
                    </label>
                </div>
                <div className="signature">
                    <div className="sign">
                        <label>Signature</label>
                        <input type="text" value={sign ? 'Navneet Kumar' : ''} readOnly/>
                    </div>
                    <span className="edit-icon" onClick={() => {
                        setSign(!sign);
                    }}>
                        <span className="icon"></span>
                    </span>
                </div>
            </div>
            <div className="btns">
                <button className="submit-btn" onClick={onSubmit}>Submit</button>
                <button className="close-btn" onClick={() => setShowModel(false)}>Close</button>
            </div>
            {loading && ReactDOM.createPortal(<div style={{ zIndex: 101, opacity: 0 }} className="overlay" />, document.getElementById('overlays')!)}
            {loading && <Spinner />}
        </div>
    )
}

export default DailyLogFormModel;