// src/App.jsx
import React from 'react';
import GridServidores from './components/GridServidores/GridServidores'; 


function App() {
  return (
    <div className="app-container"> 
      <header>
        <h1 className="titulo-cabecalho">&lt;Firewall: A Última Linha de Defesa_&gt;</h1> 
      </header>
      <main>
        <GridServidores />
      </main>
      <footer>
      </footer>
    </div>
  );
}

export default App;