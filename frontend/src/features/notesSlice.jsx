import { createSlice ,createAsyncThunk} from '@reduxjs/toolkit'



export const createNote=createAsyncThunk("createNote",async(data,{rejectWithValue})=>{
  try {
  const response =await fetch("http://localhost:5000/user/create-note",{
    method:'POST',
    credentials:'include',
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
    return rejectWithValue(errorMsg);
  }
    const result=await response.json()
    return result;

  }
  catch(err){
    return rejectWithValue(err)


  }

})

export const editNote = createAsyncThunk(
  "editNote",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/user/edit-note/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMsg;
        try {
          const parsedError = JSON.parse(errorData);
          errorMsg = parsedError.message || `Server error: ${response.status}`;
        } catch {
          errorMsg = errorData || `Server error: ${response.status}`;
        }
        return rejectWithValue(errorMsg);
      }

      const result = await response.json();
      return result;

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteNote = createAsyncThunk("deleteNote", async (noteId, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:5000/user/remove-note/${noteId}`, {
      method: 'DELETE',
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg;
      try {
        const parsed = JSON.parse(errorText);
        errorMsg = parsed.message || `Server Error: ${response.status}`;
      } catch {
        errorMsg = errorText || `Server Error: ${response.status}`;
      }
      return rejectWithValue(errorMsg);
    }

    const result = await response.json(); 
    return { id: noteId }; 
  } catch (err) {
    return rejectWithValue(err.message || "Failed to delete note");
  }
});


export const displayNotes=createAsyncThunk("displayNotes",async(_,{rejectWithValue})=>{
  
  try {
  const res=await fetch("http://localhost:5000/user/fetch-all-notes", {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    const errorText = await res.text();
    let errorMsg;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed.message || `Server Error: ${res.status}`;
    } catch {
      errorMsg = errorText || `Server Error: ${res.status}`;
    }
    return rejectWithValue(errorMsg);
  }

  const result = await res.json();
  return result // ⬅️ depends on your backend shape
} catch (err) {
  return rejectWithValue(err.message || "Failed to fetch notes");
}
}
);

export const fetchSingleNote=createAsyncThunk("displaySingleNote",async(id,{rejectWithValue})=>{
  
  try {
  const res=await fetch(`http://localhost:5000/user/get-single-note/${id}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    const errorText = await res.text();
    let errorMsg;
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed.message || `Server Error: ${res.status}`;
    } catch {
      errorMsg = errorText || `Server Error: ${res.status}`;
    }
    return rejectWithValue(errorMsg);
  }

  const result = await res.json();
  return result // ⬅️ depends on your backend shape
} catch (err) {
  return rejectWithValue(err.message || `Failed to fetch note-${id}`);
}
}
);

export const createNoteSlice = createSlice({

  name: 'createNote',
initialState:{
  notes: [],
  loading: false,
  selectedNote: null,  
  error: null,
  isAuthenticated:false,
},
extraReducers:(builder)=>{
  builder.addCase(createNote.pending,(state)=>{
    state.loading=true

  }).
  addCase(createNote.fulfilled,(state,action)=>{
    state.loading=false,
    state.notes.push(action.payload)

  }).
  addCase(createNote.rejected,(state,action)=>{
    state.loading=false,
    console.log("The dtate is:- ",state)
    state.error=action
    console.log("State Error:- ",state.error)
  })

  builder.
  addCase(displayNotes.pending,(state)=>{
    state.loading=true

  }).
  addCase(displayNotes.fulfilled,(state,action)=>{
    state.loading=false,
    state.notes=action.payload.data
    console.log("Haan yeh he state.notes:- ",state.notes)

  }).
  addCase(displayNotes.rejected,(state,action)=>{
    state.loading=false,
    state.error=action.payload;
    state.isAuthenticated=false;
    console.log("Haan yeh he state.error he:- ",state.isAuthenticated)
   
  })

  builder
  .addCase(deleteNote.pending, (state) => {
    state.loading = true;
  })
  .addCase(deleteNote.fulfilled, (state, action) => {
    state.loading = false;
    state.notes = state.notes.filter(note => note._id !== action.payload.id);
  })
  .addCase(deleteNote.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  builder
  .addCase(editNote.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(editNote.fulfilled, (state, action) => {
    state.loading = false;
    const updatedNote = action.payload.data;
    console.log("Haan yeh he updated notes:- ",updatedNote)
    const index = state.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      state.notes[index] = updatedNote;
    }
  })

  .addCase(editNote.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    console.log("Haan yeh he edit note ka error :-" ,state.error)
  })

  builder.
  addCase(fetchSingleNote.pending,(state)=>{
    state.loading=true
    state.selectedNote = null;

  }).
  addCase(fetchSingleNote.fulfilled,(state,action)=>{
    state.loading=false,
    state.selectedNote = action.payload.data; // ← store the single note here
    console.log("✅ Single note fetched:", state.selectedNote);

  }).
  addCase(fetchSingleNote.rejected,(state,action)=>{
    state.loading=false,
    state.error=action.payload;
    state.isAuthenticated=false;
    console.log("Haan yeh he single state.error he:- ",state.isAuthenticated)
   
  })



  },
})


export default createNoteSlice.reducer