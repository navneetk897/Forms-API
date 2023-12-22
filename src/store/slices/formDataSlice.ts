import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formApiClient } from "../..";


interface FormDataInstaceInspection {
    id: string;
    state: string;
    type: string;
    displayName: string;
    description: string;
    createdBy: string;
    createdDateTime: Date;
    number: number;
    status: string;
    assignee: {
        id: string;
        displayName: string;
    }
    properties: {
        Name: string;
        Weather: string;
        Date: string;
        Sign: string;
        Signdate: Date;
        Signid: string;
    }
}

interface FormDataInstanceDailyLog {
    id: string;
    state: string;
    type: string;
    displayName: string;
    createdBy: string;
    createdDateTime: Date;
    number: number;
    status: string;
    assignee: {
        id: string;
        displayName: string;
    }
    properties: {
        Name: string;
        Date: Date;
        Workforce: number;
        Milestones: number;
        Concern: string;
        Signid: string;
        Signdate: Date;
        Sign: string;
    }
}

interface InitialState {
    formDataInstanceInspections: FormDataInstaceInspection[];
    formDataInstanceDailyLogs: FormDataInstanceDailyLog[];
    loading: 'idle' | 'pending' | 'fullfilled' | 'rejected';
    error: string;
}

const initialState: InitialState = {
    formDataInstanceDailyLogs: [],
    formDataInstanceInspections: [],
    loading: 'idle',
    error: ''
}


export const fetchFormDataInstance = createAsyncThunk('formData', async (type: string, thunkAPI) => {
    if (type) {
        const result = await formApiClient.getProjectFormData(type);
        return {
            result,
            type
        }
    }
    thunkAPI.rejectWithValue(null);
})



const formDataSlice = createSlice({
    name: 'formData',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchFormDataInstance.pending, (state) => {
            state.loading = 'pending';
        })
        .addCase(fetchFormDataInstance.rejected, (state, action) => {
            state.loading = 'rejected';
            state.error = action.error.message ?? 'Request rejected';
        })
        .addCase(fetchFormDataInstance.fulfilled, (state, action) => {
            state.loading = 'fullfilled';
            const value = action.payload;
            state.formDataInstanceDailyLogs = [];
            state.formDataInstanceInspections = [];
            if (value) {
                const formDatas = value.result.formDataInstances;
                if (value.type === 'Daily Log') {
                    formDatas.forEach((result: any) => {
                        const instance: FormDataInstanceDailyLog = {
                            id: result.id,
                            state: result.state,
                            type: result.type,
                            displayName: result.displayName,
                            createdBy: result.createdBy,
                            createdDateTime: result.createdDateTime,
                            number: result.number,
                            status: result.status,
                            assignee: {
                                id: result.assignee.id,
                                displayName: result.assignee.displayName
                            },
                            properties: {
                                Name: result.properties.Name,
                                Date: result.properties.Date,
                                Workforce: result.properties.Workforce,
                                Milestones: result.properties.Milestones,
                                Concern: result.properties.Concern,
                                Signid: result.properties.Signid,
                                Signdate: result.properties.Signdate,
                                Sign: result.properties.Sign
                            }
    
                        }
                        state.formDataInstanceDailyLogs.push(instance);
                    })
                } else {

                    formDatas.forEach((result: any) => {
                        const instance: FormDataInstaceInspection = {
                            id: result.id,
                            state: result.state,
                            type: result.type,
                            description: result.description,
                            displayName: result.displayName,
                            createdBy: result.createdBy,
                            createdDateTime: result.createdDateTime,
                            number: result.number,
                            status: result.status,
                            assignee: {
                                id: result.assignee.id,
                                displayName: result.assignee.displayName
                            },
                            properties: {
                                Name: result.properties.Name,
                                Date: result.properties.Date,
                                Signid: result.properties.Signid,
                                Signdate: result.properties.Signdate,
                                Sign: result.properties.Sign,
                                Weather: result.properties.Weather
                            }
                        }
                        state.formDataInstanceInspections.push(instance);
                    })
                }
            }
        })
    }
})


export default formDataSlice.reducer;