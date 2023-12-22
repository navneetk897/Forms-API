import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { formApiClient } from "../..";


export interface FormDefnition {
    displayName: string;
    id: string;
    type: string;
}

interface FormDefinitionState {
    formDefinitions: FormDefnition[];
    selectedFormDefinition: FormDefnition | null;
    loading: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string
}

const initialState: FormDefinitionState = {
    formDefinitions: [],
    selectedFormDefinition: null,
    loading: 'idle',
    error: ''
}

export const fetchFormDefinition = createAsyncThunk('form/definition', async (data, thunkAPI) => {
    try {
        const result = await formApiClient.getFormsDefinitions();
        return result;
    } catch(error) {
        console.log(error);
    }
})


const formDefinitionsSlice = createSlice({
    name: 'formDefinition',
    initialState,
    reducers: {
        selectFormDef(state, action) {
            state.selectedFormDefinition = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFormDefinition.pending, (state) => {
            state.loading = 'loading';
        })
        .addCase(fetchFormDefinition.rejected, (state, action) => {
            state.error = action.error.message ?? 'Request failed';
            state.loading = 'failed';
        })
        .addCase(fetchFormDefinition.fulfilled, (state, action) => {
            action.payload.formDefinitions.forEach((formDefnition: any) => {
                state.formDefinitions.push(formDefnition);
            })
            state.loading = 'succeeded';
        })
    }
});


export const { selectFormDef } = formDefinitionsSlice.actions;


export default formDefinitionsSlice.reducer;