import { combineReducers } from "redux";

import formDefinition from "./slices/formDefinitionSlice";
import selectedForm from "./slices/selectedFormSlice";
import formData from "./slices/formDataSlice";

/* Combining all reducers here */
const reducers = combineReducers({ formDefinition, selectedForm, formData });

export default reducers;