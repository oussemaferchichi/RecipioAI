import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft, Save, RefreshCw, ChefHat, Clock, Users, Utensils } from 'lucide-react'
import axios from 'axios'

const GenerateRecipe = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [ingredients, setIngredients] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedRecipe, setGeneratedRecipe] = useState(null)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleGenerate = async () => {
        if (!ingredients.trim()) {
            setError('Please enter some ingredients!')
            return
        }

        setIsGenerating(true)
        setError('')
        setGeneratedRecipe(null)

        try {
            const response = await axios.post('http://localhost:8000/api/generate-recipe/', {
                ingredients: ingredients
            })
            setGeneratedRecipe(response.data)
        } catch (err) {
            console.error('Generation error:', err)
            setError(err.response?.data?.error || 'Failed to generate recipe. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveRecipe = async () => {
        if (!generatedRecipe) return

        setIsSaving(true)
        try {
            // Save the generated recipe to the user's account
            const recipePayload = {
                title: generatedRecipe.title,
                description: generatedRecipe.description,
                prep_time: generatedRecipe.prep_time,
                cook_time: generatedRecipe.cook_time,
                servings: generatedRecipe.servings,
                category: generatedRecipe.category,
                ingredients: generatedRecipe.ingredients,
                instructions: generatedRecipe.instructions
            }

            const response = await axios.post('http://localhost:8000/api/recipes/', recipePayload)
            // Navigate to the newly created recipe
            navigate(`/recipes/${response.data.id}`)
        } catch (err) {
            console.error('Save error:', err)
            setError('Failed to save recipe. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="relative min-h-screen pb-20">
            {/* Navigation */}
            <nav className="sticky top-0 z-40 glass border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-bold">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-500/10 p-2 rounded-lg">
                            <Sparkles className="text-orange-500" size={20} />
                        </div>
                        <h1 className="text-xl font-black text-white">AI Recipe Generator</h1>
                    </div>
                </div>
            </nav>

            <div className="w-full flex justify-center px-6 pt-12">
                <div className="max-w-6xl w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-orange-400 text-sm font-bold mb-6">
                            <ChefHat size={16} />
                            <span>Powered by Advanced AI</span>
                        </div>
                        <h2 className="text-5xl font-black text-white mb-4 leading-tight">
                            Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Ingredients</span> Into Magic
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
                            Simply list what you have in your kitchen, and let our AI chef create a personalized recipe tailored to your taste and dietary needs.
                        </p>
                    </motion.div>

                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8 rounded-3xl mb-8"
                    >
                        <label className="block text-sm font-black text-white uppercase tracking-widest mb-4">
                            Your Available Ingredients
                        </label>
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="E.g., chicken breast, rice, broccoli, soy sauce, garlic, ginger..."
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-500 leading-relaxed"
                        />
                        {user?.dietary_restrictions?.length > 0 || user?.allergies?.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">AI will consider:</span>
                                {user?.dietary_restrictions?.map(restriction => (
                                    <span key={restriction} className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-bold">
                                        {restriction}
                                    </span>
                                ))}
                                {user?.allergies?.map(allergy => (
                                    <span key={allergy} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold">
                                        🚫 {allergy}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !ingredients.trim()}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" />
                                    Generating Your Recipe...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate Recipe
                                </>
                            )}
                        </button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Generated Recipe */}
                    <AnimatePresence>
                        {generatedRecipe && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-card p-8 rounded-3xl"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-3xl font-black text-white mb-2">{generatedRecipe.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{generatedRecipe.description}</p>
                                    </div>
                                    <span className="px-4 py-2 glass rounded-xl text-sm font-bold text-orange-400">
                                        {generatedRecipe.category}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {[
                                        { icon: Clock, label: 'Prep', value: `${generatedRecipe.prep_time}m` },
                                        { icon: Clock, label: 'Cook', value: `${generatedRecipe.cook_time}m` },
                                        { icon: Users, label: 'Serves', value: generatedRecipe.servings }
                                    ].map((item, idx) => (
                                        <div key={idx} className="glass p-4 rounded-2xl text-center">
                                            <item.icon size={20} className="mx-auto mb-2 text-orange-500" />
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-lg font-black text-white">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Ingredients */}
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                                            <Utensils size={20} className="text-orange-500" />
                                            Ingredients
                                        </h4>
                                        <div className="space-y-2">
                                            {generatedRecipe.ingredients?.map((ing, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                    <span className="font-medium text-white">{ing.name}</span>
                                                    <span className="text-sm text-gray-400 ml-auto">{ing.amount} {ing.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                                            <ChefHat size={20} className="text-orange-500" />
                                            Instructions
                                        </h4>
                                        <div className="space-y-4">
                                            {generatedRecipe.instructions?.map((step, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-gray-300 leading-relaxed pt-1">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
                                    <button
                                        onClick={handleSaveRecipe}
                                        disabled={isSaving}
                                        className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-sm"
                                    >
                                        {isSaving ? (
                                            <>
                                                <RefreshCw size={20} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Save Recipe
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setGeneratedRecipe(null)}
                                        className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                                    >
                                        <RefreshCw size={20} />
                                        Generate New
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default GenerateRecipe
