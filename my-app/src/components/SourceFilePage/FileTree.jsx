import React from 'react';

const FileTree = ({ onSelect }) => {
  return (
    <div className="file-tree">
      <ul>
        <li onClick={() => onSelect('Certifications')}>📁 Certifications
        </li>
        <li onClick={() => onSelect('Biography')}>📄 Biography.md</li>
        <li onClick={() => onSelect('Education')}>📄 Education.md</li>
        <li onClick={() => onSelect('History')}>📄 History.md</li>
      </ul>
    </div>
  );
};

export default FileTree;
