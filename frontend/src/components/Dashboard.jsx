// DashboardNotes.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import { useEffect } from "react";
import { Menu } from '@headlessui/react'
import User from "../../public/user.png"

import { createNote,
  deleteNote,
  displayNotes, 
  editNote,
  fetchSingleNote
} from "../features/notesSlice";
import svgRepo from '../../public/notes-svgrepo-com.svg'
import { createAccount, getLoggedInUser, logoutUser, updateProfile } from "../features/authSlice";
import Spinner from "../features/Spinner";

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedNoteToDelete, setSelectedNoteToDelete] = useState(null);
  const [modalOpen,setModalOpen]=useState(false);
  const dispatch=useDispatch();
  const [note,setNote]=useState({})
  const getAllNotes = useSelector((state) => state.createNote.notes);
  const [editorContent, setEditorContent] = useState('');
  const [currentNote, setCurrentNote] = useState(null); 
  const [modelOpen,setModelOpen]=useState(false); 
  const [editProfileOpen,setEditProfileOpen]=useState(false);
  const [openDeleteDialog,setOpenDeleteDialog]=useState(false);
  const [openLogoutDialog,setOpenLogoutDialog]=useState(false);
  const [openSingleNoteDialog,setOpenSingleNoteDialog]=useState(false);
  const singleNote = useSelector((state) => state.createNote.selectedNote || null);
  const singleNoteLoading = useSelector((state) => state.createNote.singleNoteLoading || state.createNote.loading);

  const user = useSelector((state) => state.createAccount.user);
  console.log("Yeh sahi he:- ",user)
  const [fullName, setFullName] = useState(user?.full_name || '');
const [emailAddress, setEmailAddress] = useState(user?.email_address || '');
// const [avatar,setAvatar] = useState(user?.avatar || '');
// const [avatar, setAvatar] = useState(null);
const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(''); // Only for edit modal preview
console.log("Haan yehi he single note");

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAvatarFile(file);
    // Temporary URL create karein preview ke liye
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }
};


const getAllNotesLoading = useSelector((state) => state.createNote.loading);

console.log("Yeh he user:- ",user)
useEffect(() => {
  if (user) {
    setFullName(user.full_name || '');
    setEmailAddress(user.email_address || '');
    setAvatarPreview(user.avatar || '');
  }
}, [user]);

useEffect(() => {
  dispatch(displayNotes());
}, [dispatch]);


useEffect(() => {
  if (!getAllNotesLoading) {
    console.log("Notes updated:", getAllNotes);
  }
}, [getAllNotes, getAllNotesLoading]);



