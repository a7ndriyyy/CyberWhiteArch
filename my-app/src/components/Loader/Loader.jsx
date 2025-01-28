import React, { useEffect, useState } from "react";
import { Container,RandomText,Message,AccessGranted } from "./Loader.styled";

const messages = [
  "Establishing connection...",
  "Bypassing firewall...",
  "Accessing database...",
  "Decrypting data...",
  "Loading sensitive information...",
  "Upload complete."
];

const randomCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

const HackingLoader = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [randomText, setRandomText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomText(generateRandomString(20));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messageIndex < messages.length) {
      const timeout = setTimeout(() => {
        setCurrentMessage(messages[messageIndex]);
        setMessageIndex(messageIndex + 1);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [messageIndex]);

  const generateRandomString = (length) => {
    return Array.from({ length }, () =>
      randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length))
    ).join("");
  };

  return (
    <Container>
      <RandomText>{randomText}</RandomText>
      <Message>{currentMessage}</Message>
      {messageIndex >= messages.length && <AccessGranted>Access Granted</AccessGranted>}
    </Container>
  );
};

export default HackingLoader;