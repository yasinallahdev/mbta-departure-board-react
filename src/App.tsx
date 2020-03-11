import React from 'react';
import logo from './mbta-logo.png';
import styled from 'styled-components';
import Board from './components/Board.js';
import Clock from 'react-live-clock';

const CenteredHeader = styled.h1`
  text-align: center;
`;

const CenteredSection = styled.section`
  display: flex;
  justify-content: center;
  font-weight: bold;
`;

const YellowCenteredSection = styled.section`
  color: #ffff00;
  font-weight: bold;
  display: flex;
  justify-content: center;
`;

const BoardContainer = styled.section`
  display: flex;
  justify-content: space-around;
`;

function App() {
  return (
    <section className="App">
      <header className="App-header">
        <CenteredSection>
          <img src={logo} className="App-logo" alt="logo" />
        </CenteredSection>
        <CenteredHeader>Massachusetts Bay Transportation Authority Departure Boards</CenteredHeader>
        <CenteredSection>
          Current Time:
        </CenteredSection>
        <YellowCenteredSection>        
          <Clock format={"LTS"} ticking={true} timezone={"US/Eastern"}></Clock>
        </YellowCenteredSection>
        <BoardContainer>
          <Board station={"North Station"} />
          <Board station={"South Station"} />
        </BoardContainer>
      </header>
    </section>
  );
}

export default App;
