import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color:rgb(0, 0, 0); /* Dark background for hacker vibe */
  color:rgb(235, 240, 241); /* Light blue text for hacker aesthetic */
`;

export const VSCodeContainer = styled.div`
  width: 80%;
  max-width: 800px;
  background-color: #1e293b; /* Dark blue background for the code editor */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.6);
`;

export const TopBar = styled.div`
 display: flex;
  align-items: center;
  padding: 8px;
  background-color: #0f172a; /* Matches the background */
  border-bottom: 2px solid #1e293b;
`;

export const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: ${(props) => props.color};
`;

export const Editor = styled.div`
 padding: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  background-color: #0d1117; /* Darker background for editor */
  color: #38bdf8; /* Light blue text */
  border-radius: 0 0 12px 12px;
  overflow-x: auto;
`;

export const Code = styled.pre`
   white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  margin-right:300px;

`;

export const RegisterButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #2563eb; /* Vibrant blue button */
  color: #f0f9ff; /* Light text for contrast */
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1d4ed8; /* Slightly darker blue on hover */
    box-shadow: 0px 4px 15px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;