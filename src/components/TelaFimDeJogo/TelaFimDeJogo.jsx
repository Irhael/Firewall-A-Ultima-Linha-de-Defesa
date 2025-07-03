import React, { useEffect } from 'react'; // 1. Adicione a importação do useEffect
import styles from './TelaFimDeJogo.module.css';

function TelaFimDeJogo({ status, rodadaFinal, aoReiniciar }) {
    // 2. Adicione este bloco de código para lidar com o efeito sonoro
    useEffect(() => {
        // Verifica se o jogo terminou e se a biblioteca Tone.js está disponível
        if (status !== 'em_andamento' && window.Tone) {
            // Garante que o contexto de áudio seja iniciado (necessário em alguns navegadores)
            window.Tone.start();
            
            if (status === 'vitoria') {
                // Toca uma nota ascendente para indicar sucesso
                const synth = new window.Tone.Synth().toDestination();
                synth.triggerAttackRelease("C5", "8n", window.Tone.now());
                synth.triggerAttackRelease("G5", "8n", window.Tone.now() + 0.2);
            } else if (status === 'derrota') {
                // Toca uma nota grave e longa para indicar falha
                const synth = new window.Tone.FMSynth().toDestination();
                synth.triggerAttackRelease("C3", "2n");
            }
        }
    }, [status]); // O efeito é acionado sempre que a prop 'status' mudar

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
