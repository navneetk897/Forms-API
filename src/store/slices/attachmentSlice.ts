import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formApiClient } from "../..";

interface Attachment {
    id: string,
    fileName: string,
    type: string
}

interface InitialState {
    attachments: Attachment[];
    loading: 'idle' | 'pending' | 'fullfilled' | 'rejected';
    error: string;
}

const initialState: InitialState = {
    attachments: [],
    loading: 'idle',
    error: '8'
}

export const fetchAttachments = createAsyncThunk('attachment', async (id: string, thunkAPI) => {
    const result = await formApiClient.getFormDataAttachment(id);
    if (result) {
        return result;
    }
    thunkAPI.rejectWithValue(null);
})

const attachmentSlice = createSlice({
    name: "attachments",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAttachments.rejected, (state) => {
            state.loading = 'rejected';
            state.error = 'Request failed.';
        })
        .addCase(fetchAttachments.pending, (state) => {
            state.loading = 'pending';
        })
        .addCase(fetchAttachments.fulfilled, (state, action) => {
            state.loading = 'fullfilled';
            state.attachments = [];
            const value = action.payload;
            if (value) {
                value.attachments.forEach((attach: any) => {
                    const attachment: Attachment = {
                        id: attach.id,
                        fileName: attach.fileName,
                        type: attach.type
                    };
                    state.attachments.push(attachment);
                });
            }
        })
    }
});


export default attachmentSlice.reducer;