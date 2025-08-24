import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/homepage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import assets from './assets/assets'

const App = () => {
  return (
    
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
    {/* we have added the background image using tailwind class , this image will be visible for all the pages .  ; */}

      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App