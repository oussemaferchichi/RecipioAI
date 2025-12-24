import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Sparkles } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    }

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px'
    }

    const titleStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center'
    }

    const subtitleStyle = {
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '2rem',
        textAlign: 'center'
    }

    const inputGroupStyle = {
        marginBottom: '1.5rem'
    }

    const labelStyle = {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500'
    }

    const inputContainerStyle = {
        position: 'relative'
    }

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
    }

    const iconStyle = {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(255, 255, 255, 0.5)'
    }

    const buttonStyle = {
        width: '100%',
        padding: '0.875rem',
        backgroundColor: '#F97316',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        marginTop: '1rem'
    }

    const errorStyle = {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#FCA5A5',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.875rem'
    }

    const linkStyle = {
        textAlign: 'center',
        marginTop: '1.5rem',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.875rem'
    }

    const linkTextStyle = {
        color: '#F97316',
        textDecoration: 'none',
        fontWeight: '600'
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>
                    <Sparkles size={28} />
                    Welcome Back
                </h1>
                <p style={subtitleStyle}>Sign in to your RECIPIO AI account</p>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email</label>
                        <div style={inputContainerStyle}>
                            <Mail size={18} style={iconStyle} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <div style={inputContainerStyle}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={linkStyle}>
                    Don't have an account?{' '}
                    <Link to="/register" style={linkTextStyle}>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
