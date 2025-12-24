import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetail from './pages/RecipeDetail'
import GenerateRecipe from './pages/GenerateRecipe'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <div className="mesh-bg"></div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipes/create"
                        element={
                            <ProtectedRoute>
                                <CreateRecipe />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipes/:id"
                        element={<RecipeDetail />}
                    />
                    <Route
                        path="/recipes/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditRecipe />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/generate-recipe"
                        element={
                            <ProtectedRoute>
                                <GenerateRecipe />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
