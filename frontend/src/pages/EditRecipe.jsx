import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, X, LogOut, ArrowLeft } from 'lucide-react'
import axios from 'axios'

import { Upload } from 'lucide-react'

const EditRecipe = () => {
    const { id } = useParams()
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prep_time: '',
        cook_time: '',
        servings: '',
        instructions: '',
        tags: [],
        category: 'Other',
        dietary_labels: [],
        image_url: '',
        image: null
    })

    const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [imagePreview, setImagePreview] = useState(null)

    const categories = ['Italian', 'Asian', 'Mexican', 'American', 'Dessert', 'Other']
    const dietaryOptions = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Paleo']
    const tagOptions = ['Quick', 'Comfort Food', 'Protein', 'Healthy', 'Spicy']

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/recipes/${id}/`)
                const data = response.data

                // Security check: only author can edit
                if (user && data.author.id !== user.id) {
                    setError('You do not have permission to edit this recipe')
                    setLoading(false)
                    return
                }

                setFormData({
                    title: data.title,
                    description: data.description,
                    prep_time: data.prep_time,
                    cook_time: data.cook_time,
                    servings: data.servings,
                    instructions: data.instructions,
                    tags: data.tags || [],
                    category: data.category || 'Other',
                    dietary_labels: data.dietary_labels || [],
                    image_url: data.image_url || '',
                    image: null
                })
                setIngredients(data.ingredients || [{ name: '', amount: '', unit: '' }])

                if (data.image) {
                    setImagePreview(`http://localhost:8000${data.image}`)
                } else if (data.image_url) {
                    setImagePreview(data.image_url)
                }

                setLoading(false)
            } catch (err) {
                setError('Failed to fetch recipe details')
                setLoading(false)
            }
        }

        if (user) {
            fetchRecipe()
        }
    }, [id, user])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, image: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('prep_time', formData.prep_time)
            data.append('cook_time', formData.cook_time)
            data.append('servings', formData.servings)
            data.append('category', formData.category)
            data.append('instructions', formData.instructions)
            data.append('tags', JSON.stringify(formData.tags))
            data.append('dietary_labels', JSON.stringify(formData.dietary_labels))
            data.append('ingredients', JSON.stringify(ingredients.filter(i => i.name.trim() !== '')))

            if (formData.image) {
                data.append('image', formData.image)
            } else if (formData.image_url) {
                data.append('image_url', formData.image_url)
            }

            await axios.put(`http://localhost:8000/api/recipes/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update recipe')
        } finally {
            setSaving(false)
        }
    }

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
    }

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients]
        updated[index][field] = value
        setIngredients(updated)
    }

    const toggleTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }))
    }

    const toggleDietary = (label) => {
        setFormData(prev => ({
            ...prev,
            dietary_labels: prev.dietary_labels.includes(label)
                ? prev.dietary_labels.filter(l => l !== label)
                : [...prev.dietary_labels, label]
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
        maxWidth: '900px',
        margin: '0 auto'
    }

    const headingStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem'
    }

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    }

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)'
    }

    const inputStyle = {
        padding: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
    }

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical'
    }

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
    }

    const ingredientRowStyle = {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr auto',
        gap: '0.5rem',
        alignItems: 'end'
    }

    const buttonStyle = {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '1rem'
    }

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    }

    const deleteButtonStyle = {
        padding: '0.75rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '0.5rem',
        color: '#FCA5A5',
        cursor: 'pointer'
    }

    const tagStyle = (isActive) => ({
        padding: '0.5rem 1rem',
        border: `1px solid ${isActive ? '#F97316' : 'rgba(255, 255, 255, 0.2)'}`,
        backgroundColor: isActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '9999px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: isActive ? '#F97316' : 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.2s'
    })

    if (loading) return <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading recipe...</div>

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>
                    🍽️ RECIPIO AI
                </Link>
                <button onClick={() => signOut()} style={deleteButtonStyle}>
                    <LogOut size={16} style={{ display: 'inline' }} /> Sign Out
                </button>
            </nav>

            <div style={contentStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Link to="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>
                <h1 style={headingStyle}>Edit Recipe</h1>

                {error && <div style={{ ...secondaryButtonStyle, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

                {!error && (
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={textareaStyle}
                                required
                            />
                        </div>

                        <div style={gridStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Prep Time (min) *</label>
                                <input
                                    type="number"
                                    value={formData.prep_time}
                                    onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Cook Time (min) *</label>
                                <input
                                    type="number"
                                    value={formData.cook_time}
                                    onChange={(e) => setFormData({ ...formData, cook_time: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Servings *</label>
                                <input
                                    type="number"
                                    value={formData.servings}
                                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={inputStyle}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Recipe Image</label>
                            <div style={{
                                border: '2px dashed rgba(255, 255, 255, 0.2)',
                                borderRadius: '0.5rem',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                transition: 'all 0.2s'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                                    {imagePreview ? (
                                        <div>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '300px',
                                                    borderRadius: '0.5rem',
                                                    marginBottom: '1rem'
                                                }}
                                            />
                                            <div style={{ color: '#F97316', fontSize: '0.875rem' }}>
                                                Click to change image
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload size={48} color="rgba(255, 255, 255, 0.4)" style={{ marginBottom: '1rem' }} />
                                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                                                Click to upload recipe image
                                            </div>
                                            <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.875rem' }}>
                                                PNG, JPG, GIF up to 10MB
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
                                Or use an image URL:
                            </div>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                style={inputStyle}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Ingredients *</label>
                            {ingredients.map((ing, index) => (
                                <div key={index} style={ingredientRowStyle}>
                                    <input
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                        style={inputStyle}
                                        placeholder="Ingredient name"
                                    />
                                    <input
                                        type="text"
                                        value={ing.amount}
                                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                        style={inputStyle}
                                        placeholder="Amount"
                                    />
                                    <input
                                        type="text"
                                        value={ing.unit}
                                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        style={inputStyle}
                                        placeholder="Unit"
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIngredient(index)}
                                            style={deleteButtonStyle}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={handleAddIngredient} style={secondaryButtonStyle}>
                                <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Add Ingredient
                            </button>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Instructions *</label>
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                style={{ ...textareaStyle, minHeight: '200px' }}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Tags</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {tagOptions.map(tag => (
                                    <div
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        style={tagStyle(formData.tags.includes(tag))}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Dietary Labels</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {dietaryOptions.map(diet => (
                                    <div
                                        key={diet}
                                        onClick={() => toggleDietary(diet)}
                                        style={tagStyle(formData.dietary_labels.includes(diet))}
                                    >
                                        {diet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" style={buttonStyle} disabled={saving}>
                                {saving ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                            <Link to="/dashboard" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default EditRecipe
