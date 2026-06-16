# 🛡️ Moderation Evidence Template

A professional, fully dynamic web application for documenting and organizing moderation evidence with customizable colors, multiple image windows, and comprehensive reporting features.

## Features

### 📸 Image Management
- **2-3 Dynamic Image Windows**: Start with 2 windows, add up to 3 total
- **Auto-Fit Images**: Images automatically scale to fit container while maintaining aspect ratio
- **Zoom Controls**: Zoom in/out on individual images
- **Download**: Save images locally
- **Image Viewer Modal**: Click any image to open a full viewer with rotation support

### 📋 Context Section
- Collapsible section with arrow indicator
- Rich text input for detailed incident context
- Character count tracking
- Auto-saves to local storage

### 💬 Replies Section
- Fully dynamic reply system
- Add user name and reply content
- Automatic timestamp generation
- Delete individual replies
- Animated reply entries
- Empty state messaging

### 🎨 Customization
- **Personable Colors**: Change primary, secondary, accent, and background colors
- **Real-time Updates**: See changes instantly
- **Settings Modal**: Easy-to-use color picker
- **Reset to Default**: One-click color reset
- **Persistent Colors**: Your color choices are saved

### 📊 Case Information
- Case ID field
- Reported User field
- Incident Date selector

### 📤 Export Features
- **JSON Export**: Export all data including case info, context, and replies
- **HTML Export**: Generate a beautiful standalone HTML report
- **Download Images**: Save individual evidence images

### 💾 Local Storage
- Auto-saves all data to browser storage
- Persists between sessions
- Never lose your work

## Usage

### Getting Started
1. Open `index.html` in your web browser
2. Fill in the case information at the top
3. Upload evidence images
4. Add context details
5. Record replies from users

### Managing Images
1. Click on image placeholders to upload
2. Use zoom controls to examine details
3. Click on images to open full viewer
4. Download images as needed
5. Add a 3rd window if needed (max 3)

### Adding Replies
1. Enter the user name in the "User name" field
2. Type the reply content
3. Click "Add Reply"
4. Delete replies with the delete button if needed

### Customizing Colors
1. Click the "Settings" button in the header
2. Select colors using the color pickers
3. Changes apply immediately
4. Click "Reset to Default" to restore original colors

### Exporting Evidence
1. Scroll to "Export Evidence" section
2. Click JSON to export all data as a file
3. Click HTML to generate a printable report
4. Use Clear All to reset (with confirmation)

## File Structure

```
template/
├── index.html       # Main HTML structure
├── styles.css       # All styling and animations
├── script.js        # Complete JavaScript functionality
└── README.md        # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations, CSS Variables
- **JavaScript**: ES6+, Local Storage API
- **Font Awesome 6**: Icon library

### Key Features
- Fully responsive design (mobile, tablet, desktop)
- No external dependencies (except Font Awesome icons)
- Client-side only (no backend required)
- State management with JavaScript objects
- LocalStorage for data persistence

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Color Customization

The template uses CSS custom properties for easy theming:
- `--primary-color`: Main blue color for headers and accents
- `--secondary-color`: Green color for success/secondary actions
- `--accent-color`: Red color for alerts and deletions
- `--bg-color`: Light background color

## Data Structure

### Stored State Object
```javascript
{
    images: {
        1: "data:image/png;base64,...",
        2: "data:image/png;base64,...",
        3: "data:image/png;base64,..."
    },
    replies: [
        {
            id: 1686234567890,
            user: "User Name",
            content: "Reply content here",
            timestamp: "6/16/2025, 2:30:45 PM"
        }
    ],
    context: "Context text...",
    caseId: "CASE-001",
    reportedUser: "username",
    incidentDate: "2025-06-16",
    windowCount: 2,
    zoomLevels: { 1: 1, 2: 1, 3: 1 },
    colors: {
        primary: "#3498db",
        secondary: "#2ecc71",
        accent: "#e74c3c",
        bg: "#ecf0f1"
    }
}
```

## Keyboard Shortcuts & Tips

- **Collapsible Sections**: Click on section headers to expand/collapse
- **Image Placeholders**: Click anywhere on the placeholder to upload
- **Replies**: Delete button appears on hover
- **Modal**: Press Escape or click outside to close (works with image viewer)

## Features Highlights

✨ **Dynamic Design**
- Real-time color personalization
- Smooth animations and transitions
- Collapsible sections with arrow indicators
- Responsive grid layout

🎯 **User-Friendly**
- Intuitive interface
- Clear visual hierarchy
- Helpful placeholder text
- Character count feedback

📱 **Responsive**
- Mobile-first design
- Adapts to all screen sizes
- Touch-friendly buttons
- Optimized layouts

🔒 **Data Management**
- Local storage saves
- Export functionality
- No data sent to servers
- Complete user control

## Notes

- Images are stored as base64 in local storage (works best with smaller images)
- Maximum 3 image windows for optimal layout
- Minimum 2 image windows to maintain structure
- Export features work in all modern browsers
- Clear All action cannot be undone

## Future Enhancement Ideas

- Drag-and-drop image upload
- Image annotation tools
- PDF export
- Cloud backup
- Multiple templates
- Team collaboration features
- Advanced search/filter

## License

Free to use and modify for personal and commercial purposes.

---

**Made with ❤️ for moderation teams**