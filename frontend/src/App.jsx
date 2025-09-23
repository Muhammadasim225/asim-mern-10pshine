import './App.css'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Signup from './components/Signup'
import Login from './components/Login'

function App() {

  return (
    <>
    {/* <h1 className='text-2xl text-blue-400'>Hello Wolrd</h1> */}
    <Routes>
      <Route path="/" element={<Dashboard></Dashboard>}></Route>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
    </>
  )
}

export default App
