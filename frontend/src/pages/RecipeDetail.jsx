import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Clock, Users, ArrowLeft, Heart, Star, Sparkles, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import SubstitutionModal from '../components/SubstitutionModal'

const RecipeDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Substitution state
    const [isSubstituting, setIsSubstituting] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState(null)
    const [substitutes, setSubstitutes] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Interaction state
    const [hoverRating, setHoverRating] = useState(0)
    const [isHoveringHeart, setIsHoveringHeart] = useState(false)

    const isOwner = user && recipe && recipe.author && user.id === recipe.author.id

    useEffect(() => {
        fetchRecipe()
    }, [id])

    const fetchRecipe = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/recipes/${id}/`)
            setRecipe(response.data)
        } catch (err) {
            setError('Failed to load recipe details.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSwap = async (ingredient) => {
        setIsSubstituting(true)
        setSelectedIngredient(ingredient)

        try {
            const response = await axios.post('http://localhost:8000/api/recipes/substitute/', {
                ingredient: ingredient.name,
                restrictions: user?.dietary_restrictions?.join(', ') || "",
                allergies: user?.allergies?.join(', ') || ""
            })

            setSubstitutes(response.data)
            setIsModalOpen(true)
        } catch (error) {
            console.error('Substitution error:', error)
            alert('Failed to get substitution.')
        } finally {
            setIsSubstituting(false)
        }
    }

    const handleToggleFavorite = async () => {
        if (!user) {
            alert('Please sign in to favorite recipes!')
            return
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${recipe.id}/toggle_favorite/`)
            setRecipe({ ...recipe, is_favorited: response.data.is_favorited })
        } catch (error) {
            console.error('Favorite error:', error)
        }
    }

    const handleRate = async (score) => {
        if (!user) {
            alert('Please sign in to rate recipes!')
            return
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${recipe.id}/rate/`, { score })
            setRecipe({ ...recipe, user_rating: score, rating_avg: response.data.rating_avg })
        } catch (error) {
            console.error('Rating error:', error)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await axios.delete(`http://localhost:8000/api/recipes/${recipe.id}/`)
                navigate('/dashboard')
            } catch (error) {
                console.error('Delete error:', error)
                alert('Failed to delete recipe.')
            }
        }
    }

    // Styles (reusing similar styles from Home/CreateRecipe)
    const containerStyle = {
        backgroundColor: '#0F172A',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    }

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
    }

    const contentStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
    }

    const headerStyle = {
        marginBottom: '2rem'
    }

    const titleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: 'white'
    }

    const imageStyle = {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '1rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    }

    const sectionTitleStyle = {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#F97316',
        marginBottom: '1rem',
        marginTop: '2rem'
    }

    const metaContainerStyle = {
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem'
    }

    const metaItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'rgba(255, 255, 255, 0.8)'
    }

    const ingredientItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
    }

    const swapButtonStyle = {
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        fontSize: '0.875rem'
    }

    const actionButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    if (loading) return <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
    if (error || !recipe) return <div style={{ ...containerStyle, padding: '2rem' }}>{error || 'Recipe not found'}</div>

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back
                </Link>
                <div style={{ flex: 1 }}></div>
                {isOwner && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate(`/recipes/${recipe.id}/edit`)} style={{ ...actionButtonStyle, color: '#F97316' }}>
                            <Edit size={20} /> Edit
                        </button>
                        <button onClick={handleDelete} style={{ ...actionButtonStyle, color: '#EF4444' }}>
                            <Trash2 size={20} /> Delete
                        </button>
                    </div>
                )}
            </nav>

            <div style={contentStyle}>
                {(recipe.image || recipe.image_url) && (
                    <img
                        src={recipe.image ? `http://localhost:8000${recipe.image}` : recipe.image_url}
                        alt={recipe.title}
                        style={imageStyle}
                    />
                )}

                <div style={headerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h1 style={titleStyle}>{recipe.title}</h1>
                        <button
                            onClick={handleToggleFavorite}
                            onMouseEnter={() => setIsHoveringHeart(true)}
                            onMouseLeave={() => setIsHoveringHeart(false)}
                            style={{
                                ...actionButtonStyle,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                color: (recipe.is_favorited || isHoveringHeart) ? '#EF4444' : 'white'
                            }}
                        >
                            <Heart size={24} fill={(recipe.is_favorited || isHoveringHeart) ? '#EF4444' : 'none'} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{ ...actionButtonStyle, padding: '2px' }}
                                >
                                    <Star
                                        size={20}
                                        color={(hoverRating || recipe.user_rating) >= star ? '#FBBF24' : 'rgba(255, 255, 255, 0.2)'}
                                        fill={(hoverRating || recipe.user_rating) >= star ? '#FBBF24' : 'none'}
                                    />
                                </button>
                            ))}
                            <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)', marginLeft: '0.5rem' }}>
                                ({recipe.rating_avg?.toFixed(1) || '0.0'})
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                        {recipe.description}
                    </p>
                </div>

                <div style={metaContainerStyle}>
                    <div style={metaItemStyle}>
                        <Clock size={20} color="#F97316" />
                        <span>Prep: {recipe.prep_time}m</span>
                    </div>
                    <div style={metaItemStyle}>
                        <Clock size={20} color="#F97316" />
                        <span>Cook: {recipe.cook_time}m</span>
                    </div>
                    <div style={metaItemStyle}>
                        <Users size={20} color="#F97316" />
                        <span>Serves: {recipe.servings}</span>
                    </div>
                </div>

                <div>
                    <h2 style={sectionTitleStyle}>Ingredients</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        {recipe.ingredients.map((ing, idx) => (
                            <div key={idx} style={ingredientItemStyle}>
                                <div>
                                    <span style={{ fontWeight: '600', color: 'white' }}>{ing.name}</span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', marginLeft: '0.5rem' }}>
                                        {ing.amount} {ing.unit}
                                    </span>
                                </div>
                                <button
                                    style={{
                                        ...swapButtonStyle,
                                        opacity: isSubstituting && selectedIngredient?.id === ing.id ? 0.7 : 1
                                    }}
                                    onClick={() => handleSwap(ing)}
                                    disabled={isSubstituting}
                                >
                                    <Sparkles size={16} />
                                    {isSubstituting && selectedIngredient?.id === ing.id ? 'Analyzing...' : 'AI Swap'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 style={sectionTitleStyle}>Instructions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Array.isArray(recipe.instructions) ? recipe.instructions.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#F97316', fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {idx + 1}
                                </div>
                                <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6', marginTop: '0.2rem' }}>
                                    {step}
                                </p>
                            </div>
                        )) : (
                            <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>{recipe.instructions}</p>
                        )}
                    </div>
                </div>
            </div>

            <SubstitutionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                substitutes={substitutes}
            />
        </div>
    )
}

export default RecipeDetail
