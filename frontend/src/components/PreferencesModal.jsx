import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, ChefHat, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

const PreferencesModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [dietaryRestrictions, setDietaryRestrictions] = useState(user?.dietary_restrictions || [])
    const [allergies, setAllergies] = useState(user?.allergies || [])
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const diets = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free']
    const commonAllergies = ['Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 'Shellfish', 'Eggs', 'Milk']

    const handleToggle = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item))
        } else {
            setList([...list, item])
        }
        setMessage('')
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await axios.patch('http://localhost:8000/api/profiles/me/', {
                dietary_restrictions: dietaryRestrictions,
                allergies: allergies
            })
            onUpdate(response.data)
            setMessage('Preferences saved successfully!')
            setTimeout(() => {
                setMessage('')
                onClose()
            }, 1000)
        } catch (error) {
            console.error('Failed to save preferences:', error)
            setMessage('Failed to save preferences.')
        } finally {
            setSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-24 bg-gradient-to-r from-orange-500/10 to-transparent flex items-center px-8">
                        <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-500 mr-4">
                            <Settings size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-shadow-glow">Kitchen Preferences</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Personalize your AI results</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-auto p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Dietary Restrictions */}
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <ChefHat size={16} className="text-orange-500" />
                                Dietary Profile
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {diets.map(diet => (
                                    <button
                                        key={diet}
                                        onClick={() => handleToggle(diet, dietaryRestrictions, setDietaryRestrictions)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${dietaryRestrictions.includes(diet)
                                                ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-lg shadow-orange-500/20'
                                                : 'glass border-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-red-500" />
                                Allergen Warnings
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {commonAllergies.map(allergy => (
                                    <button
                                        key={allergy}
                                        onClick={() => handleToggle(allergy, allergies, setAllergies)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${allergies.includes(allergy)
                                                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-500/20'
                                                : 'glass border-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        {allergy}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-center gap-2 text-sm font-bold ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}
                                    >
                                        {message.includes('success') ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                        {message}
                                    </motion.div>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {saving ? 'SAVING...' : 'SAVE CHANGES'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default PreferencesModal
