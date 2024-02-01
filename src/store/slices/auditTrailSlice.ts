import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { formApiClient } from "../..";

interface AuditTrail {
    id: string;
    changeBy: string;
    changeDateTime: string;
    action: string;
}

interface InitialState {
    auditTrails: AuditTrail[];
    loading: 'idle' | 'pending' | 'fullfilled' | 'rejected';
    error: string;
}

const initialState: InitialState = {
    auditTrails: [],
    loading: 'idle',
    error: ''
}

export const fetchAuditTrails = createAsyncThunk('auditTrails', async (id: string, thunkAPI) => {
    const result = await formApiClient.getFromAuditTrail(id);
    if (result) {
        return result;
    }
    thunkAPI.rejectWithValue(null);
})

const auditTrailSlice = createSlice({
    name: "audit-trail",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuditTrails.rejected, (state) => {
            state.loading = 'rejected';
            state.error = 'Requested failed.';
        })
        .addCase(fetchAuditTrails.pending, (state) => {
            state.loading = 'pending';
        })
        .addCase(fetchAuditTrails.fulfilled, (state, action) => {
            state.loading = 'fullfilled'
            state.auditTrails = [];
            const value = action.payload;
            if (value) {
                value.auditTrailEntries.forEach((audit: any) => {
                    const auditTrail: AuditTrail = {
                        id: audit.id,
                        changeBy: audit.changeBy,
                        changeDateTime: audit.changeDateTime,
                        action: audit.action
                    };
                    state.auditTrails.push(auditTrail);
                })
            }
        })
    }
})

export default auditTrailSlice.reducer;