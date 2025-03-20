import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Editor = ({ file }) => {
  const { themeColors } = useTheme();
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [content, setContent] = React.useState('');
  const codeRef = React.useRef(null);

  React.useEffect(() => {
    if (file?.content) {
      setIsLoading(true);
      // Simulate loading for large files
      setTimeout(() => {
        setContent(file.content);
        setIsLoading(false);
        // Use requestAnimationFrame to ensure DOM is updated before highlighting
        requestAnimationFrame(() => {
          if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
          }
        });
      }, file.content.length > 100000 ? 500 : 0);
    } else {
      setContent('');
      setIsLoading(false);
    }
  }, [file]);

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabs = () => {
    if (!file) return null;
    return (
      <div
        className="h-9 flex items-center justify-between border-b"
        style={{
          backgroundColor: themeColors.sidebar,
          borderColor: themeColors.border
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center h-full px-3 text-[13px]"
          style={{
            backgroundColor: themeColors.bg,
            color: themeColors.text
          }}
        >
          {file.name}
          {file.content.length > 100000 && (
            <span className="ml-2 text-xs text-yellow-500">
              (Large file - {Math.round(file.content.length / 1000)}KB)
            </span>
          )}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="flex items-center h-full px-3 mr-2 cursor-pointer rounded"
          style={{ color: themeColors.accent }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check size={16} />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    );
  };

  if (!file) {
    return (
      <div
        className="flex-1 flex items-center justify-center text-[13px]"
        style={{
          backgroundColor: themeColors.bg,
          color: themeColors.text
        }}
      >
        Select a file to view its contents
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ backgroundColor: themeColors.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderTabs()}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin" size={24} style={{ color: themeColors.accent }} />
            </div>
          ) : (
            <pre className="!bg-transparent !m-0 !p-0">
              <code
                ref={codeRef}
                className={`language-${file.language}`}
                style={{
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                {content}
              </code>
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Editor;
