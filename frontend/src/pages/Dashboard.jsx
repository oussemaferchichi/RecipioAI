import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PlusCircle, Heart, Star, LogOut, Search, Settings } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import SubstitutionModal from '../components/SubstitutionModal'
import PreferencesModal from '../components/PreferencesModal'
import axios from 'axios'

const Dashboard = () => {
    const { user, signOut, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [myRecipes, setMyRecipes] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('recipes') // 'recipes' or 'favorites'

    // Modals
    const [substitutes, setSubstitutes] = useState(null)
    const [isSubModalOpen, setIsSubModalOpen] = useState(false)
    const [isPrefsModalOpen, setIsPrefsModalOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            try {
                // Fetch My Recipes
                const recipesRes = await axios.get(`http://localhost:8000/api/recipes/?author=${user.id}`)
                setMyRecipes(recipesRes.data)

                // Fetch Favorites
                const favsRes = await axios.get('http://localhost:8000/api/recipes/my_favorites/')
                setFavorites(favsRes.data)
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const handleSubstitute = (data) => {
        setSubstitutes(data)
        setIsSubModalOpen(true)
    }

    const handleProfileUpdate = (updatedProfile) => {
        // Update AuthContext user with new profile data
        updateProfile(updatedProfile)
    }

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    }

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
    }

    const logoStyle = {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#F97316',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none'
    }

    const userButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    }

    const iconButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.875rem'
    }

    const signOutButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '0.5rem',
        color: '#FCA5A5',
        cursor: 'pointer',
        fontSize: '0.875rem'
    }

    const contentStyle = {
        padding: '3rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    }

    const welcomeStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
    }

    const emailStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '3rem'
    }

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
    }

    const statCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '1.5rem'
    }

    const statLabelStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
    }

    const statValueStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#F97316'
    }

    const sectionTitleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
    }

    const tabsContainerStyle = {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1rem'
    }

    const tabStyle = (isActive) => ({
        padding: '0.5rem 1rem',
        background: 'none',
        border: 'none',
        borderBottom: isActive ? '2px solid #F97316' : '2px solid transparent',
        color: isActive ? '#F97316' : 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        fontSize: '1.125rem',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s'
    })

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '1rem',
        border: '2px dashed rgba(255, 255, 255, 0.1)'
    }

    const createButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: '600',
        textDecoration: 'none'
    }

    const recipesGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
    }

    const recipesToShow = activeTab === 'recipes' ? myRecipes : favorites

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>
                    🍽️ RECIPIO AI
                </Link>
                <div style={userButtonStyle}>
                    <button onClick={() => setIsPrefsModalOpen(true)} style={iconButtonStyle}>
                        <Settings size={18} />
                        Preferences
                    </button>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {user?.email}
                    </span>
                    <button onClick={handleSignOut} style={signOutButtonStyle}>
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </nav>

            <div style={contentStyle}>
                <h1 style={welcomeStyle}>Welcome back!</h1>
                <p style={emailStyle}>Manage your culinary journey.</p>

                <div style={statsGridStyle}>
                    <div style={statCardStyle}>
                        <div style={statLabelStyle}>Recipes Created</div>
                        <div style={statValueStyle}>{myRecipes.length}</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statLabelStyle}>Favorites</div>
                        <div style={statValueStyle}>{favorites.length}</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statLabelStyle}>Avg Rating Received</div>
                        <div style={statValueStyle}>
                            {myRecipes.length > 0
                                ? (myRecipes.reduce((acc, curr) => acc + curr.rating_avg, 0) / myRecipes.length).toFixed(1)
                                : '-'
                            }
                        </div>
                    </div>
                </div>

                <div style={tabsContainerStyle}>
                    <button
                        style={tabStyle(activeTab === 'recipes')}
                        onClick={() => setActiveTab('recipes')}
                    >
                        My Recipes
                    </button>
                    <button
                        style={tabStyle(activeTab === 'favorites')}
                        onClick={() => setActiveTab('favorites')}
                    >
                        My Favorites
                    </button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : recipesToShow.length > 0 ? (
                    <div style={recipesGridStyle}>
                        {recipesToShow.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onSubstitute={handleSubstitute}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {activeTab === 'recipes' ? 'No recipes yet' : 'No favorites yet'}
                        </div>
                        <Link to={activeTab === 'recipes' ? "/recipes/create" : "/"} style={createButtonStyle}>
                            {activeTab === 'recipes' ? <><PlusCircle size={20} /> Create Recipe</> : <><Search size={20} /> Browse Recipes</>}
                        </Link>
                    </div>
                )}
            </div>

            <SubstitutionModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                substitutes={substitutes}
            />

            <PreferencesModal
                isOpen={isPrefsModalOpen}
                onClose={() => setIsPrefsModalOpen(false)}
                user={user}
                onUpdate={handleProfileUpdate}
            />
        </div>
    )
}

export default Dashboard
