import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, AlertCircle, CheckCircle2, Package } from 'lucide-react'

const SubstitutionModal = ({ isOpen, onClose, substitutes }) => {
    if (!isOpen) return null

    // The backend returns { alternatives: [...] }
    const alternatives = substitutes?.alternatives || []

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
                    className="relative w-full max-w-xl glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        </div>
                        <Sparkles className="text-white relative z-10 animate-pulse" size={48} />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <h2 className="text-3xl font-black text-white mb-2 leading-tight">AI Ingredient Swaps</h2>
                        <p className="text-gray-400 font-medium mb-8 text-sm">Generated based on your dietary profile and allergies.</p>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {alternatives.length > 0 ? (
                                alternatives.map((alt, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 bg-orange-500/20 p-2 rounded-lg text-orange-500 group-hover:scale-110 transition-transform">
                                                <Package size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white mb-1">{alt.name || alt.ingredient || 'Alternative'}</h4>
                                                <p className="text-sm font-medium text-gray-400 mb-3">{alt.reason || 'Ideal for your requirements.'}</p>

                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={10} />
                                                    Safe Swap
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-orange-500/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-orange-500">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Swaps Found</h3>
                                    <p className="text-gray-500">The AI couldn't find suitable alternatives for this item.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default SubstitutionModal
