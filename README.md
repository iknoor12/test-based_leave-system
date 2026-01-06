# Smart Leave - Advanced Test-Based Leave Management System

A modern, production-grade React application for managing student leave requests with test-based validation (MCQ + Coding challenges).

## Features

- **Role-Based Access**: Separate dashboards for Students and Administrators
- **Leave Application**: Students can apply for leave with custom reasons and dates
- **Test-Based Validation**: 
  - MCQ Test (5 questions per subject)
  - Coding Challenge (practical problem solving)
- **Timer System**: Countdown timer to prevent cheating
- **Admin Dashboard**: Monitor and approve/reject leave requests
- **Subject Selection**: Mathematics, Physics, Chemistry
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
smartleave/
├── src/
│   ├── components/
│   │   ├── common/        # Reusable components (Button, Card, Timer)
│   │   ├── layout/        # Layout components (Navbar)
│   │   └── test/          # Test components (MCQTest, CodingTest)
│   ├── pages/
│   │   ├── auth/          # Authentication pages (RoleSelect)
│   │   ├── student/       # Student pages
│   │   └── admin/         # Admin pages
│   ├── config/            # Configuration files
│   ├── data/              # Static data (questions)
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite config
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
└── README.md              # Documentation
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartleave
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will open at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Usage

### For Students
1. Select "Student" role on the login screen
2. View your leave statistics on the dashboard
3. Click "Apply for Leave" to submit a request
4. Select subject and fill in details
5. Complete the MCQ and Coding tests to validate your request
6. Track request status on the dashboard

### For Administrators
1. Select "Administrator" role on the login screen
2. View all pending leave requests
3. Review student test scores
4. Approve or reject requests based on test performance

## Features in Detail

### Question Bank
- **3 Subjects**: Mathematics, Physics, Chemistry
- **MCQ Tests**: 5 questions per subject with multiple choice answers
- **Coding Challenges**: Real-world problem-solving tasks
- Easily extensible for additional subjects

### Timer Component
- 5-minute MCQ test duration
- 10-minute Coding test duration
- Auto-submission on time up
- Visual warning at <1 minute

### Authentication
- Simple role-based access (Student/Admin)
- Logout functionality
- Session management via React state

## Component Architecture

### Common Components
- **Button**: Reusable styled button with variants
- **Card**: Info/stat display component
- **Timer**: Countdown timer with warnings

### Test Components
- **MCQTest**: MCQ question display with progress tracking
- **CodingTest**: Code editor interface with run/submit buttons

### Page Components
- **RoleSelect**: Initial role selection
- **StudentDashboard**: Leave overview and stats
- **ApplyLeave**: Leave application form
- **TestEnvironment**: Test orchestration (MCQ → Coding)
- **AdminDashboard**: Admin management panel

## Future Enhancements

- [ ] Firebase integration for data persistence
- [ ] Backend API integration
- [ ] Real code execution for coding tests
- [ ] Email notifications
- [ ] Test performance analytics
- [ ] Advanced reporting for admins
- [ ] Multi-year leave management
- [ ] Student messaging system
- [ ] Attendance tracking integration

## Development Guidelines

### Component Rules
- All components must be functional React components
- Use React Hooks for state management
- Follow separation of concerns
- No side effects outside useEffect
- Props should be validated
- Components should be reusable and composable

### Code Standards
- Use ES6+ syntax
- Consistent naming conventions
- Add comments for complex logic
- Keep components under 300 lines
- Extract reusable logic into custom hooks

## Configuration

### Environment Variables
Currently using mock data. When adding Firebase:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
```

### Tailwind CSS
Customize theme in `tailwind.config.js`:
- Colors
- Fonts
- Spacing
- Breakpoints

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not appearing
- Ensure `tailwind.config.js` has correct content paths
- Clear `dist/` folder and rebuild
- Hard refresh browser (Ctrl+Shift+R)

## License

This project is open source and available under the MIT License.

## Support

For issues and feature requests, please create an issue on the repository.

## Author

Advanced Test-Based Leave Management System - Built with React + Vite + Tailwind CSS
