# MetaBox-Budget



## Features

### 🎬 Budget Management
- **Category-based budgeting** with industry-standard categories (Above the Line, Production, Post-Production, etc.)
- **Subcategory organization** for detailed expense tracking
- **Real-time variance calculation** between budgeted and actual amounts
- **Notes and date tracking** for each budget item

### 📊 Dashboard & Analytics
- **Overview statistics** with key metrics
- **Interactive charts** using Recharts
- **Budget breakdown** by category with pie charts
- **Variance analysis** with bar charts
- **Recent activity** tracking

### 📅 Production Scheduling
- **Timeline management** for production events
- **Crew assignment** tracking
- **Location and time** scheduling
- **Status tracking** (planned, in-progress, completed)

### 📈 Reports & Analytics
- **Comprehensive reporting** with detailed breakdowns
- **Monthly spending analysis**
- **Top variances** identification
- **Budget recommendations** based on current status
- **Export capabilities** (PDF, Excel)

### ⚙️ Settings & Configuration
- **Project information** management
- **Currency selection** (USD, EUR, GBP, CAD, AUD)
- **Notification settings**
- **Auto-save preferences**
- **Data export options**

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation
- **Build Tool**: Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-magic-budgeting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Sidebar.tsx     # Navigation sidebar
├── contexts/           # React contexts
│   └── BudgetContext.tsx # Global budget state management
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Budget.tsx      # Budget management
│   ├── Schedule.tsx    # Production scheduling
│   ├── Reports.tsx     # Analytics and reporting
│   └── Settings.tsx    # Application settings
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Features Explained

### Budget Categories
The application uses industry-standard movie budgeting categories:

- **Above the Line**: Director, Producer, Writer, Cast, Crew
- **Production**: Equipment, Location, Props, Costumes, Transportation
- **Post-Production**: Editing, Visual Effects, Sound, Music, Color Grading
- **Other**: Insurance, Legal, Marketing, Distribution
- **Contingency**: Emergency Fund, Overages

### State Management
Uses React Context with useReducer for global state management:
- Budget items with full CRUD operations
- Category and subcategory management
- Real-time calculations and updates

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive sidebar navigation
- Adaptive charts and tables
- Touch-friendly interface

## Customization

### Adding New Categories
Edit the `initialState` in `src/contexts/BudgetContext.tsx`:

```typescript
categories: [
  'Above the Line',
  'Production', 
  'Post-Production',
  'Other',
  'Contingency',
  'Your New Category' // Add here
],
subcategories: {
  // ... existing categories
  'Your New Category': ['Subcategory 1', 'Subcategory 2']
}
```

### Styling Customization
Modify `src/index.css` and `tailwind.config.js` for custom styling:

```css
@layer components {
  .your-custom-class {
    @apply your-tailwind-classes;
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Movie Magic Budgeting software
- Built with modern React best practices
- Uses industry-standard movie production categories
- Designed for professional film production workflows 
