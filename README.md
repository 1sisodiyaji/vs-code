# VS Code Web Clone

A beautiful, responsive web-based code viewer built with React that mimics VS Code's interface. Perfect for sharing and viewing code snippets, files, or entire projects on the web.

![VS Code Web Clone Screenshot](screenshot.png)

## ✨ Features

- 🎨 VS Code-like interface with syntax highlighting
- 🌗 Light/Dark/Dracula theme support
- 📁 File explorer with directory structure
- ⚡ Fast and responsive
- 📱 Mobile-friendly
- 🔍 Large file handling with loading states
- 📋 Copy code functionality
- 🎭 Beautiful animations

## 🚀 Ways to Use This Project

### 1. Use as a Code Viewer for Your Project

```bash
# Clone this repository
git clone https://github.com/1sisodiyaji/vs-code-web.git

# Go to the project directory
cd vs-code-web

# Install dependencies
npm install

# Copy your project files into a directory (e.g., 'my-code')
cp -r /path/to/your/code my-code/

# Update the file structure
npm run update-files -- my-code

# Start the server
npm run dev
```

Now you can view and share your code through a beautiful VS Code-like interface!

### 2. Use as a Code Sharing Platform

1. Fork this repository
2. Enable GitHub Pages in your fork's settings
3. Update the file structure with your code:
   ```bash
   npm run update-files -- your-code-directory
   ```
4. Push to GitHub
5. Share the GitHub Pages URL with others

### 3. Embed in Your Website

```html
<!-- Add this iframe to your website -->
<iframe 
  src="https://your-username.github.io/vs-code-web" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

### 4. Use as a Component in Your React Project

1. Clone the repository
2. Copy the required components:
   - `src/components/Editor.jsx`
   - `src/components/FileExplorer.jsx`
   - `src/context/ThemeContext.jsx`

3. Install dependencies:
```bash
npm install prismjs framer-motion lucide-react @mdi/react @mdi/js
```

4. Import and use in your React app:
```jsx
import Editor from './components/Editor';
import FileExplorer from './components/FileExplorer';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="flex">
        <FileExplorer data={yourFileStructure} />
        <Editor file={selectedFile} />
      </div>
    </ThemeProvider>
  );
}
```

## 📝 Example Use Cases

### 1. Documentation Viewer
Use it to display your project's documentation with syntax highlighting:
```bash
npm run update-files -- ./docs
```

### 2. Code Portfolio
Showcase your code projects:
```bash
# Create a projects directory
mkdir projects
# Add your project files
cp -r project1 project2 project3 ./projects
# Update file structure
npm run update-files -- ./projects
```

### 3. Tutorial Platform
Create interactive coding tutorials:
```bash
# Structure your tutorials
tutorials/
  ├── lesson1/
  │   ├── start.js
  │   └── final.js
  ├── lesson2/
  │   ├── start.js
  │   └── final.js
```

## 🎨 Customization Options

### 1. Change Theme Colors
Edit `src/context/ThemeContext.jsx`:
```jsx
const themes = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    // Add your colors
  }
};
```

### 2. Add File Types
In `src/components/Editor.jsx`, import additional Prism languages:
```jsx
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
// Add more languages
```

### 3. Customize File Explorer
Modify `src/components/FileExplorer.jsx` to:
- Change icons
- Add file filters
- Customize sorting

## 🔧 Configuration

### File Size Limits
Adjust file size limits in `scripts/updateFileStructure.js`:
```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

### Supported File Types
Currently supports:
- JavaScript/JSX
- JSON
- CSS
- HTML
- And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Syntax highlighting by [Prism.js](https://prismjs.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
