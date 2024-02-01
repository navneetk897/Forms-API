import React, { useEffect, useState } from "react";

import "./AssigneeModel.scss";
import { useDispatch } from "react-redux";
import { User, fetchProjectUser } from "../../../store/slices/userSlice";
import { useAppSelector } from "../../../store/hooks";
import Spinner from "../../Spinner";
import { formApiClient } from "../../..";
import { useParams } from "react-router-dom";

interface AssigneeModelProps {
    setShowAssignModel: React.Dispatch<React.SetStateAction<boolean>>
}

const AssigneeModel: React.FC<AssigneeModelProps> = ({ setShowAssignModel }) => {
    const params = useParams();
    const users = useAppSelector(state => state.User.user);
    const loading = useAppSelector(state => state.User.loading);
    const dispatch = useDispatch();
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [load, setLoad] = useState<boolean>(false);

    useEffect(() => {
        if (loading !== 'fullfilled') {
            dispatch(fetchProjectUser(undefined));
        }
    }, [dispatch, loading]);


    const isSelected = (id: string) => {
        const user = selectedUsers.filter((user) => {
            if (user.id === id) return true;
            return false;
        });
        return user.length > 0;
    }
    const onAssign = async () => {
        if (selectedUsers.length === 0) return;
        const assignees: { displayName: string; id: string; }[] = [];
        selectedUsers.forEach((user) => {
            assignees.push({
                displayName: `${user.firstName} ${user.lastName}`,
                id: user.id
            });
        });
        const updateData = {
            assignees
        }

        setLoad(true);
        await formApiClient.updateFormData(params.id!, updateData);
        setLoad(false);
        setShowAssignModel(false);

    }
    return (
        <div className="assignee-model-container">
            <div className="member-list">
                {loading !== 'fullfilled' && <Spinner />}
                {users && users.map((user) => {
                    const selected = isSelected(user.id);
                    return (
                        <div key={user.id} style={selected ? { background: 'grey' } : {}} className="user" onClick={() => {
                            if (isSelected(user.id)) {
                                setSelectedUsers(selectedUsers.filter((us) => user.id !== us.id));
                            } else {
                                setSelectedUsers([...selectedUsers, user]);
                            }
                        }}>{`${user.firstName} ${user.lastName} (${user.email})`}</div>
                    )
                })}

            </div>
            <div className="btn-container">
                <button className="btn" onClick={onAssign}>Assign</button>
                <button className="btn" onClick={() => setShowAssignModel(false)}>Close</button>
            </div>
            {load && <Spinner />}
        </div>
    )
}


export default AssigneeModel;