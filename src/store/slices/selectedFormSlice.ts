import { createSlice } from "@reduxjs/toolkit";
import { FormDefnition } from "./formDefinitionSlice";



interface SelectedForm {
    slectedFormDef: FormDefnition | null;
}

const initialState: SelectedForm = {
    slectedFormDef: null
}

const selectedFormSlice = createSlice({
    name: 'selectedForm',
    initialState,
    reducers: {
        selectFormDefiniton(state, action) {
            state.slectedFormDef = action.payload;
        }
    }
})


export const { selectFormDefiniton } = selectedFormSlice.actions;

export default selectedFormSlice.reducer;