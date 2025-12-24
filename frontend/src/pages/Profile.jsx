import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Save, LogOut, ArrowLeft, User, ShieldCheck, AlertCircle } from 'lucide-react'

const Profile = () => {
    const { user, signOut, updateProfile } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        avatar_url: '',
        dietary_restrictions: [],
        allergies: []
    })

    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free', 'Low-Carb']
    const allergyOptions = ['Nuts', 'Peanuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Fish']

    useEffect(() => {
        if (user) {
            setFormData({
                avatar_url: user.avatar_url || '',
                dietary_restrictions: user.dietary_restrictions || [],
                allergies: user.allergies || []
            })
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setSuccess(false)
        setError('')

        try {
            await updateProfile(formData)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Failed to update profile preferences')
        } finally {
            setSaving(false)
        }
    }

    const toggleOption = (field, option) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(option)
                ? prev[field].filter(o => o !== option)
                : [...prev[field], option]
        }))
    }

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#0F172A',
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
        textDecoration: 'none'
    }

    const contentStyle = {
        padding: '3rem 2rem',
        maxWidth: '800px',
        margin: '0 auto'
    }

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    }

    const labelStyle = {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#F97316',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    }

    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '2rem'
    }

    const optionStyle = (isActive) => ({
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        border: `1px solid ${isActive ? '#F97316' : 'rgba(255, 255, 255, 0.1)'}`,
        backgroundColor: isActive ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255, 255, 255, 0.02)',
        color: isActive ? '#F97316' : 'white',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        fontWeight: isActive ? '600' : 'normal'
    })

    const buttonStyle = {
        padding: '1rem 2rem',
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'transform 0.2s'
    }

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>🍽️ RECIPIO AI</Link>
                <button onClick={() => signOut()} style={{ color: 'rgba(255, 255, 255, 0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={20} />
                </button>
            </nav>

            <div style={contentStyle}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Personal Preferences</h1>

                <div style={cardStyle}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={labelStyle}><User size={20} /> Account details</div>
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>Email Address</div>
                            <div style={{ fontSize: '1.125rem' }}>{user?.email}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={labelStyle}><ShieldCheck size={20} /> Dietary Restrictions</div>
                        <div style={gridStyle}>
                            {dietaryOptions.map(option => (
                                <div
                                    key={option}
                                    onClick={() => toggleOption('dietary_restrictions', option)}
                                    style={optionStyle(formData.dietary_restrictions.includes(option))}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>

                        <div style={labelStyle}><AlertCircle size={20} /> Allergies & Intolerances</div>
                        <div style={gridStyle}>
                            {allergyOptions.map(option => (
                                <div
                                    key={option}
                                    onClick={() => toggleOption('allergies', option)}
                                    style={optionStyle(formData.allergies.includes(option))}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                            <button type="submit" disabled={saving} style={buttonStyle}>
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save Preferences'}
                            </button>
                            {success && <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓ Preferences saved!</span>}
                            {error && <span style={{ color: '#EF4444' }}>{error}</span>}
                        </div>
                    </form>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(249, 115, 22, 0.05)', borderRadius: '1rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                    <h3 style={{ color: '#F97316', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={18} /> How this works
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        Your preferences are used by our AI to suggest smarter ingredient substitutions.
                        When you click 'SWAP' on any recipe ingredient, we'll automatically suggest alternatives
                        that respect your dietary needs and allergies.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile
