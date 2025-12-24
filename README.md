# 🍳 RECIPIO AI - Smart Recipe Sharing Platform

<div align="center">

![RECIPIO AI Banner](https://img.shields.io/badge/RECIPIO-AI-orange?style=for-the-badge&logo=chef&logoColor=white)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-FF6B00?style=for-the-badge&logo=ai&logoColor=white)](https://groq.com/)

**The Future of Digital Cooking** 🚀

*A modern, AI-powered recipe sharing platform that transforms how you discover, create, and adapt recipes based on your dietary needs.*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

### 🤖 AI-Powered Intelligence
- **Smart Ingredient Substitution**: Get instant AI suggestions for ingredient replacements based on dietary restrictions and allergies
- **Recipe Generator**: Input available ingredients and let AI create complete, personalized recipes
- **Dietary Personalization**: Automatic consideration of user preferences (vegan, gluten-free, allergies, etc.)

### 👨‍🍳 Recipe Management
- **Create & Share**: Upload recipes with images, ingredients, and step-by-step instructions
- **Edit & Update**: Full CRUD operations on your recipes
- **Favorites System**: Save and organize your favorite recipes
- **Rating System**: Rate recipes from 1-5 stars
- **Search & Filter**: Find recipes by title, ingredients, category, or cuisine

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, translucent card-based interface
- **Animated Mesh Background**: Dynamic, gradient-based background with smooth animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Responsive Grid Layouts**: Beautiful recipe cards that adapt to any screen size
- **Dark Theme**: Eye-friendly dark mode with vibrant accent colors

### 🔐 User Authentication
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Customizable dietary restrictions and allergy preferences
- **Protected Routes**: Secure access to user-specific features

### 📊 Dashboard Analytics
- **Recipe Statistics**: Track your created recipes and favorites
- **Kitchen Impact Score**: Average rating across all your recipes
- **Quick Actions**: Easy access to create, generate, or manage recipes

---

## 🛠️ Tech Stack

### Backend
- **[Django 5.0](https://www.djangoproject.com/)** - Python web framework
- **[Django REST Framework](https://www.django-rest-framework.org/)** - API toolkit
- **[Django Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)** - JWT authentication
- **[Groq API](https://groq.com/)** - AI model integration (llama-3.3-70b-versatile)
- **[Pillow](https://python-pillow.org/)** - Image processing
- **SQLite** - Development database (easily switchable to PostgreSQL)

### Frontend
- **[React 19](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Lucide React](https://lucide.dev/)** - Icon library

### AI & ML
- **Groq Cloud** - Ultra-fast LLM inference
- **llama-3.3-70b-versatile** - Large language model for recipe generation and substitutions

---

## 📦 Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm or yarn**
- **Groq API Key** ([Get one here](https://console.groq.com/))

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/RecipioAI.git
cd RecipioAI
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver 8000
```

**Backend will run at**: `http://localhost:8000`

### 3️⃣ Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at**: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`
```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_django_secret_key
DEBUG=True
```

### Frontend `.env` (Optional)
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🚀 Usage

1. **Register an Account**: Create your profile at `/register`
2. **Set Dietary Preferences**: Configure restrictions and allergies in Dashboard → Preferences
3. **Explore Recipes**: Browse the home page for trending recipes
4. **Create a Recipe**: Click "+ Create Recipe" to share your culinary creations
5. **AI Recipe Generator**: Click "AI Generator" and input ingredients you have on hand
6. **Smart Substitutions**: While viewing any recipe, click the sparkle icon on ingredients for AI alternatives

---

## 📸 Screenshots

### Home Page
Beautiful landing page with animated hero section and recipe grid
![Home Page](screenshots/home.png)

### Dashboard
Personal recipe management and statistics
![Dashboard](screenshots/dashboard.png)

### AI Recipe Generator
Generate complete recipes from available ingredients
![AI Generator](screenshots/ai-generator.png)

### Recipe Detail
Detailed view with ingredients, instructions, and smart substitutions
![Recipe Detail](screenshots/recipe-detail.png)

---

## 🏗️ Project Structure

```
RECIPIO AI/
├── backend/
│   ├── core/                 # Django project settings
│   ├── recipes/              # Main app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py    # DRF serializers
│   │   ├── ai_utils.py       # AI integration
│   │   └── urls.py           # URL routing
│   ├── media/                # Uploaded recipe images
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── App.jsx           # App routing
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user

### Recipes
- `GET /api/recipes/` - List all recipes
- `POST /api/recipes/` - Create recipe
- `GET /api/recipes/{id}/` - Get recipe details
- `PUT /api/recipes/{id}/` - Update recipe
- `DELETE /api/recipes/{id}/` - Delete recipe
- `POST /api/recipes/{id}/toggle_favorite/` - Toggle favorite
- `POST /api/recipes/{id}/rate/` - Rate recipe
- `GET /api/recipes/my_favorites/` - Get user favorites

### AI Features
- `POST /api/recipes/substitute/` - Get ingredient substitutions
- `POST /api/generate-recipe/` - Generate recipe from ingredients

### Profile
- `GET /api/profiles/me/` - Get user profile
- `PUT /api/profiles/me/` - Update profile preferences

---

## 🎨 Design System

### Color Palette
- **Primary**: `#f97316` (Orange 500)
- **Background**: `#0f172a` (Slate 900)
- **Glass**: `rgba(255, 255, 255, 0.05)` with backdrop blur

### Typography
- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)
- **Weights**: 100-900

### Components
- **Glassmorphism**: `.glass` and `.glass-card` utility classes
- **Animations**: Framer Motion with spring physics
- **Icons**: Lucide React icon set

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** for lightning-fast AI inference
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Unsplash** for placeholder recipe images
- **Django & React communities** for excellent documentation

---

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/YOUR_USERNAME/RecipioAI](https://github.com/YOUR_USERNAME/RecipioAI)

---

<div align="center">

Made with ❤️ and 🍕

**Happy Cooking!** 👨‍🍳👩‍🍳

</div>
