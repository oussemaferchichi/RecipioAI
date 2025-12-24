import { X } from 'lucide-react'

const SubstitutionModal = ({ isOpen, onClose, substitutes }) => {
    if (!isOpen) return null

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
    }

    const modalStyle = {
        backgroundColor: '#1E293B',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
    }

    const closeButtonStyle = {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '0.5rem'
    }

    const headingStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: '1rem'
    }

    const subItemStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    }

    const nameStyle = {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'white',
        marginBottom: '0.5rem'
    }

    const detailStyle = {
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '0.25rem'
    }

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={24} />
                </button>
                <h3 style={headingStyle}>🤖 AI Substitutions</h3>
                {substitutes && substitutes.alternatives && substitutes.alternatives.map((sub, idx) => (
                    <div key={idx} style={subItemStyle}>
                        <div style={nameStyle}>{sub.name}</div>
                        <div style={detailStyle}><strong>Reason:</strong> {sub.reason}</div>
                        <div style={detailStyle}><strong>Impact:</strong> {sub.texture_impact}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubstitutionModal
