import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PlusCircle, Heart, Star, LogOut, Search, Settings, Utensils, Award, ChefHat, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
        updateProfile(updatedProfile)
    }

    const recipesToShow = activeTab === 'recipes' ? myRecipes : favorites

    return (
        <div className="relative min-h-screen pb-20">
            {/* Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 glass border-b border-white/10 px-6 py-4 flex justify-between items-center"
            >
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <Utensils className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">RECIPIO <span className="text-orange-500">AI</span></span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        to="/generate-recipe"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-orange-500/20"
                    >
                        <ChefHat size={18} />
                        AI Generator
                    </Link>
                    <button
                        onClick={() => setIsPrefsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all"
                    >
                        <Settings size={18} className="text-orange-500" />
                        Preferences
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-bold text-red-500 transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-bold text-white border-2 border-white/20">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                </div>
            </motion.nav>

            <div className="w-full flex justify-center px-6 pt-12">
                <div className="max-w-7xl w-full">
                    <header className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-white leading-tight mb-2">
                                Chef <span className="text-orange-500">{user?.email?.split('@')[0]}</span>'s Kitchen
                            </h1>
                            <p className="text-gray-400 font-medium">Manage your culinary masterpieces and favorites.</p>
                        </motion.div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { label: 'Recipes Created', value: myRecipes.length, icon: ChefHat, color: 'orange' },
                            { label: 'Saved Favorites', value: favorites.length, icon: Heart, color: 'red' },
                            { label: 'Kitchen Impact', value: myRecipes.length > 0 ? (myRecipes.reduce((acc, curr) => acc + curr.rating_avg, 0) / myRecipes.length).toFixed(1) : '-', icon: Flame, color: 'yellow' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-${stat.color}-500`}>
                                    <stat.icon size={80} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <div className={`text-4xl font-black text-${stat.color}-500`}>{stat.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
                        {[
                            { id: 'recipes', label: 'My Creations', icon: ChefHat },
                            { id: 'favorites', label: 'My Favorites', icon: Heart }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-orange-500' : ''} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-[-17px] left-0 right-0 h-1 bg-orange-500 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {recipesToShow.length > 0 ? (
                                        recipesToShow.map(recipe => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                onSubstitute={handleSubstitute}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center glass border-2 border-dashed border-white/10 rounded-3xl">
                                            <div className="text-gray-500 text-lg font-bold mb-6">
                                                {activeTab === 'recipes' ? "You haven't shared any recipes yet." : "Your favorites list is empty."}
                                            </div>
                                            <Link
                                                to={activeTab === 'recipes' ? "/recipes/create" : "/"}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                                            >
                                                {activeTab === 'recipes' ? <><PlusCircle size={20} /> Create Your First Recipe</> : <><Search size={20} /> Discover Recipes</>}
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
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
