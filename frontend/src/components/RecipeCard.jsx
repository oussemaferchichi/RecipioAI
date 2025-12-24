import { useState } from 'react'
import { Clock, Users, Sparkles, Edit, Trash2, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const RecipeCard = ({ recipe: initialRecipe, onSubstitute }) => {
    const { user } = useAuth()
    const [recipe, setRecipe] = useState(initialRecipe)
    const [isSubstituting, setIsSubstituting] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState(null)
    const [isHoveringHeart, setIsHoveringHeart] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)
    const [imageError, setImageError] = useState(false)

    const isOwner = user && recipe.author && user.id === recipe.author.id

    const handleSwap = async (ingredient) => {
        setIsSubstituting(true)
        setSelectedIngredient(ingredient)

        try {
            const response = await axios.post('http://localhost:8000/api/recipes/substitute/', {
                ingredient: ingredient.name,
                restrictions: user?.dietary_restrictions?.join(', ') || "",
                allergies: user?.allergies?.join(', ') || ""
            })

            onSubstitute(response.data)
        } catch (error) {
            console.error('Substitution error:', error)
            alert('Failed to get substitution.')
        } finally {
            setIsSubstituting(false)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await axios.delete(`http://localhost:8000/api/recipes/${recipe.id}/`)
                window.location.reload()
            } catch (error) {
                console.error('Delete error:', error)
                const errorMsg = error.response?.data?.detail || 'Failed to delete recipe. You may not have permission.'
                alert(errorMsg)
            }
        }
    }

    const handleToggleFavorite = async (e) => {
        e.stopPropagation()
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

    const handleRate = async (e, score) => {
        e.stopPropagation()
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

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '1.5rem',
        transition: 'all 0.3s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '0.75rem',
        marginBottom: '1rem'
    }

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '0.5rem'
    }

    const descStyle = {
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '1rem',
        fontSize: '0.875rem'
    }

    const actionButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        padding: '0.25rem',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const tagStyle = {
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        color: '#F97316',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem'
    }

    const swapButtonStyle = {
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        padding: '0.375rem 0.75rem',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'all 0.2s'
    }

    return (
        <div style={cardStyle}>
            {(recipe.image || recipe.image_url) && !imageError && (
                <img
                    src={recipe.image ? `http://localhost:8000${recipe.image}` : recipe.image_url}
                    alt={recipe.title}
                    style={imageStyle}
                    onError={() => setImageError(true)}
                />
            )}

            <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={handleToggleFavorite}
                    onMouseEnter={() => setIsHoveringHeart(true)}
                    onMouseLeave={() => setIsHoveringHeart(false)}
                    style={{
                        ...actionButtonStyle,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        color: (recipe.is_favorited || isHoveringHeart) ? '#EF4444' : 'white'
                    }}
                >
                    <Heart size={20} fill={(recipe.is_favorited || isHoveringHeart) ? '#EF4444' : 'none'} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={titleStyle}>{recipe.title}</h3>
                </Link>
                {isOwner && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/recipes/${recipe.id}/edit`} style={{ ...actionButtonStyle, color: '#F97316' }}>
                            <Edit size={18} />
                        </Link>
                        <button onClick={handleDelete} style={{ ...actionButtonStyle, color: '#EF4444' }}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>

            <p style={descStyle}>{recipe.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={(e) => handleRate(e, star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ ...actionButtonStyle, padding: '1px' }}
                        >
                            <Star
                                size={16}
                                color={(hoverRating || recipe.user_rating) >= star ? '#FBBF24' : 'rgba(255, 255, 255, 0.2)'}
                                fill={(hoverRating || recipe.user_rating) >= star ? '#FBBF24' : 'none'}
                            />
                        </button>
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '0.5rem' }}>
                        ({recipe.rating_avg?.toFixed(1) || '0.0'})
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                    <Clock size={16} />
                    <span>{recipe.prep_time + recipe.cook_time}m</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                    <Users size={16} />
                    <span>{recipe.servings} ser.</span>
                </div>
            </div>

            {recipe.tags && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {recipe.tags.map((tag, idx) => (
                        <span key={idx} style={tagStyle}>{tag}</span>
                    ))}
                </div>
            )}

            <div style={{ marginTop: 'auto' }}>
                <div style={{ color: '#F97316', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>Ingredients:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {recipe.ingredients?.slice(0, 3).map((ing, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'white' }}>{ing.name}</span>
                            <button
                                style={swapButtonStyle}
                                onClick={(e) => { e.stopPropagation(); handleSwap(ing); }}
                                disabled={isSubstituting}
                            >
                                <Sparkles size={12} />
                                {isSubstituting && selectedIngredient?.id === ing.id ? '...' : 'SWAP'}
                            </button>
                        </div>
                    ))}
                    {recipe.ingredients?.length > 3 && (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>
                            + {recipe.ingredients.length - 3} more ingredients
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecipeCard
