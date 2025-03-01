import React from 'react';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Preloader from './components/Preloader';
import fileStructure from './data/fileStructure.json';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleFileSelect = (file) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  return (
    <ThemeProvider>
      <AnimatePresence>
        {isLoading ? (
          <Preloader onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div 
            className="flex flex-row h-screen bg-[#1e1e1e]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FileExplorer data={fileStructure} onFileSelect={handleFileSelect} />
            <Editor file={selectedFile} />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;