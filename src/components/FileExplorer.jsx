import React from 'react';
import { mdiFolder, mdiFileDocument, mdiChevronRight, mdiChevronDown, mdiFolderOpen } from '@mdi/js';
import Icon from '@mdi/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FileExplorer = ({ data, onFileSelect }) => {
  const { theme, themeColors, toggleTheme } = useTheme();
  const [expandedItems, setExpandedItems] = React.useState(new Set(['vs-code', 'src', 'components']));

  const toggleExpand = (path) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderItem = (item, path = '', depth = 0) => {
    const fullPath = `${path}/${item.name}`;
    const isExpanded = expandedItems.has(fullPath);

    if (item.type === 'file') {
      return (
        <motion.div
          key={fullPath}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="group"
        >
          <div 
            className="flex items-center h-6 hover:bg-[#2a2d2e] cursor-pointer text-[13px]"
            style={{ 
              paddingLeft: `${depth * 8 + 4}px`,
              color: themeColors.text,
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: themeColors.hover }
            }}
            onClick={() => onFileSelect(item)}
          >
            <Icon path={mdiFileDocument} size={0.6} style={{ color: themeColors.accent }} />
            <span className="ml-1">{item.name}</span>
          </div>
        </motion.div>
      );
    }

    return (
      <div key={fullPath}>
        <div 
          className="flex items-center h-6 cursor-pointer text-[13px]"
          style={{ 
            paddingLeft: `${depth * 8 + 4}px`,
            color: themeColors.text,
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: themeColors.hover }
          }}
          onClick={() => toggleExpand(fullPath)}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            <Icon 
              path={isExpanded ? mdiChevronDown : mdiChevronRight} 
              size={0.6}
              style={{ color: themeColors.text }}
            />
          </motion.div>
          <Icon 
            path={isExpanded ? mdiFolderOpen : mdiFolder} 
            size={0.6} 
            style={{ color: themeColors.folderIcon }}
          />
          <span className="ml-1">{item.name}</span>
        </div>
        <AnimatePresence>
          {isExpanded && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.children.map(child => renderItem(child, fullPath, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div 
      className="md:w-2/12 h-full overflow-y-auto flex flex-col justify-between"
      style={{ 
        backgroundColor: themeColors.sidebar,
        borderRight: `1px solid ${themeColors.border}`
      }}
    >
      <div className="">
      <div className="p-2 flex justify-between items-center">
        <span className="text-[11px] uppercase tracking-wide" style={{ color: themeColors.text }}>
          Explorer
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-1 rounded hover:bg-opacity-20"
        >
          {theme === 'dark' && <Moon size={16} style={{ color: themeColors.text }} />}
          {theme === 'light' && <Sun size={16} style={{ color: themeColors.text }} />}
          {theme === 'dracula' && <Palette size={16} style={{ color: themeColors.text }} />}
        </motion.button>
      </div>
      {renderItem(data)}
      </div>

      <div className="flex justify-center items-center">
        <span className="text-[11px] uppercase tracking-wide" style={{ color: themeColors.text }}>
          Made BY CraftFossLabs
        </span>
      </div>
    </div>
  );
};

export default FileExplorer;
