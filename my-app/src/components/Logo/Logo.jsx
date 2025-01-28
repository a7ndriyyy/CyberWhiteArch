import React from "react";
import { Container,Hacker,Hoodie,Computer,Screen,ShieldIcon,Keyboard } from "./Logo.styled";


const HackerLogo = () =>{
    return (
        <Container>
      <Hacker>
        <Hoodie />
      </Hacker>
      <Computer>
        <Screen>
          <ShieldIcon />
        </Screen>
        <Keyboard />
      </Computer>
    </Container>
    ); 
}

export default HackerLogo;