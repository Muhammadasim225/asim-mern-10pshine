import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit';
export const createAccount = createAsyncThunk(
  "createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/user/create-account", {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData);
      }

      return responseData;
      

    } catch (err) {
      return rejectWithValue({ 
        message: "Network error: Please check your connection" 
      });
    }
  }
);

export const loginAccount = createAsyncThunk(
  "loginAccount", 
  async(data, {rejectWithValue}) => {
    try {
      const response = await fetch("http://localhost:5000/user/login-account", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        // Pure error response return karo
        return rejectWithValue(result);
      }
      
      return result;
    } catch(err) {
      return rejectWithValue({ 
        message: "Network error: Please check your connection" 
      });
    }
  }
);
  export const forgetPassword=createAsyncThunk("forgetPassword",async(data,{rejectWithValue})=>{
    try {
    const response =await fetch("http://localhost:5000/user/forget-password",{
      method:'POST',
      headers:{
        'Content-Type':"application/json",
      },

  
      body:JSON.stringify(data)
    })
  
    if (!response.ok) {
      const errorData = await response.text(); 

      let errorMsg;
      try {
        const parsedError = JSON.parse(errorData);
        errorMsg = parsedError.message || `Server error: ${response.status}`;
      } catch {
        errorMsg = errorData || `Server error: ${response.status}`;
      }
      return rejectWithValue(errorMsg); // ✅ this is a string
    }
      const result=await response.json()
      return result;
  
    }
    catch(err){
      return rejectWithValue(err.message || "Something went wrong")

  
    }
  
  })


  export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:5000/user/reset-password?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'Failed to reset password');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getLoggedInUser = createAsyncThunk(
    'auth/getLoggedInUser',
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch('http://localhost:5000/user/auth/me', {
          method: 'GET',
          credentials: 'include', // required for cookies / sessions
        });
  
        if (!res.ok) {
          return rejectWithValue({ 
            type: 'SESSION_CHECK_FAILED',
            message: 'Unauthorized' 
          });
        }
  
        const user = await res.json();
        return user; 
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );


  export const updateProfile = createAsyncThunk(  "auth/updateProfile", async (data, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:5000/user/update-profile`, {
          method: "PUT",
          credentials: 'include',
          body:data,
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          try {
            const parsed = JSON.parse(errorData);
            return rejectWithValue(parsed.message || "Failed to update profile");
          } catch {
            return rejectWithValue(errorData || "Failed to update profile");
          }
        }
  
        const result = await response.json();
        console.log("BS YRR AB THUKK GYA:- ",result)
        return result.user;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );


  export const logoutUser=createAsyncThunk("auth/logoutUser",async(_,{rejectWithValue})=>{
    try{
      const response=await fetch("http://localhost:5000/user/logout",{
        method:'POST',
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        try {
          const parsed = JSON.parse(errorData);
          return rejectWithValue(parsed.message || "Failed to Logout User");
        } catch {
          return rejectWithValue(errorData || "Failed to Logout User");
        }
      }

      const result = await response.json();
      console.log("BS YRR AB THUKK GYA:- ",result)
      return result.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
  

  
  
const initialState = {
    user: null,            
    loading: false,       
    error: null,    
    isAuthenticated:false ,
    fieldErrors: {} 
     
}

export const authSlice = createSlice({
  name: 'createAccount',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
   
  },
  extraReducers: (builders) => {
    builders
    .addCase(createAccount.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = {}; 
    })
    .addCase(createAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.fieldErrors = {};
    })
    .addCase(createAccount.rejected, (state, action) => {
      state.loading = false;
      
      if (action.payload && action.payload.errors) {
        const fieldErrors = {};
        action.payload.errors.forEach(error => {
          fieldErrors[error.path] = error.msg;
        });
        state.fieldErrors = fieldErrors;
        state.error = "Please fix the validation errors above";
      } else {
        state.error = action.payload?.message || "Something went wrong";
      }
    });

        builders.
        addCase(loginAccount.pending,(state)=>{
            state.loading=true
        
          }).
          addCase(loginAccount.fulfilled,(state,action)=>{
            
                state.loading = false;
                state.user = action.payload.user; 
                state.isAuthenticated = true;
                state.error = null;  
              
          }).
          addCase(loginAccount.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            
            if (action.payload && action.payload.errors) {
              // Backend validation errors handle karo
              const fieldErrors = {};
              action.payload.errors.forEach(error => {
                fieldErrors[error.path] = error.msg;
              });
              state.fieldErrors = fieldErrors;
              state.error = "Please fix the validation errors above";
            } else if (action.payload && action.payload.message) {
              // Backend se aaye hue specific errors
              state.error = action.payload.message;
            } else {
              // Generic errors
              state.error = typeof action.payload === 'string' ? action.payload : "Login failed";
            }
          })

          builders.
          addCase(updateProfile.pending,(state)=>{
            state.loading=true
        
          }).
          addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.error = null;
            state.loading = false;
          }).
          addCase(updateProfile.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message;
          })
          builders.
          addCase(getLoggedInUser.pending, (state) => {
            state.loading = true;
          }).addCase(getLoggedInUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;

          }).addCase(getLoggedInUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            if (action.payload?.type !== 'SESSION_CHECK_FAILED') {
              state.error = action.payload?.message;
            }
          })


            builders.
        addCase(logoutUser.pending,(state)=>{
            state.loading=true
        
          }).
          addCase(logoutUser.fulfilled,(state,action)=>{
            
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = false;
                state.error=null;
              
          }).
          addCase(logoutUser.rejected,(state,action)=>{
              state.loading=false,
              state.error=action.payload?.message;
            })

            builders.
            addCase(forgetPassword.pending,(state)=>{
                state.loading=true
            
              }).
              addCase(forgetPassword.fulfilled,(state,action)=>{
                
                    state.loading = false;
                    // state.isAuthenticated = true;
                    state.error = null;  
                  
              }).
              addCase(forgetPassword.rejected,(state,action)=>{
                  state.loading=false,
                  state.error=action.payload;
                })

                builders
  .addCase(resetPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(resetPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
  })
  .addCase(resetPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Something went wrong";
  });
    
  }

})
export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer