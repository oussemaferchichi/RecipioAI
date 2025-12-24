import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('access_token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchCurrentUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchCurrentUser = async () => {
        try {
            const userResponse = await axios.get(`${API_URL}/auth/me/`)
            const profileResponse = await axios.get(`${API_URL}/profiles/me/`)
            setUser({ ...profileResponse.data, ...userResponse.data })
        } catch (error) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            delete axios.defaults.headers.common['Authorization']
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password, name) => {
        const response = await axios.post(`${API_URL}/auth/register/`, {
            email,
            password,
            name
        })

        const { user: userData, tokens } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

        const profileResponse = await axios.get(`${API_URL}/profiles/me/`)
        setUser({ ...profileResponse.data, ...userData })
        return userData
    }

    const signIn = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login/`, {
            email,
            password
        })

        const { user: userData, tokens } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

        const profileResponse = await axios.get(`${API_URL}/profiles/me/`)
        const fullUser = { ...profileResponse.data, ...userData };
        setUser(fullUser)
        return fullUser
    }

    const updateProfile = async (profileData) => {
        const response = await axios.put(`${API_URL}/profiles/me/`, profileData)
        setUser(prev => ({ ...prev, ...response.data }))
        return response.data
    }

    const signOut = async () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        delete axios.defaults.headers.common['Authorization']
        setUser(null)
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshUser: fetchCurrentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