const editor = useEditor({
  extensions: [
    StarterKit,
    Code,
    CodeBlock
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl  focus:outline-none ',
      
    },
  },
  autofocus: true,
  editable: true,
  injectCSS: false,
})



  const getNoteData=(e)=>{
    const newNote = { ...note, [e.target.name]: e.target.value };
    setNote(newNote);
  }

  const handleCreateNotes=()=>{
    setCurrentNote(null);  
    setNote({ title: '', content: '' });  
    if (editor) {
      editor.commands.clearContent();  
    }
    setModalOpen(true)

  }


  
  useEffect(() => {
    if (!editor) return;
  
    editor.on('update', () => {
      const html = editor.getHTML();
      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, 'text/html');
      const text = parsed.body.textContent;
  
      setEditorContent(text); // Update only local state
    });
  
    return () => editor.off('update');
  }, [editor]);

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
  
    const finalNote = {
      ...note,
      content: editorContent,
    };
  
    if (currentNote) {
      await dispatch(editNote({ id: currentNote.id, data: finalNote }));
    } else {
      await dispatch(createNote(finalNote));
    }
  
    setModalOpen(false);
    setCurrentNote(null);
    dispatch(displayNotes());
  };

  

  const handleDeleteNote=async(id)=>{
    setSelectedNoteToDelete(id);  // ✅ Save ID
    setOpenDeleteDialog(true)
 
  }

 
  const confirmDelete = async () => {
    if (!selectedNoteToDelete) return;
  
    await dispatch(deleteNote(selectedNoteToDelete));
    dispatch(displayNotes());
    setOpenDeleteDialog(false);
    setSelectedNoteToDelete(null);
  };
  

  const cancelDelete=()=>{
    setOpenDeleteDialog(false);
  }
  const handleEditNote = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
    editor.commands.setContent(note.content); 
    setNote(note);  
  };

  useEffect(() => {
    if (modalOpen && currentNote && editor) {
      editor.commands.setContent(currentNote.content);
    }
  }, [modalOpen, currentNote, editor]);


  useEffect(() => {
    setNote(prevNote => ({ ...prevNote, content: editorContent }));
  }, [editorContent]);

  const handleModalOpenClick=()=>{
    setModelOpen(!modelOpen)
  }

  const handleEditProfileClick=()=>{
    console.log("SUUUUUUUUUUUUUUUU SAAAAAAAAAAAAA",user)

      if (user) {
        setFullName(user.full_name || '');
        setEmailAddress(user.email_address || '');
        setAvatarPreview(user.avatar || '');
        setAvatarFile(null); // Reset file selection
        // ✅ user.avatar use karein
      }

      setEditProfileOpen(true);
      console.log("SUUUUUUUUUUUUUUUU SAAAAAAAAAAAAA",user)
    };


    const handleEditProfileSave = async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email_address", emailAddress);
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      
      const res = await dispatch(updateProfile(formData));
      setEditProfileOpen(false);
      setAvatarFile(null); // Reset file

    };

  const handleUserLogout=()=>{
    dispatch(logoutUser())
  }


  const handleEditProfileClose=()=>{
    setEditProfileOpen(false);

  }

  const handleOpenLogoutDialog=()=>{
    setOpenLogoutDialog(true)
  }

  const closeLogouDialog=()=>{
    setOpenLogoutDialog(false);
  }

  const dialogOpenDetailNoteHandler=(id)=>{
    console.log("🧠 dialogOpenDetailNoteHandler called with ID:", id);
    console.trace(); // Yeh dikha dega kahaan se call hua
    setOpenSingleNoteDialog(true)
    dispatch(fetchSingleNote(id));  

  }
  const handleCloseSingleNoteDialog=()=>{
    setOpenSingleNoteDialog(false);
  }



    
  

  return (
    <>

    {
      openSingleNoteDialog&&(    <Dialog open={openSingleNoteDialog} onClose={handleCloseSingleNoteDialog} as="div" className="relative z-50 focus:outline-none">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50">
          <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-4xl rounded-2xl bg-white shadow-xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            {singleNoteLoading ? (  // loading -> singleNoteLoading
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading note...</p>
              </div>
            ) : singleNote ? ( 
              <div className="max-h-[80vh] overflow-y-auto">
                {/* Header Section */}
                <div className="sticky top-0 z-10 bg-orange-50 p-6 md:p-8 border-b border-gray-200 bg-opacity-100">  {/* bg-orange-50 ko solid rakho, z-10 for overlap prevention */}
      <DialogTitle as="h3" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {singleNote.title} 
      </DialogTitle>
    </div>

          

<div className="p-6 md:p-8 text-gray-700 leading-7">
                  <div className="space-y-4 md:space-y-6">
                    {singleNote.content?.split('\n\n').map((paragraph, index) => (  // note -> singleNote
                      <p key={index} className="text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>


                {/* Action Footer */}
               {/* Action Footer - STICKY BOTTOM */}
<div className="sticky bottom-0 z-10 bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-opacity-100">  {/* sticky bottom-0 z-10 add kiya, bg solid ke liye opacity-100 */}
  <div className="text-sm text-gray-500 flex items-center">
    <i className="far fa-clock mr-1.5"></i> 
    Last updated {new Date(singleNote.updatedAt).toLocaleDateString()}  
  </div>
  <div className="flex space-x-4">
    <button
      className="inline-flex items-center rounded-lg cursor-pointer bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base transition"
      onClick={handleCloseSingleNoteDialog}
    >
      <i className="fas fa-times mr-1"></i>
      Close
    </button>
  </div>
</div>
              </div>
            ) : null}
          </DialogPanel>
          </div>
        </div>
      </Dialog>
  )
    }

{
    openLogoutDialog && (<Dialog open={openLogoutDialog} as="div" className="relative z-10"   onClose={() => {}} 
>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold text-gray-900">  Logout Confirmation
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to logout? You will need to sign in again to continue.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeLogouDialog}
                className="px-4 py-2 bg-gray-200 cursor-pointer transition  rounded-lg text-gray-800 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={handleUserLogout}
                className="px-4 py-2 rounded-lg transition bg-orange-600 cursor-pointer text-white hover:bg-orange-700"
              >
                Yes
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
  }

{
    openDeleteDialog && (<Dialog open={openDeleteDialog} as="div" className="relative z-10"  onClose={() => {}} >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Delete this note?
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 cursor-pointer transition  rounded-lg text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg transition bg-orange-600 cursor-pointer text-white hover:bg-orange-700"
              >
                Delete
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
  }

  <main className="min-h-screen bg-gray-50 text-slate-900 font-sans antialiased">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-3 sm:mb-6 md:mb-6 lg:mb-6 xl:mb-6 2xl:mb-6 px-0 xl:px-4 sm:px-4 md:px-4 lg:px-4">
  <div className="flex items-center gap-4 flex-shrink-0">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-orange-600">
      My Notes
    </h1>
  </div>

  {/* Desktop Navigation */}
  <div className="md:flex items-center gap-4">
    <div className="flex items-center gap-3 flex-shrink-0">
    <Menu as="div" className="relative inline-block text-left">
  {({ open }) => (
    <>
      {/* Profile Button */}
      <Menu.Button
        className="group relative flex items-center justify-center overflow-hidden rounded-full ring-2 ring-gray-200 hover:ring-orange-500 shadow-md hover:shadow-orange-400/50 hover:shadow-lg transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer focus:outline-none"
        title="User profile"
      >
        {!user ? (
          <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <img
            src={
              user.avatar
                ? user.avatar.startsWith("http")
                  ? user.avatar
                  : `http://localhost:5000${user.avatar}`
                : User
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Menu.Button>

      {/* Dropdown Menu */}
      <Menu.Items
        className={`absolute right-0 mt-3 w-64 sm:w-72 origin-top-right bg-white rounded-2xl ring-1 ring-black/5 focus:outline-none overflow-hidden transform transition-all duration-200 ease-out z-50
        ${open ? 'shadow-2xl' : 'shadow-none'}
        `}
      >
        {/* User Info Header */}
        <div className="px-5 py-4 bg-orange-100 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar
                  ? user.avatar.startsWith("http")
                    ? user.avatar
                    : `http://localhost:5000${user.avatar}`
                  : User
              }
              alt="Profile"
              className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email_address || 'email@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {/* My Profile */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleEditProfileClick}
                className={`${
                  active ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                } group flex items-center w-full px-5 py-3 text-sm font-medium transition-colors duration-150`}
              >
                <div
                  className={`${
                    active ? 'bg-orange-100' : 'bg-gray-100'
                  } p-2 rounded-lg mr-3 transition-colors duration-150`}
                >
                  <svg
                    className={`${
                      active ? 'text-orange-600' : 'text-gray-600'
                    } w-4 h-4`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span>My Profile</span>
                <svg
                  className={`${
                    active ? 'text-orange-600' : 'text-gray-400'
                  } w-4 h-4 ml-auto transform -rotate-90`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </Menu.Item>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100" />

          {/* Logout */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleOpenLogoutDialog}
                className={`${
                  active ? 'bg-red-50 text-red-700' : 'text-gray-700'
                } group flex items-center w-full px-5 py-3 text-sm font-medium transition-colors duration-150`}
              >
                <div
                  className={`${
                    active ? 'bg-red-100' : 'bg-gray-100'
                  } p-2 rounded-lg mr-3 transition-colors duration-150`}
                >
                  <svg
                    className={`${
                      active ? 'text-red-600' : 'text-gray-600'
                    } w-4 h-4`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span>Logout</span>
                <svg
                  className={`${
                    active ? 'text-red-600' : 'text-gray-400'
                  } w-4 h-4 ml-auto transform -rotate-90`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </>
  )}
</Menu>

    </div>
  </div>
</header>


    <Dialog open={editProfileOpen}  onClose={() => {}}  className="relative z-10">
  <div className="bg-black/30 fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center p-4 sm:p-6">
    <form onSubmit={handleEditProfileSave}>
      <DialogPanel className="w-full max-w-md transform rounded-lg border border-gray-200 bg-white p-6 shadow-xl transition-all sm:max-w-lg sm:p-8 md:p-10 lg:max-w-xl xl:max-w-2xl xl:p-12">
        <DialogTitle className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">My profile</DialogTitle>
        
        <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <div className="relative group flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
              <input
                type="file"
                id="avatarUpload"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileSelect} // ✅ Updated
              />

              {/* Avatar Image - FIXED */}
              <img
                src={
                  avatarPreview 
                    ? (avatarPreview.startsWith("blob:") 
                        ? avatarPreview 
                        : `http://localhost:5000${avatarPreview}`)
                    : User // Fallback image
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full cursor-pointer transition duration-300 ease-in-out"
                onClick={() => document.getElementById("avatarUpload").click()}
              />
  {/* Hover Overlay */}
  <div
    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 ease-in-out pointer-events-none"
  >
    {/* Plus Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </div>
</div>


        </div>
        
        <div className="flex w-full flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 sm:text-base">Name</label>
            <div className="mt-1">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} // ✅
                name="full_name"
                className="w-full rounded-md px-3 py-2 text-sm text-gray-900
    border border-gray-300 bg-white placeholder-gray-400
    focus:outline-none focus:border-transparent focus:ring-1 focus:ring-orange-500
    transition"
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 sm:text-base">Email</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="email"
                name="email_address"
                onChange={(e) => setEmailAddress(e.target.value)} // ✅
                value={emailAddress}
                className="flex-1 sm:text-base

                w-full rounded-md px-3 py-2 text-sm text-gray-900
    border border-gray-300 bg-white placeholder-gray-400
    focus:outline-none focus:border-transparent focus:ring-1 focus:ring-orange-500
    transition
                "
                placeholder="Enter your email"
              />
             
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-3 sm:mt-10">
        <button
          onClick={handleEditProfileClose}
          className=" px-4 py-2 text-sm   sm:px-6 sm:py-3 sm:text-base
          
          font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500  duration-200  text-center
        bg-gray-100 cursor-pointer transition  rounded-lg text-gray-800 hover:bg-gray-200
          "
        >
          Close
        </button>
        <button
          type="submit"
          className="rounded-lg cursor-pointer bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base transition"
        >
          Save
        </button>
      </div>
    </DialogPanel>
    </form>
  </div>
</Dialog>
  

<section className="xl:mt-20 md:mt-20 sm:mt-16 mt-14 px-0 sm:px-6 lg:px-8">
{getAllNotesLoading ? (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center text-lg text-slate-600"> 
        <Spinner />  
      </div>
    </div>
  ): (getAllNotes.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {getAllNotes.map((note, idx) => {
        
        // Simple color array (you can customize colors)
        const colorClasses = [
          'bg-blue-300 border-blue-200',
          'bg-green-300 border-green-200',
          'bg-yellow-300 border-yellow-200',
          'bg-pink-300 border-pink-200',
          'bg-purple-300 border-purple-200'
        ];
  
        // Loop colors using modulo
        const cardColor = colorClasses[idx % colorClasses.length];
  
        return (
          <article
            key={note.id || idx}
            onClick={() => dialogOpenDetailNoteHandler(note.id)}
            className={`relative cursor-pointer rounded-2xl shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${cardColor}`}
          >
            <div className="rounded-2xl p-4 sm:p-5 lg:p-6 h-full min-h-[220px] sm:min-h-[250px] lg:min-h-[280px] flex flex-col">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black flex-1 pr-2 sm:pr-4 truncate">
                  {note.title}
                </h3>
  
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="w-8 h-8 px-2 sm:px-3 py-1 sm:py-1.5 flex items-center justify-center rounded-full bg-white/70 text-black hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Delete note"
                >
                  <FontAwesomeIcon className="text-xs sm:text-sm" icon={faTrash} />
                </button>
              </div>
  
              <p className="text-xs sm:text-sm text-black leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4 flex-1 overflow-hidden">
                {note.content}
              </p>
  
              <div className="flex justify-between">
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 bg-white/70 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-black min-w-[70px] sm:min-w-[80px] justify-center">
                    <time dateTime={note.createdAt} className="ml-1 truncate">
                      {formatDate(note.createdAt)}
                    </time>
                  </div>
                </div>
  
                <div className="flex justify-end mt-auto">
                  <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm text-black">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/70 text-black hover:bg-white transition-all duration-200 focus:outline-none"
                      aria-label="Edit note"
                    >
                      <FontAwesomeIcon className="text-xs" icon={faPen} />
                      <span className="hidden xs:inline sm:inline">Edit</span>
                    </button>
  
                    <button
                      className="flex items-center gap-1 px-3 sm:px-3 py-2 sm:py-1.5 rounded-full bg-white/70 text-black hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                      aria-label="Open note"
                      onClick={(e) => {
                        e.stopPropagation();
                        dialogOpenDetailNoteHandler(note.id);
                      }}
                    >
                      <span className="xs:inline sm:inline">Open</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 sm:space-y-6 text-slate-600 w-full px-4">
      <img
        src={svgRepo}
        alt="Empty Notes"
        className="w-32 sm:w-40 h-32 sm:h-40 opacity-80"
      />
      <h2 className="text-xl sm:text-2xl font-bold text-orange-600">No Notes Yet</h2>
      <p className="max-w-md text-sm sm:text-base text-slate-500 leading-relaxed">
        You haven't created any notes yet. Click the <strong>New Note</strong> button on the bottom right side to start writing your first note.
      </p>
    </div>
  ))}
</section>


          {/* Floating New Note Button */}
          <div className="fixed bottom-8 right-8">
            <button onClick={handleCreateNotes}
              className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transform transition focus:outline-none"
              style={{ willChange: 'transform' }}
              aria-label="Create new note"
              title="Create new note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 "

                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline-block font-medium">New Note</span>
            </button>
          </div>
        </div>
      </main>
      
     {/* Rich Text Editor Modal */}
     {modalOpen && (
  <Dialog open={modalOpen} onClose={() => {}} as="div" className="relative z-50">
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
    <form onSubmit={handleNoteSubmit} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/50 flex flex-col max-h-[95vh] overflow-hidden">
          
          {/* ENHANCED HEADER SECTION */}
          <div className="shrink-0 bg-gradient-to-r from-white to-gray-50/80 border-b border-gray-200/80 backdrop-blur-sm">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create New Note
                </DialogTitle>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  aria-label="Close dialog"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">Create and format your note with rich text editing</p>
            </div>
            
            {/* Note Title Input - Enhanced */}
            <div className="px-6 pb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter note title..."
                  onChange={getNoteData}
                  value={note.title || ""}
                  name="title"
                  className="w-full px-4 py-3 border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition
                  rounded-lg
                  duration-200 text-base"
                  aria-label="Note Title"
                />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
            {/* Rich Text Editor Container */}
            <div className="flex-1 flex flex-col m-6 mt-4 bg-white rounded-2xl border border-gray-300 overflow-hidden">
              
              {/* STICKY TOOLBAR - ENHANCED */}
              {editor && (
                <div className="border-b border-gray-300 bg-white/95 px-4 py-3 flex flex-wrap items-center gap-1 sticky top-0 z-40">
                  
                  {/* Text Formatting Group */}
                  <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('bold') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Bold"
                      title="Bold (Ctrl+B)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.636A4.5 4.5 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8z"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('italic') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Italic"
                      title="Italic (Ctrl+I)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleUnderline().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('underline') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Underline"
                      title="Underline (Ctrl+U)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Headings Group - ALL ORANGE */}
                  <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Heading 1"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Heading 2"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().setParagraph().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('paragraph') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Paragraph"
                      title="Paragraph"
                    >
                      P
                    </button>
                  </div>

                  {/* Lists Group - ALL ORANGE */}
                  <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('bulletList') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Bullet List"
                      title="Bullet List"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('orderedList') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Numbered List"
                      title="Numbered List"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Code Group - ALL ORANGE */}
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleCode().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('code') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Inline Code"
                      title="Inline Code"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${editor.isActive('codeBlock') ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      aria-label="Code Block"
                      title="Code Block"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H6v-2h3v2zm0-4H6v-2h3v2zm0-4H6V7h3v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* EDITOR CONTENT AREA */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 min-h-[400px]"> 
                  <EditorContent 
                    editor={editor} 
                    className="min-h-full focus:outline-none focus:ring-0 
                      [&_.ProseMirror]:outline-none 
                      [&_.ProseMirror]:min-h-full 
                      [&_.ProseMirror]:leading-relaxed 
                      [&_.ProseMirror_p]:my-2
                      [&_.ProseMirror_h1]:text-2xl 
                      [&_.ProseMirror_h2]:text-xl 
                      [&_.ProseMirror_h3]:text-lg 
                      [&_.ProseMirror_ul]:my-2 
                      [&_.ProseMirror_ol]:my-2 
                      [&_.ProseMirror_li]:my-1 
                      [&_.ProseMirror_code]:bg-gray-100 
                      [&_.ProseMirror_code]:px-1 
                      [&_.ProseMirror_code]:rounded 
                      [&_.ProseMirror_code]:text-gray-800
                      [&_.ProseMirror_pre]:bg-gray-900 
                      [&_.ProseMirror_pre]:text-gray-100
                      [&_.ProseMirror_pre]:p-4 
                      [&_.ProseMirror_pre]:rounded-lg
                      [&_.ProseMirror_pre]:overflow-x-auto"
                    aria-label="Note content"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ENHANCED FOOTER SECTION */}
          <div className="shrink-0 bg-white border-t border-gray-200/80 px-4 py-3 sm:px-6 sm:py-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
    {/* Left Section - Responsive: Full width on mobile, hidden icon if too small */}
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="truncate">Use toolbar to format your content</span> {/* truncate to prevent overflow */}
    </div>
    
    {/* Right Section - Buttons: Stacked on mobile, horizontal on sm+ */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto">
      <button 
        type="button"
        onClick={() => setModalOpen(false)} 
        className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500  duration-200  text-center
        
        bg-gray-100 cursor-pointer transition  rounded-lg text-gray-800 hover:bg-gray-200
        "
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200 cursor-pointer text-center sm:px-6"
      >
        Save Note
      </button>
    </div>
  </div>
</div>
          
        </DialogPanel>
      </div>
    </form>
  </Dialog>
)}
    </>
    

  
  );
}
