import React, { ChangeEvent, useEffect, useState } from "react";

import "./Table.scss";
import { useAppSelector } from "../../../store/hooks";
import Spinner from "../../Spinner";
import { fetchFormDataInstance } from "../../../store/slices/formDataSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

interface TableProps {
    addDeleteIds: (ids: string[]) => void;
}

const Table: React.FC<TableProps> = ({ addDeleteIds }) => {

    const [ids, setIds] = useState<string[]>([]);

    const dispatch = useDispatch();

    const loading = useAppSelector(state => state.formData.loading);
    const dailyLogForm = useAppSelector(state => state.formData.formDataInstanceDailyLogs);
    const inspectionForm = useAppSelector(state => state.formData.formDataInstanceInspections);
    const selectedFormDef = useAppSelector(state => state.formDefinition.selectedFormDefinition);
    const loadSpinner = loading === 'idle' || loading === 'pending';
    const data = dailyLogForm.length > 0 ? dailyLogForm : inspectionForm;

    useEffect(() => {
        addDeleteIds(ids);
    }, [ids, addDeleteIds]);

    useEffect(() => {
        if (selectedFormDef) {
            dispatch(fetchFormDataInstance(selectedFormDef.type));
        }
    }, [selectedFormDef, dispatch])

    return (
        <div className="table-container">
            {loadSpinner ? <Spinner /> : <table className="table">
                <thead>
                    <tr>
                        <th>Form Number</th>
                        <th>Display Name</th>
                        <th>State</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((form) => {
                        return <tr key={form.id}>
                            <td>
                                <input className="check-box" type="checkbox" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    if (event.target.checked) {
                                        const newIds = [...ids];
                                        newIds.push(form.id);
                                        setIds(newIds);
                                    } else {
                                        const newIds = ids.filter((id: string) => {
                                            if (id === form.id) return false;
                                            return true;
                                        })
                                        setIds(newIds);
                                    }
                                }}/>
                                <Link className="form-link" to={`/forms/${form.id}?type=${form.type}`}>{form.number}</Link>
                            </td>
                            <td>{form.displayName}</td>
                            <td>{form.state}</td>
                            <td>{form.assignee.displayName}</td>
                            <td>{form.status}</td>
                            <td>{form.createdBy}</td>
                            <td>{form.createdDateTime.toString().split('T')[0]}</td>
                        </tr>
                    })}
                </tbody>
            </table>}
            {!loadSpinner && data.length === 0 && <div className="no-data"><p>No Data</p></div>}
        </div>
    )
}

export default Table;