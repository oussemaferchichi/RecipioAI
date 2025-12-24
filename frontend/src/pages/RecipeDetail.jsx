import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Clock, Users, Heart, Star, Edit, Trash2, ArrowLeft, Sparkles, ChefHat, Flame, Utensils } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SubstitutionModal from '../components/SubstitutionModal'
import axios from 'axios'

const RecipeDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubModalOpen, setIsSubModalOpen] = useState(false)
    const [substitutes, setSubstitutes] = useState(null)
    const [isSubstituting, setIsSubstituting] = useState(false)
    const [selectedIng, setSelectedIng] = useState(null)
    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    useEffect(() => {
        fetchRecipe()
    }, [id])

    const fetchRecipe = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/recipes/${id}/`)
            setRecipe(response.data)
            setUserRating(response.data.user_rating || 0)
        } catch (error) {
            console.error('Failed to fetch recipe:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleFavorite = async () => {
        if (!user) return
        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${id}/toggle_favorite/`)
            setRecipe({ ...recipe, is_favorited: response.data.is_favorited })
        } catch (error) {
            console.error('Favorite error:', error)
        }
    }

    const handleRate = async (score) => {
        if (!user) return
        try {
            const response = await axios.post(`http://localhost:8000/api/recipes/${id}/rate/`, { score })
            setRecipe({ ...recipe, rating_avg: response.data.rating_avg })
            setUserRating(score)
        } catch (error) {
            console.error('Rating error:', error)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Delete this masterpiece?')) {
            try {
                await axios.delete(`http://localhost:8000/api/recipes/${id}/`)
                navigate('/dashboard')
            } catch (error) {
                console.error('Delete error:', error)
            }
        }
    }

    const handleSwap = async (ingredient) => {
        setIsSubstituting(true)
        setSelectedIng(ingredient)
        try {
            const response = await axios.post('http://localhost:8000/api/recipes/substitute/', {
                ingredient: ingredient.name,
                restrictions: user?.dietary_restrictions?.join(', ') || "",
                allergies: user?.allergies?.join(', ') || ""
            })
            setSubstitutes(response.data)
            setIsSubModalOpen(true)
        } catch (error) {
            console.error('Substitution error:', error)
        } finally {
            setIsSubstituting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    if (!recipe) return (
        <div className="min-h-screen flex items-center justify-center text-white font-bold">
            Recipe not found.
        </div>
    )

    const isOwner = user && recipe.author && user.id === recipe.author.id

    return (
        <div className="relative min-h-screen">
            {/* Header Overlay - RELOCATED TO FIX OVERLAP */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link to={-1} className="p-3 glass rounded-2xl text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95">
                    <ArrowLeft size={24} />
                </Link>

                <div className="flex gap-3 pointer-events-auto">
                    {isOwner && (
                        <>
                            <Link to={`/recipes/${id}/edit`} className="p-3 glass rounded-2xl text-orange-400 hover:bg-white/10 transition-all active:scale-95">
                                <Edit size={24} />
                            </Link>
                            <button onClick={handleDelete} className="p-3 glass rounded-2xl text-red-400 hover:bg-white/10 transition-all active:scale-95">
                                <Trash2 size={24} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-3 glass rounded-2xl transition-all active:scale-95 ${recipe.is_favorited ? 'text-red-500' : 'text-white'}`}
                    >
                        <Heart size={24} fill={recipe.is_favorited ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <main className="w-full flex justify-center px-6 pt-24 pb-24">
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Media & Meta */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass border-4 border-white/5 shadow-2xl">
                            <img
                                src={recipe.image ? `http://localhost:8000${recipe.image}` : (recipe.image_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1200')}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">{recipe.title}</h1>
                                <div className="flex flex-wrap gap-3">
                                    {recipe.tags?.map(tag => (
                                        <span key={tag} className="px-4 py-2 glass rounded-xl text-sm font-bold text-orange-400">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { icon: Clock, label: 'Time', value: `${recipe.prep_time + recipe.cook_time}m` },
                                { icon: Users, label: 'Servings', value: recipe.servings },
                                { icon: Flame, label: 'Type', value: recipe.category || 'Special' }
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card p-6 rounded-3xl text-center">
                                    <item.icon size={24} className="mx-auto mb-2 text-orange-500" />
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-xl font-black text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-8 rounded-[2rem]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                                    <Star className="text-yellow-400" size={24} fill="currentColor" />
                                    Community Rating
                                </h3>
                                <div className="text-4xl font-black text-white">{recipe.rating_avg?.toFixed(1) || '0.0'}</div>
                            </div>

                            <div className="flex flex-col items-center gap-4 py-8 border-y border-white/5 mt-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Rate this creation</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-125 group-hover:drop-shadow-orange"
                                        >
                                            <Star
                                                size={48}
                                                className={`${(hoverRating || userRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'
                                                    } transition-colors duration-200`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Ingredients & Instructions */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500">
                                    <Utensils size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic underline decoration-orange-500 decoration-4 underline-offset-8">Ingredients</h2>
                            </div>
                            <div className="space-y-4">
                                {recipe.ingredients?.map((ing, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ x: 10 }}
                                        className="flex justify-between items-center p-5 glass rounded-2xl border border-white/5 group relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                                            <div>
                                                <p className="text-lg font-bold text-white leading-tight">{ing.name}</p>
                                                <p className="text-sm text-gray-500 font-medium">{ing.amount} {ing.unit}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSwap(ing)}
                                            disabled={isSubstituting}
                                            className="flex items-center gap-2 px-4 py-2 glass text-orange-400 hover:text-orange-300 rounded-xl transition-all opacity-0 group-hover:opacity-100 font-bold text-xs"
                                        >
                                            <Sparkles size={14} className={isSubstituting && selectedIng?.id === ing.id ? "animate-spin" : ""} />
                                            AI SWAP
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500">
                                    <ChefHat size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic underline decoration-orange-500 decoration-4 underline-offset-8">Preparation</h2>
                            </div>
                            <div className="space-y-10 pl-6 border-l-2 border-orange-500/10">
                                {recipe.instructions?.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-[41px] top-0 w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm border-[6px] border-[#0f172a]">
                                            {idx + 1}
                                        </div>
                                        <p className="text-xl text-gray-300 leading-relaxed font-semibold">
                                            {step}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>

            <SubstitutionModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                substitutes={substitutes}
            />
        </div>
    )
}

export default RecipeDetail
