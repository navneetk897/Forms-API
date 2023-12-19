import React, { useState } from "react"


import "./FormSelect.scss";



interface ModelProps {
    selectForm: () => void;
    formName: string;
}




const Model: React.FC<ModelProps> = ({ selectForm, formName }: ModelProps) => {
    return (
        <div id="form-def" className="form-list">
            <div className="item"><p>Daily Log</p></div>
            <div className="item"><p>Inspection</p></div>
        </div>
    )
}



const FormSelect: React.FC = () => {
    const [showModel, setShowModel] = React.useState<boolean>(false);
    const [formInput, setFormInput] = useState<string> ('Daily Log');
    



    const selectForm = () => {

    }

    const onInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFormInput(event.target.value);
    }

    const formSelectClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setShowModel(true);
        event.stopPropagation();
    }

    document.addEventListener('click', (event: MouseEvent) => {
        const model = document.getElementById('form-def');
        if (model) {
            const isModel: boolean = model.contains(event.target as HTMLElement);
            if (!isModel && showModel) {
                setShowModel(false);
            }
        }
    })
    return (
        <div className="project-select" onClick={formSelectClick}>
            <input className="project-input" type="text" value={formInput} onChange={onInputChange}/>
            <div className="arrow-container">
                <div style={showModel? {
                    rotate: '90deg',
                    transitionDuration: '0.2s'
                }: {}} className="arrow"></div>
            </div>
           {showModel && <Model selectForm={selectForm} formName={formInput}/>}
        </div>
    )
}

export default FormSelect;