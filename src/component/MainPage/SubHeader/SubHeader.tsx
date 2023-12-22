import React, { useEffect, useState } from "react";

import "./SubHeader.scss";
import { formApiClient } from "../../..";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { fetchFormDataInstance } from "../../../store/slices/formDataSlice";

interface SubHeaderProps {
    deleteIds: string[];
    addDeletedIds: (ids: string[]) => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({ deleteIds, addDeletedIds }) => {
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const dispatch = useDispatch();
    const [dataHover, setDataHover] = useState(false);


    useEffect(() => {
        if (deleteIds.length > 0) {
            setDataHover(true);
        } else {
            setDataHover(false);
        }
    }, [deleteIds]);


    
    return (
        <>
            <div className="sub-header">
                <button className="create-btn">Create New</button>
                <button data-hover={dataHover ? 'active' : 'inactive'} className="delete-btn" onClick={async () => {
                    await Promise.all(
                        deleteIds.map(id => formApiClient.deleteFormData(id))
                    );
                    addDeletedIds([]);
                    dispatch(fetchFormDataInstance(selectedFormDef!.type));
                }}>Delete</button>
            </div>
            <hr />
        </>
    )
}

export default SubHeader