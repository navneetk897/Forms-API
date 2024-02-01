import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formApiClient } from "../..";


interface Comment {
    id: string,
    text: string,
    authorDisplayName: string
}

interface InitialState {
    comments: Comment[],
    loading: 'idle' | 'pending' | 'fullfilled' | 'rejected';
    error: string;
}

const initialState: InitialState = {
    comments: [],
    loading: 'idle',
    error: ''
}

export const fetchComments = createAsyncThunk('comment', async (id: string, thunkAPI) => {
    const result = await formApiClient.getFormComments(id);
    if (result) {
        return result;
    }
    thunkAPI.rejectWithValue(null);
})


const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchComments.pending, (state) => {
            state.loading = 'pending';
        })
        .addCase(fetchComments.rejected, (state) => {
            state.loading = 'rejected';
            state.error = 'Request rejected';
        })
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.loading = 'fullfilled'
            state.comments = [];
            const value = action.payload;
            if (value) {
                value.comments.forEach((com: any) => {
                    const comment: Comment = {
                        id: com.id,
                        text: com.text,
                        authorDisplayName: com.authorDisplayName
                    };
                    state.comments.push(comment);
                })
            }
            
        })
    }
})

export default commentSlice.reducer;