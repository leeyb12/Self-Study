import { useState } from 'react';
import LinkItem from './LinkItem';

const FolderGroup = ({ folder, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="folder-group">
      <div 
        className={`folder-toggle ${!isOpen ? 'collapsed' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="folder-chevron">▾</span>
        <span className="folder-dot"></span>
        <span className="folder-name">{folder.name}</span>
      </div>
      
      <div className={`folder-body ${!isOpen ? 'collapsed' : ''}`}>
        {folder.items.map((item, index) => (
          <LinkItem 
            key={item.id || index} 
            item={item} 
            index={index} 
            onItemClick={onItemClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default FolderGroup;