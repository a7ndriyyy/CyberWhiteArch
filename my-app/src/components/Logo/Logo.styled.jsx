import React from "react";
import styled from "styled-components";
import { Shield } from "lucide-react"; // Optional: Use an icon library for the shield

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  background: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  position: relative;
`;

export const Hacker = styled.div`
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  position: relative;
`;

export const Hoodie = styled.div`
  width: 100px;
  height: 50px;
  background: #f0f0f0;
  border-radius: 50%;
  position: absolute;
  top: -10px;
`;

export const Computer = styled.div`
  width: 120px;
  height: 70px;
  background: #333;
  border: 2px solid #555;
  border-radius: 5px;
  margin-top: 20px;
  position: relative;
`;

export const Screen = styled.div`
  width: 100%;
  height: 50px;
  background: #1a8cff;
  border-radius: 3px;
  position: absolute;
  top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ShieldIcon = styled(Shield)`
  color: white;
  width: 20px;
  height: 20px;
`;

export const Keyboard = styled.div`
  width: 100%;
  height: 15px;
  background: #444;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 5px 5px;
`;
