import { combineReducers } from "redux";

import formDefinition from "./slices/formDefinitionSlice";
import formData from "./slices/formDataSlice";

/* Combining all reducers here */
const reducers = combineReducers({ formDefinition, formData });

export default reducers;