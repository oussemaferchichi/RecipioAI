import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, Search, LogOut, Filter, ChevronDown, Utensils, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

    const categories = ['Italian', 'Asian', 'Mexican', 'American', 'Dessert', 'Healthy']

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

    return (
        <div className="relative min-h-screen">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-40 glass border-b border-white/10 px-6 py-4 flex justify-between items-center"
            >
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <Utensils className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">RECIPIO <span className="text-orange-500">AI</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-bold text-orange-500">Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Sign In</Link>
                            <Link to="/register" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20">
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </motion.nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-16 px-6 overflow-hidden flex justify-center">
                <div className="max-w-6xl w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-orange-400 text-sm font-bold mb-8"
                    >
                        <Sparkles size={16} />
                        <span>Powered by Advanced AI</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-tight"
                    >
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Digital Cooking.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Share, discover, and adapt recipes instantly with smart AI-driven ingredient swaps tailored to your needs.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSearchSubmit}
                        className="max-w-xl mx-auto relative group"
                    >
                        <input
                            type="text"
                            placeholder="Find inspiration... (e.g. Vegan Lasagna)"
                            className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 top-3 bottom-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all active:scale-95 flex items-center gap-2 font-bold">
                            <Search size={20} />
                            Search
                        </button>
                    </motion.form>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex justify-center px-6 pb-24">
                <div className="max-w-7xl w-full">
                    {/* Filter Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-8">
                        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                            <button
                                onClick={() => setCategory('')}
                                className={`px-5 py-2 rounded-xl font-bold transition-all ${category === '' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'glass text-gray-400 hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-5 py-2 rounded-xl font-bold transition-all ${category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'glass text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sort By</span>
                            <select
                                className="glass px-4 py-2 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-orange-500/50"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="-created_at">Newest</option>
                                <option value="created_at">Oldest</option>
                                <option value="prep_time">Prep Time (Lo)</option>
                                <option value="-prep_time">Prep Time (Hi)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-orange-500/10 p-2 rounded-lg">
                            <Zap className="text-orange-500" size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            {category ? `${category} Kitchen` : 'Trending Recipes'}
                            <span className="ml-3 text-orange-500/50 text-xl font-bold">[{recipes.length}]</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-orange-500 font-bold animate-pulse uppercase tracking-widest text-xs">Mixing Flavors...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {recipes.length > 0 ? (
                                recipes.map(recipe => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        onSubstitute={handleSubstitute}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="text-gray-500 text-lg font-bold mb-4">No culinary matches found.</div>
                                    <button
                                        onClick={() => { setSearchQuery(''); setCategory(''); }}
                                        className="px-6 py-2 border border-orange-500/50 text-orange-500 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>

            <SubstitutionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                substitutes={substitutes}
            />
        </div>
    )
}

export default Home
