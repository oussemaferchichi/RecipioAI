import { useState } from 'react'
import { Clock, Users, Sparkles, Edit, Trash2, Heart, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import ConfirmDialog from './ConfirmDialog'

const RecipeCard = ({ recipe: initialRecipe, onSubstitute }) => {
    const { user } = useAuth()
    const [recipe, setRecipe] = useState(initialRecipe)
    const [isSubstituting, setIsSubstituting] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState(null)
    const [isHoveringHeart, setIsHoveringHeart] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)
    const [imageError, setImageError] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const isOwner = user && recipe.author && user.id === recipe.author.id

    const handleSwap = async (e, ingredient) => {
        e.preventDefault()
        e.stopPropagation()
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
        } finally {
            setIsSubstituting(false)
        }
    }

    const handleDeleteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowDeleteConfirm(true)
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/recipes/${recipe.id}/`)
            window.location.reload()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    const handleToggleFavorite = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) return

        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${recipe.id}/toggle_favorite/`)
            setRecipe({ ...recipe, is_favorited: response.data.is_favorited })
        } catch (error) {
            console.error('Favorite error:', error)
        }
    }

    const handleRate = async (e, score) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) return

        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${recipe.id}/rate/`, { score })
            setRecipe({ ...recipe, user_rating: score, rating_avg: response.data.rating_avg })
        } catch (error) {
            console.error('Rating error:', error)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="glass-card flex flex-col h-full overflow-hidden group rounded-2xl"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <Link to={`/recipes/${recipe.id}`}>
                    <img
                        src={recipe.image ? `http://localhost:8000${recipe.image}` : (recipe.image_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800')}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800' }}
                    />
                </Link>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {recipe.category && (
                        <span className="px-3 py-1 text-xs font-semibold glass text-orange-400 rounded-full">
                            {recipe.category}
                        </span>
                    )}
                </div>

                {/* Favorite Button Overlay */}
                <button
                    onClick={handleToggleFavorite}
                    onMouseEnter={() => setIsHoveringHeart(true)}
                    onMouseLeave={() => setIsHoveringHeart(false)}
                    className={`absolute top-4 right-4 p-2 rounded-full glass transition-all ${recipe.is_favorited ? 'text-red-500' : 'text-white'
                        }`}
                >
                    <Heart size={20} fill={recipe.is_favorited || isHoveringHeart ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/recipes/${recipe.id}`} className="hover:text-orange-500 transition-colors">
                        <h3 className="text-xl font-bold leading-tight line-clamp-1">{recipe.title}</h3>
                    </Link>
                    {isOwner && (
                        <div className="flex gap-1">
                            <Link to={`/recipes/${recipe.id}/edit`} className="p-1.5 text-orange-400 hover:text-orange-300 glass rounded-lg transition-colors">
                                <Edit size={16} />
                            </Link>
                            <button onClick={handleDeleteClick} className="p-1.5 text-red-400 hover:text-red-300 glass rounded-lg transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                    {recipe.description}
                </p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm glass px-3 py-2 rounded-xl">
                        <Clock size={16} className="text-orange-500" />
                        <span>{recipe.prep_time + recipe.cook_time}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm glass px-3 py-2 rounded-xl">
                        <Users size={16} className="text-orange-500" />
                        <span>{recipe.servings} Serv.</span>
                    </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={(e) => handleRate(e, star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    size={16}
                                    className={`${(hoverRating || recipe.user_rating || recipe.rating_avg) >= star
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="text-xs text-gray-400 ml-2">
                            ({recipe.rating_avg?.toFixed(1) || '0.0'})
                        </span>
                    </div>
                </div>

                {/* AI Swap Snippet */}
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-500/80">Ingredients</span>
                    <div className="space-y-1.5">
                        {recipe.ingredients?.slice(0, 2).map((ing, idx) => (
                            <div key={idx} className="flex justify-between items-center group/ing">
                                <span className="text-sm text-gray-300">{ing.name}</span>
                                <button
                                    onClick={(e) => handleSwap(e, ing)}
                                    disabled={isSubstituting}
                                    className="p-1.5 glass text-orange-400 hover:text-orange-300 rounded-lg transition-all opacity-0 group-hover/ing:opacity-100"
                                >
                                    <Sparkles size={14} className={isSubstituting && selectedIngredient?.id === ing.id ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Link
                    to={`/recipes/${recipe.id}`}
                    className="mt-6 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                >
                    View Recipe <ArrowRight size={18} />
                </Link>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Recipe?"
                message="Are you sure you want to delete this recipe? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </motion.div>
    )
}

export default RecipeCard
