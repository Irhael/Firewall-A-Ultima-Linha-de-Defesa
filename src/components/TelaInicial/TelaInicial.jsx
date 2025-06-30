

import React, { useEffect, useRef } from 'react';
import styles from './TelaInicial.module.css'; 


function TelaInicial({ onIniciarJogo }) {
    
    const linha2Ref = useRef(null);
    const linha3Ref = useRef(null);
    const botaoRef = useRef(null);

    
    useEffect(() => {
        const timeouts = []; 

        
        timeouts.push(setTimeout(() => {
            if (linha2Ref.current) {
                linha2Ref.current.style.visibility = 'visible';
                linha2Ref.current.style.animation = `typing 2s steps(40, end) forwards, blink-caret .75s step-end infinite`;
            }
        }, 2000));

        
        timeouts.push(setTimeout(() => {
            if (linha3Ref.current) {
                linha3Ref.current.style.visibility = 'visible';
                linha3Ref.current.style.animation = `typing 2s steps(40, end) forwards, blink-caret .75s step-end infinite`;
            }
        }, 4000));


        timeouts.push(setTimeout(() => {
            if (linha3Ref.current) {
                linha3Ref.current.style.borderRight = 'none';
            }
        }, 6000));

       
        timeouts.push(setTimeout(() => {
            if (botaoRef.current) {
                botaoRef.current.style.opacity = 1;
            }
        }, 6500));
        

        return () => {
            timeouts.forEach(clearTimeout);
        };

    }, []); // O array vazio [] garante que o useEffect seja executado apenas uma vez

    return (
        <div className={styles.containerInicial}>
            <h1 className={styles.tituloJogo}>&lt;FIREWALL_&gt;</h1>
            <p className={styles.subtituloJogo}>A Última Linha de Defesa</p>

            <div className={styles.terminalLogin}>
                <p className={`${styles.linhaTerminal} ${styles.l1}`}>&gt; Iniciando sistema...</p>
                <p ref={linha2Ref} className={`${styles.linhaTerminal} ${styles.l2}`}>&gt; Verificando protocolos de segurança...</p>
                <p ref={linha3Ref} className={`${styles.linhaTerminal} ${styles.l3}`}>&gt; Conexão estabelecida.</p>
            </div>

            <button ref={botaoRef} className={styles.botaoIniciar} onClick={onIniciarJogo}>
                INICIAR JOGO
            </button>
        </div>
    );
}

export default TelaInicial;
