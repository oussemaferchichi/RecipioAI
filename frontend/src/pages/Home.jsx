import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, Search, LogOut, Filter, ChevronDown } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import SubstitutionModal from '../components/SubstitutionModal'
import axios from 'axios'

const Home = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [substitutes, setSubstitutes] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [category, setCategory] = useState('')
    const [sortBy, setSortBy] = useState('-created_at')

    const categories = ['Italian', 'Asian', 'Mexican', 'American', 'Dessert', 'Other']

    useEffect(() => {
        fetchRecipes()
    }, [category, sortBy])

    const fetchRecipes = async (query = searchQuery) => {
        setLoading(true)
        try {
            let url = `http://localhost:8000/api/recipes/?search=${query}&ordering=${sortBy}`
            if (category) url += `&category=${category}`

            const response = await axios.get(url)
            setRecipes(response.data)
        } catch (error) {
            console.error('Failed to fetch recipes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchRecipes(searchQuery)
    }

    const handleSubstitute = (data) => {
        setSubstitutes(data)
        setIsModalOpen(true)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const containerStyle = {
        backgroundColor: '#0F172A',
        minHeight: '100vh',
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

    const navLinksStyle = {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    }

    const navLinkStyle = {
        color: 'rgba(255, 255, 255, 0.7)',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.2s'
    }

    const navLinkActiveStyle = {
        ...navLinkStyle,
        color: '#F97316',
        fontWeight: '600'
    }

    const userButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        borderRadius: '0.5rem',
        color: '#F97316',
        cursor: 'pointer',
        fontSize: '0.875rem'
    }

    const authButtonStyle = {
        padding: '0.5rem 1.5rem',
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.875rem',
        textDecoration: 'none',
        display: 'inline-block'
    }

    const heroStyle = {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(15, 23, 42, 0) 100%)'
    }

    const heroTitleStyle = {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #F97316 0%, #FFA500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    }

    const heroSubtitleStyle = {
        fontSize: '1.25rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '2rem'
    }

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        color: '#F97316',
        padding: '0.75rem 1.5rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '600',
        border: '1px solid rgba(249, 115, 22, 0.3)'
    }

    const searchContainerStyle = {
        maxWidth: '600px',
        margin: '2rem auto',
        position: 'relative'
    }

    const searchInputStyle = {
        width: '100%',
        padding: '1rem 3.5rem 1rem 1.5rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    }

    const filterContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap'
    }

    const filterButtonStyle = (isActive) => ({
        padding: '0.5rem 1.25rem',
        borderRadius: '9999px',
        border: `1px solid ${isActive ? '#F97316' : 'rgba(255, 255, 255, 0.2)'}`,
        backgroundColor: isActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
        color: isActive ? '#F97316' : 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
    })

    const selectStyle = {
        backgroundColor: '#1E293B',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        outline: 'none',
        cursor: 'pointer'
    }

    const recipesContainerStyle = {
        padding: '0 2rem 5rem',
        maxWidth: '1200px',
        margin: '0 auto'
    }

    const recipesGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2.5rem'
    }

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '5rem 2rem',
        color: 'rgba(255, 255, 255, 0.6)'
    }

    return (
        <div style={containerStyle}>
            {/* Navigation */}
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>
                    🍽️ RECIPIO AI
                </Link>
                <div style={navLinksStyle}>
                    <Link to="/" style={navLinkActiveStyle}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
                            <button onClick={handleSignOut} style={userButtonStyle}>
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={authButtonStyle}>Sign In</Link>
                            <Link to="/register" style={{ ...authButtonStyle, backgroundColor: 'transparent', border: '1px solid #F97316' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div style={heroStyle}>
                <h1 style={heroTitleStyle}>Smart Recipe Sharing</h1>
                <p style={heroSubtitleStyle}>Discover amazing recipes with AI-powered ingredient substitutions</p>

                <div style={badgeStyle}>
                    <Sparkles size={16} />
                    AI-Powered Substitutions
                </div>

                <form onSubmit={handleSearchSubmit} style={searchContainerStyle}>
                    <input
                        type="text"
                        placeholder="Search recipes, ingredients, tags..."
                        style={searchInputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" style={{ background: 'none', border: 'none', position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <Search size={20} color={searchQuery ? "#F97316" : "rgba(255, 255, 255, 0.4)"} />
                    </button>
                </form>
            </div>

            {/* Main Content */}
            <div style={recipesContainerStyle}>
                {/* Filters */}
                <div style={filterContainerStyle}>
                    <button
                        style={filterButtonStyle(category === '')}
                        onClick={() => setCategory('')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            style={filterButtonStyle(category === cat)}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                    <div style={{ flexGrow: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>Sort by:</span>
                        <select
                            style={selectStyle}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="-created_at">Newest First</option>
                            <option value="created_at">Oldest First</option>
                            <option value="prep_time">Prep Time (Fastest)</option>
                            <option value="-prep_time">Prep Time (Longest)</option>
                        </select>
                    </div>
                </div>

                {/* Recipes Grid */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {category ? `${category} Recipes` : '🔥 Popular Recipes'}
                    <span style={{ fontSize: '0.875rem', color: 'rgba(249, 115, 22, 0.7)', fontWeight: 'normal' }}>({recipes.length})</span>
                </h2>

                {loading ? (
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ color: '#F97316' }}>Loading amazing recipes...</div>
                    </div>
                ) : recipes.length > 0 ? (
                    <div style={recipesGridStyle}>
                        {recipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onSubstitute={handleSubstitute}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <div style={{ marginBottom: '1rem' }}>No recipes found matching your criteria.</div>
                        <button
                            onClick={() => { setSearchQuery(''); setCategory(''); fetchRecipes(''); }}
                            style={{ ...filterButtonStyle(false), color: '#F97316', borderColor: '#F97316' }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Substitution Modal */}
            <SubstitutionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                substitutes={substitutes}
            />
        </div>
    )
}

export default Home
