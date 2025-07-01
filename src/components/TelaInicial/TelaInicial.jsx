
import React, { useEffect, useRef } from 'react';
import styles from './TelaInicial.module.css';

function TelaInicial({ onIniciarJogo }) {
    
    const linha3Ref = useRef(null);

    useEffect(() => {
        
        const timeoutId = setTimeout(() => {
            if (linha3Ref.current) {
                linha3Ref.current.style.borderRight = 'none';
            }
        }, 6000); 

        
        return () => clearTimeout(timeoutId);
    }, []); // O array vazio [] garante que o useEffect seja executado apenas uma vez

    return (
        <div className={styles.containerInicial}>
            <h1 className={styles.tituloJogo}>&lt;FIREWALL_&gt;</h1>
            <p className={styles.subtituloJogo}>A Última Linha de Defesa</p>

            <div className={styles.terminalLogin}>
                <p className={`${styles.linhaTerminal} ${styles.l1}`}>&gt; Iniciando sistema...</p>
                <p className={`${styles.linhaTerminal} ${styles.l2}`}>&gt; Verificando protocolos de segurança...</p>
                {}
                <p ref={linha3Ref} className={`${styles.linhaTerminal} ${styles.l3}`}>&gt; Conexão estabelecida.</p>
            </div>

            <button className={styles.botaoIniciar} onClick={onIniciarJogo}>
                INICIAR JOGO
            </button>
        </div>
    );
}

export default TelaInicial;
