import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formApiClient } from "../..";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface InitialState {
    user: User[];
    loading: 'idle' | 'pending' | 'fullfilled' | 'rejected';
    error: string;
}

const initialState: InitialState = {
    user: [],
    loading: 'idle',
    error: ''
}

export const fetchProjectUser = createAsyncThunk('user', async (payload: any, thunkAPI) => {
    const result = await formApiClient.getProjectsUsers();
    if (result) {
        return result;
    }
    thunkAPI.rejectWithValue(null);
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjectUser.rejected, (state) => {
            state.loading = 'rejected';
            state.error = 'Requested failed.';
        })
        .addCase(fetchProjectUser.pending, (state) => {
            state.loading = 'pending';
        })
        .addCase(fetchProjectUser.fulfilled, (state, action) => {
            state.loading = 'fullfilled';
            state.user = [];
            const value = action.payload;
            if (value) {
                const members = value.members;
                members.forEach((member: any) => {
                    const user: User = {
                        id: member.id,
                        email: member.email,
                        firstName: member.givenName,
                        lastName: member.surname
                    };
                    state.user.push(user);
                })
            }
        })
    }
});

export default userSlice.reducer;