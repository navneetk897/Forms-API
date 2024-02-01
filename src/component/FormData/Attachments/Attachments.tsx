import React, { useEffect, useState } from "react";


import "./Attachments.scss";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { fetchAttachments } from "../../../store/slices/attachmentSlice";
import { useParams } from "react-router-dom";
import Spinner from "../../Spinner";
import { formApiClient } from "../../..";

interface AttachmentsProps {
    close: React.Dispatch<React.SetStateAction<boolean>>;
}

const Attachments: React.FC<AttachmentsProps> = ({ close }) => {
    const params = useParams();
    const loading = useAppSelector(state => state.Attachment.loading);
    const attachments = useAppSelector(state => state.Attachment.attachments);

    const dispatch = useDispatch();

    const [file, setFile] = useState<File>();

    useEffect(() => {
        dispatch(fetchAttachments(params.id!));
    }, [dispatch, params.id]);

    const onUpload = async () => {
        if (!file) return;
        await formApiClient.addAttachmentToForm(params.id!, { 
            fileName: file.name
        });
        const { attachments }  = await formApiClient.getFormDataAttachment(params.id!);
        const attachmentId = attachments[attachments.length - 1].id;
        const res = await formApiClient.uploadAttachmentToForm(params.id!, attachmentId, file);
        if (res) {
            console.log('file uploaded successfully.');
            dispatch(fetchAttachments(params.id!));
        }
    }
    
    const onDelete = async (attachmentId: string) => {
        const res = await formApiClient.deleteAttachment(params.id!, attachmentId);
        if (res) {
            console.log('attachment deleted.');
            dispatch(fetchAttachments(params.id!));
        }
    }

    const onDonwload = async (attachmentId: string, fileName: string) => {
        const blob = await formApiClient.getAttachment(params.id!, attachmentId);
        if (blob) {
            console.log(blob);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }


    return (
        <div className="attachment-conatiner">
            <div className="header">
                <div className="attachment-header"><p>Attachments</p><span onClick={() => close(false)}>X</span></div>
                <hr />
            </div>
            <div className="attachments">
                {loading === 'fullfilled' ? attachments.map((attachment) => {
                    return (
                        <div key={attachment.id} className="attachment-box">
                            <img src={attachment.type !== 'pdf' ? '' : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPnBkZjwvdGl0bGU+PHBhdGggZD0iTTExLDBIMlYxNkgxNFYzWiIgZmlsbD0iI2RkM2UzOSIvPjxwYXRoIGQ9Ik05LjMxOTQsOS40NDY1YTM0LjA4MzMsMzQuMDgzMywwLDAsMS0yLjc1LTIuOTM1OFY2LjMyMzNhMy4wNDg3MSwzLjA0ODcxLDAsMCwwLS4yNS0xLjg3MzljLS4zLS4zMTIzLS42NS0uMjUtLjkuMTI0OS0uMDUuMDYyNS0uMDUuMTg3NC0uMS4zMTIzYTEuNjgxNSwxLjY4MTUsMCwwLDAsLjQsMS4zNzQybC40LjVjLS4yLjkzNy0uNiwyLjkzNTgtLjgsMy44NzI4LS40NS4zMTIzLTEuODUsMS4xODY4LTEuMTUsMi4xMjM4Ljg1LDEuMTI0MywxLjctMS42ODY1LDEuNy0xLjY4NjVhNi43MSw2LjcxLDAsMCwxLDMuNC0uOTM3YzIuODUsMy42MjI5LDQuMS0uNjI0Ni42LS42MjQ2Wm0tNC44LDMuMDYwN2MtLjQtLjE4NzQuMDUtMS4wNjE5LjgtMS4yNDkzLS4yNS44NzQ1LS41NSwxLjM3NDItLjgsMS4yNDkzbTEuNS02LjY4MzZhMS40MDgzLDEuNDA4MywwLDAsMS0uMzUtLjg3NDVjMC0uMTI0OS4wNS0uMjUuMi0uMjVhLjM1NjA3LjM1NjA3LDAsMCwxLC4yLjEyNDksNC45NjAwNyw0Ljk2MDA3LDAsMCwxLC4xNSwxLjI0OTNsLS4yLS4yNW0tLjIsNC41NmMuMi0uOTk5NC41LTIuMzExMi42LTMuMjQ4MS41NS42ODcxLDEuMywxLjQ5OTEsMi4xNSwyLjM3MzZhOC45MzE2OSw4LjkzMTY5LDAsMCwwLTIuNzUuODc0NW00LjA1LS4yNWE0Ljg1OTQ4LDQuODU5NDgsMCwwLDEsLjk1LjA2MjVjMSwuMTI0OS42NSwxLjE4NjguMDUuODEyQTMuNzA5NDUsMy43MDk0NSwwLDAsMSw5Ljg2OTQsMTAuMTMzM1oiIGZpbGw9IiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjExIDAgMTQgMyAxMSAzIDExIDAiIGZpbGw9IiM5OTJkMmIiLz48L3N2Zz4="} alt=" " />
                            <div className="attachment-data" onClick={() => onDonwload(attachment.id, attachment.fileName)}>
                                <p>{attachment.fileName}</p>
                                <p>type: {attachment.type}</p>
                            </div>
                            <div className="delete-icon" onClick={() => onDelete(attachment.id)}>
                                <img className="icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iIzJBMkYzNCIgZD0iTTE0IDF2MUgyVjFoM2wxLTFoNGwxIDF6TTMgM2gxMHYxMmExIDEgMCAwMS0xIDFINGExIDEgMCAwMS0xLTF6bTYgMTFoMVY1SDl6bS0zIDBoMVY1SDZ6Ii8+PC9zdmc+" alt=" " />
                            </div>
                        </div>
                    )
                }) : <Spinner />}
            </div>
            <div className="upload-attachment">
                <label className="select-attachment">
                    Select File
                    <input style={{ display: 'none' }} type="file" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files && event.target.files.length > 0) {
                            setFile(event.target.files[0]);
                        }
                    }}/>
                </label>
                <button className="upload-btn" onClick={onUpload}>Upload</button>
            </div>
        </div>
    )
}

export default Attachments;