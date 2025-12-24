import { useState } from 'react'
import axios from 'axios'

const PreferencesModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [restrictions, setRestrictions] = useState(user?.dietary_restrictions || [])
    const [allergies, setAllergies] = useState(user?.allergies || [])
    const [newRestriction, setNewRestriction] = useState('')
    const [newAllergy, setNewAllergy] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        setLoading(true)
        try {
            const response = await axios.put('http://localhost:8000/api/profiles/me/', {
                dietary_restrictions: restrictions,
                allergies: allergies
            })
            onUpdate(response.data)
            onClose()
        } catch (error) {
            console.error('Failed to update profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const addRestriction = () => {
        if (newRestriction && !restrictions.includes(newRestriction)) {
            setRestrictions([...restrictions, newRestriction])
            setNewRestriction('')
        }
    }

    const removeRestriction = (item) => {
        setRestrictions(restrictions.filter(r => r !== item))
    }

    const addAllergy = () => {
        if (newAllergy && !allergies.includes(newAllergy)) {
            setAllergies([...allergies, newAllergy])
            setNewAllergy('')
        }
    }

    const removeAllergy = (item) => {
        setAllergies(allergies.filter(a => a !== item))
    }

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }

    const contentStyle = {
        backgroundColor: '#1E293B',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '90%',
        color: 'white',
        maxHeight: '80vh',
        overflowY: 'auto'
    }

    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        color: '#F97316',
        borderRadius: '1rem',
        fontSize: '0.875rem',
        marginRight: '0.5rem',
        marginBottom: '0.5rem'
    }

    const inputGroupStyle = {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem'
    }

    const inputStyle = {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white'
    }

    const buttonStyle = {
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        backgroundColor: '#F97316',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    }

    return (
        <div style={overlayStyle}>
            <div style={contentStyle}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Personal Preferences</h2>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Dietary Restrictions</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {restrictions.map(r => (
                            <span key={r} style={tagStyle}>
                                {r}
                                <button onClick={() => removeRestriction(r)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
                            </span>
                        ))}
                    </div>
                    <div style={inputGroupStyle}>
                        <input
                            value={newRestriction}
                            onChange={(e) => setNewRestriction(e.target.value)}
                            placeholder="e.g. Vegetarian, Gluten-Free"
                            style={inputStyle}
                        />
                        <button onClick={addRestriction} style={buttonStyle}>Add</button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Allergies</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {allergies.map(a => (
                            <span key={a} style={tagStyle}>
                                {a}
                                <button onClick={() => removeAllergy(a)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
                            </span>
                        ))}
                    </div>
                    <div style={inputGroupStyle}>
                        <input
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="e.g. Peanuts, Shellfish"
                            style={inputStyle}
                        />
                        <button onClick={addAllergy} style={buttonStyle}>Add</button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
                    <button onClick={handleSave} style={buttonStyle} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PreferencesModal
