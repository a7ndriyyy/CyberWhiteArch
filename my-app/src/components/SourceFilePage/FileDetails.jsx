import React from 'react';

const fileData = {
  Certifications: [
    { name: 'CEH_Certification_Verification.pdf', date: '2023-07-22', type: 'PDF Document', size: '780 KB' },
    { name: 'GDPR_Compliance_Certificate.pdf', date: '2023-08-12', type: 'PDF Document', size: '1.5 MB' },
    { name: 'ISO_27001_Certification.pdf', date: '2023-10-15', type: 'PDF Document', size: '1.2 MB' },
    { name: 'NIST_Cybersecurity_Framework.pdf', date: '2023-04-05', type: 'PDF Document', size: '1.8 MB' },
    { name: 'OWASP_Membership_Certificate.pdf', date: '2023-05-18', type: 'PDF Document', size: '620 KB' },
    { name: 'Penetration_Testing_Certificate.pdf', date: '2023-09-28', type: 'PDF Document', size: '850 KB' },
    { name: 'SOC_2_Type_II_Report.pdf', date: '2023-06-30', type: 'PDF Document', size: '2.3 MB' }
  ],
  Biography: [],
  Education: [],
  History: []
};

const FileDetails = ({ folder }) => {
  const files = fileData[folder] || [];

  return (
    <div className="file-details">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date Modified</th>
            <th>Type</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file, idx) => (
              <tr key={idx}>
                <td>{file.name}</td>
                <td>{file.date}</td>
                <td>{file.type}</td>
                <td>{file.size}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">This folder is empty</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileDetails;
