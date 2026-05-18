import FolderGroup from './FolderGroup';

const CategoryColumn = ({ category, onItemClick }) => {
  return (
    <div className={`col ${category.id}-col`}>
      <div className="col-header">
        <div className="col-icon">{category.title}</div>
        <span className="col-title">{category.title}</span>
      </div>
      
      {category.folders.map((folder, index) => (
        <FolderGroup 
          key={index} 
          folder={folder} 
          onItemClick={onItemClick} 
        />
      ))}
    </div>
  );
};

export default CategoryColumn;