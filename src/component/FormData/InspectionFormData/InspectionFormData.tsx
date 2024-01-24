import React, { useEffect, useState } from "react";

import "./InspectionFormData.scss";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import Spinner from "../../Spinner";
import { formApiClient } from "../../..";
import { fetchFormDataInstance } from "../../../store/slices/formDataSlice";


const InspectionFormData: React.FC = () => {
    const params = useParams();
    const [formData]= useAppSelector(state => state.formData.formDataInstanceInspections.filter((form) => form.id === params.id!));
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();
    
    const [name] = useState<string>(formData.properties.Name);
    const [date] = useState<string>(formData.properties.Date);
    const [weather, setWeather] = useState<string>(formData.properties.Weather);
    const [description, setDescription] = useState<string>(formData.description);
    const [sign, setSign] = useState<string | undefined>(formData.properties.Sign);
    const [close, setClose] = useState<boolean>(() => {
        if (formData.state === 'Closed') return true;
        return false;
    });

    const [dataHover, setDataHover] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (formData) {
            if (weather !== formData.properties.Weather || description !== formData.description) {
                setDataHover(true);
            } else if (sign && sign !== formData.properties.Sign) {
                setDataHover(true);
            } else {
                setDataHover(false);
            }
        }
        
    }, [sign, formData, weather, description]);

    const onUpdate = async () => {
        if (!dataHover) return;
        const updateData = {
            properties: {
                Weather: weather,
                "_Description": description
            }
        };
        setLoading(true);
        await formApiClient.updateFormData(params.id!, updateData);
        if (!formData.properties.Sign && sign && sign.length > 0) {
            const updateData = {
                properties: {
                    Sign: formData.assignee.displayName,
                    Signdate: new Date(),
                    Signid: formData.assignee.id
                }
            };
            await formApiClient.updateFormData(params.id!, updateData);
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
        <div className="inspectionForm-data">
            <div className="title">Inspection Form</div>
            <div className="grid-container">
                <div className="name">
                    <label>Inspector's Name</label>
                    <input style={{ cursor: 'not-allowed' }} type="text" required readOnly value={name}/>
                </div>
                <div className="date">
                    <label>Date</label>
                    <input style={{ cursor: 'not-allowed' }} type="text" required readOnly value={date}/>
                </div>
                <div className="weather">
                    <label>Weather</label>
                    <input style={close ? {cursor: 'not-allowed'} : {}} type="text" readOnly={close} value={weather} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWeather(event.target.value);
                    }}/>
                </div>
                <div className="text-area">
                    <label data-type="description">Description</label>
                    <textarea style={close ? {cursor: 'not-allowed'} : {}} readOnly={close} value={description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(event.target.value);
                    }}/>
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

export default InspectionFormData;