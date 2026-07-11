import {Routes, Route } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardLayout from './layouts/DashboardLayout'
import CategoriesPage from './pages/CategoriesPage'
import MenuItemsPage from './pages/MenuItemsPage'
import SettingsPage from './pages/SettingsPage'

function App(){
  return(

    <Routes>
      <Route path='/login' element={<LoginPage/>}/>

      <Route element={  
                        <ProtectedRoute>
                        <DashboardLayout/>
                        </ProtectedRoute>}>
              <Route path='dashboard' element={<DashboardPage/>}/>
              <Route path='categories' element={<CategoriesPage/>}/>
              <Route path='menu-items' element={<MenuItemsPage/>}/>
              <Route path='settings' element={<SettingsPage/>}/>
      </Route>
      <Route path='*' element={<NotFoundPage/>}/>
    </Routes>
  )
}
export default App