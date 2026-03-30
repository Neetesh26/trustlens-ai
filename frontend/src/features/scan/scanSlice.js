import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scanWebsiteAPI } from "./scanAPI";

export const scanWebsite = createAsyncThunk(
  "scan/run",
  async (data, thunkAPI) => {
    try {
      const res = await scanWebsiteAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const scanSlice = createSlice({
  name: "scan",
  initialState: {
    result: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(scanWebsite.pending, (state) => {
        state.loading = true;
      })
      .addCase(scanWebsite.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(scanWebsite.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default scanSlice.reducer;