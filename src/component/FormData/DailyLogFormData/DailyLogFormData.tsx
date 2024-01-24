import React, { useEffect, useState } from "react";

import "./DailyLogFormData.scss";
import { useAppSelector } from "../../../store/hooks";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formApiClient } from "../../..";
import { fetchFormDataInstance } from "../../../store/slices/formDataSlice";
import ReactDOM from "react-dom";
import Spinner from "../../Spinner";


const DailyLogFormData: React.FC = () => {
    const params = useParams();
    const [formData] = useAppSelector(state => state.formData.formDataInstanceDailyLogs.filter((form: any) => form.id === params.id!));
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();

    const [name] = useState<string>(formData.properties.Name);
    const [date] = useState<string>(formData.properties.Date.toString().split('T')[0]);
    const [workforce, setWorkforce] = useState<number>(formData.properties.Workforce);
    const [milestone, setMiletone] = useState<number>(formData.properties.Milestones);
    const [concern, setConcern] = useState<string>(formData.properties.Concern);
    const [sign, setSign] = useState<string | undefined>(formData.properties.Sign);
    const [file, setFile] = useState<File>();
    const [dataHover, setDataHover] = useState<boolean>(false);
    const [close, setClose] = useState<boolean>(() => {
        if (formData.state === 'Closed') return true;
        return false;
    });


    const [loading, setLoading] = useState<boolean>(false);

    console.log(formData, formData.state);

    useEffect(() => {
        if (formData) {
            if (workforce !== formData.properties.Workforce || milestone !== formData.properties.Milestones 
                || concern !== formData.properties.Concern) {
                    setDataHover(true);
            } else if (sign && sign !== formData.properties.Sign) {
                setDataHover(true);
            } else if (file) {
                setDataHover(true);
            } else {
                setDataHover(false);
            }
        }
        
    }, [workforce, milestone, concern, sign, formData, file]);

    const onUpdate = async () => {
        if (!dataHover) return;


        if (name.length === 0) return;
        if (date.length === 0) return;
        if (!workforce) return;
        if (!milestone) return;
        setLoading(true);
        const updateData = {
            properties: {
                Workforce: workforce,
                Milestones: milestone,
                Concern: concern
            }
        };

        await formApiClient.updateFormData(params.id!, updateData);
        if (!formData.properties.Sign && sign && sign.length > 0) {
            const updateData = {
                properties: {
                    Sign: sign,
                    Signdate: new Date(),
                    Signid: formData.assignee.id
                }
            };
            await formApiClient.updateFormData(params.id!, updateData);
        }
        if (file) {
            await formApiClient.addAttachmentToForm(params.id!, { 
                fileName: file.name
            });
            const { attachments }  = await formApiClient.getFormDataAttachment(params.id!);
            const attachmentId = attachments[attachments.length - 1].id;
            const res = await formApiClient.uploadAttachmentToForm(params.id!, attachmentId, file);
            if (res) {
                setFile(undefined);
                console.log('file uploaded successfully.');
            }
        }

        setLoading(false);
        dispatch(fetchFormDataInstance(selectedFormDef!.type));
    }

    const onClose = async () => {
        setLoading(true);
        const updateData = {
            status: 'Closed'
        };

        await formApiClient.updateFormData(params.id!, updateData);
        setLoading(false);
        setClose(true);
        dispatch(fetchFormDataInstance(selectedFormDef!.type));
    }

    const onReopen = async () => {
        setLoading(true);
        const updateData = {
            status: 'Open'
        };

        await formApiClient.updateFormData(params.id!, updateData);
        setLoading(false);
        setClose(false);
        dispatch(fetchFormDataInstance(selectedFormDef!.type));
    }

    return (
        <div className="dailyLogForm-data">
            <div className="title">Daily Log</div>
            <div className="grid-container">
                <div className="name">
                    <label>Inspector's Name</label>
                    <input style={{ cursor: 'not-allowed' }} type="text" required value={name}  readOnly/>
                </div>
                <div className="date">
                    <label>Date</label>
                    <input style={{ cursor: 'not-allowed' }} type="date" required value={date} readOnly/>
                </div>
                <div className="workforce">
                    <label>Workforce on Site</label>
                    <input style={close ? {cursor: 'not-allowed'} : {}} type="number" value={workforce} readOnly={close} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWorkforce(Number(event.target.value));
                    }}/>
                </div>
                <div className="milestone">
                    <label>Milestone achieved</label>
                    <input style={close ? {cursor: 'not-allowed'} : {}} type="number" value={milestone} readOnly={close} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setMiletone(Number(event.target.value));
                    }}/>
                </div>
                <div className="text-area">
                    <label data-type="issue">Issues and concern</label>
                   <textarea style={close ? {cursor: 'not-allowed'} : {}} value={concern} readOnly={close} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setConcern(event.target.value);
                   }}/>
                </div>
                <div className="file-attachment">
                    <label>Attachment</label>
                    <label className="file-upload">
                        <p>File Upload</p>
                        <input style={{ display: 'none'}} type="file" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.files) {
                                setFile(event.target.files[0]);
                                event.target.files = null;
                            }
                        }}/>
                    </label>
                </div>
                <div className="signature">
                    <div className="sign">
                        <label>Signature</label>
                        <input type="text" value={sign ? sign.length > 0 ? sign : '' : ''} readOnly/>
                    </div>
                    <span className="edit-icon" onClick={() => {
                        if (!formData.properties.Sign) {
                            if (sign && sign.length > 0) {
                                setSign('');
                            } else {
                                setSign(formData.assignee.displayName);
                            }
                        } 
                    }}>
                        <span className="icon"></span>
                    </span>
                </div>
            </div>
            <div className="btns">
                <button style={!dataHover ? { background: 'grey' } : {}} data-hover={dataHover ? 'active' : 'inactive'} className="submit-btn" onClick={onUpdate}>Update</button>
                {!close && <button className="submit-btn" onClick={onClose}>Close</button>}
                {close && <button className="submit-btn" onClick={onReopen}>Reopen</button>}
            </div>
            {loading && ReactDOM.createPortal(<div style={{ zIndex: 101, opacity: 0 }} className="overlay" />, document.getElementById('overlays')!)}
            {loading && <Spinner />}
        </div>
    )
}

export default DailyLogFormData;