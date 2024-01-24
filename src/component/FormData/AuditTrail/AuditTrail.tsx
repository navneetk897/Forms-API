import React, { useEffect } from "react";


import "./AuditTrail.scss";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAuditTrails } from "../../../store/slices/auditTrailSlice";
import { useAppSelector } from "../../../store/hooks";
import Spinner from "../../Spinner";

interface AuditTrailProps {
    close: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuditTrail: React.FC<AuditTrailProps> =  ({ close }) => {
    const auditTrails = useAppSelector(state => state.AuditTrail.auditTrails);
    const loading = useAppSelector(state => state.AuditTrail.loading);
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(fetchAuditTrails(params.id!));
    }, [dispatch, params.id]);


    return (
        <div className="audit-trail-conatiner">
           <div className="header">
                <div className="audit-trail-header"><p>Audit Trail</p><span onClick={() => close(false)}>X</span></div>
                <hr />
            </div>
            <div className="audit-trails">
                {loading === 'fullfilled' ? auditTrails.map((auditTrail: any) => {

                    const date = auditTrail.changeDateTime.split('T')[0];

                    return (<div key={auditTrail.id} className="audit-trail-box">
                        <div className="audit-trail">
                            <p className="action-type">Action Type - {auditTrail.action}</p>
                            <div className="details">
                                <p>{auditTrail.changeBy}</p>
                                <div>- {date}</div>
                             </div>
                        </div>
                </div>)
                }) : <Spinner />}
            </div>
        </div>
    )
}

export default AuditTrail;