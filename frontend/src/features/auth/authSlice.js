import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "./authAPI";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerAPI(data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await loginAPI(data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        console.log("payload >>>>>",action.payload);
        
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;