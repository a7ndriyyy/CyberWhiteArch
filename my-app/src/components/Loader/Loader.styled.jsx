import styled from 'styled-components';
import keyframes from 'styled-components';


export const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  color:  #21a1f1;
  font-family: 'Courier New', Courier, monospace;
`;

 export const RandomText = styled.div`
  font-size: 1.5rem;
  letter-spacing: 0.15em;
  animation: ${flicker} 1s infinite;
`;

export const Message = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 20px;
`;

export const AccessGranted = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #00ff00;
  margin-top: 20px;
`;
