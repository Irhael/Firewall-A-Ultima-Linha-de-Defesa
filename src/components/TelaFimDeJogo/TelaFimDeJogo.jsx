import React from 'react';
import styles from './TelaFimDeJogo.module.css';

function TelaFimDeJogo({ status, rodadaFinal, aoReiniciar }) {
    if (status === 'em_andamento') {
        return null; // Não renderiza nada se o jogo não terminou
    }

    const ehVitoria = status === 'vitoria';

    const titulo = ehVitoria ? ">> CONEXÃO SEGURA <<" : ">> ALERTA DE INTRUSÃO CRÍTICA <<";
    const mensagem = ehVitoria
        ? `Você sobreviveu por ${rodadaFinal} rodadas e protegeu a rede. Bom trabalho, analista!`
        : "Múltiplos servidores foram comprometidos. A rede entrou em colapso.";

    return (
        <div className={styles.overlayFimDeJogo}>
            <div className={`${styles.caixaDialogo} ${ehVitoria ? styles.vitoria : styles.derrota}`}>
                <h2 className={styles.titulo}>{titulo}</h2>
                <p className={styles.mensagem}>{mensagem}</p>
                <button onClick={aoReiniciar} className={styles.botaoReiniciar}>
                    Jogar Novamente
                </button>
            </div>
        </div>
    );
}

export default TelaFimDeJogo;