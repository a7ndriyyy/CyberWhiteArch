import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #282c34;
  color: #fff;
`;

export const LeftSection = styled.div`
  flex: 1;
`;

export const Nav = styled.nav`
  display: flex;
  flex: 2;
  justify-content: center;
  gap: 20px;
`;

export const RightSection = styled.div`
  flex: 1;
  text-align: right;
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: #61dafb;
  font-size: 16px;

  &:hover {
    color: #21a1f1;
  }
`;

export const Logo = styled.img`
  height: 40px;
`;

export const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover div {
    display: block;
  }
`;

export const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;

  a {
    color: #000;
    text-decoration: none;
    display: block;
    padding: 10px;

    &:hover {
      background-color: #ddd;
    }
  }
`;