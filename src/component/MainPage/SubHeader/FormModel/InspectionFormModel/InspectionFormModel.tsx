import React, { useState } from "react";

import "./InspectionFormModel.scss";
import { useAppSelector } from "../../../../../store/hooks";
import { formApiClient } from "../../../../..";
import { useDispatch } from "react-redux";
import { fetchFormDataInstance } from "../../../../../store/slices/formDataSlice";
import ReactDOM from "react-dom";
import Spinner from "../../../../Spinner";

interface InspectionFormModelProps {
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const InspectionFormModel: React.FC<InspectionFormModelProps> = ({ setShowModel }) => {
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();


    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [weather, setWeather] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [sign, setSign] = useState<boolean> (false);
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async () => {
        if (name.length === 0) return;
        if (date.length === 0) return;
        if (description.length === 0) return;


        const data = {
            formId: selectedFormDef?.id,
            properties: {
                Name: name,
                Weather: weather,
                Date: date,
                "_Description": description
            }
        };
        setLoading(true);
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
        setLoading(false);
        setShowModel(false);
        dispatch(fetchFormDataInstance(selectedFormDef!.type));

    }

    
    return (
        <div className="inspectionForm-model">
            <div className="title">Inspection Form</div>
            <div className="grid-container">
                <div className="name">
                    <label>Inspector's Name</label>
                    <input type="text" required value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}/>
                </div>
                <div className="date">
                    <label>Date</label>
                    <input type="text" required value={date} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setDate(event.target.value);
                    }}/>
                </div>
                <div className="weather">
                    <label>Weather</label>
                    <input type="text" value={weather} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWeather(event.target.value);
                    }}/>
                </div>
                <div className="text-area">
                    <label data-type="description">Description</label>
                    <textarea value={description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setDescription(event.target.value);
                    }}/>
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

export default InspectionFormModel;