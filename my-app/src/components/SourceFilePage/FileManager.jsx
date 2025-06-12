import React, { useState } from 'react';
import FileTree from './FileTree';
import FileDetails from './FileDetails';
import './FileManager.css';

const FileManager = () => {
  const [selectedFolder, setSelectedFolder] = useState('Certifications');

  return (
    <div className="file-manager">
      <div className="sidebar">
        <FileTree onSelect={setSelectedFolder} />
      </div>
      <div className="content">
        <FileDetails folder={selectedFolder} />
      </div>
    </div>
  );
};

export default FileManager;

