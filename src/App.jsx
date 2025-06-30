import React, { useState } from 'react';
import TelaInicial from './components/TelaInicial/TelaInicial';
import GridServidores from './components/GridServidores/GridServidores';

function App() {
  // Estado para controlar qual tela é exibida: 'inicial' ou 'jogo'
  const [telaAtual, setTelaAtual] = useState('inicial');

  // Função para mudar da tela inicial para a tela de jogo
  const handleIniciarJogo = () => {
    setTelaAtual('jogo');
  };

  return (
    <div className="app-container">

      {/* Renderização Condicional: Mostra a TelaInicial se o estado for 'inicial' */}
      {telaAtual === 'inicial' && (
        <TelaInicial onIniciarJogo={handleIniciarJogo} />
      )}

      {/* Mostra a Tela de Jogo se o estado for 'jogo' */}
      {telaAtual === 'jogo' && (
        <>
          <header>
            <h1 className="titulo-cabecalho">&lt;Firewall: A Última Linha de Defesa_&gt;</h1>
          </header>
          <main>
            <GridServidores />
          </main>
          <footer>

          </footer>
        </>
      )}
      
    </div>
  );
}

export default App;