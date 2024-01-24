import { combineReducers } from "redux";

import formDefinition from "./slices/formDefinitionSlice";
import formData from "./slices/formDataSlice";
import comment from "./slices/commentSlice";
import Attachment from "./slices/attachmentSlice";
import AuditTrail from "./slices/auditTrailSlice";
import User from "./slices/userSlice"

/* Combining all reducers here */
const reducers = combineReducers({ formDefinition, formData, comment, Attachment, AuditTrail, User });

export default reducers;