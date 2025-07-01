

import React, { useState, useEffect, useCallback } from 'react';
import NodeServidor from '../NodeServidor/NodeServidor';
import ModalConfirmacao from '../ModalConfirmacao/ModalConfirmacao';
import TelaFimDeJogo from '../TelaFimDeJogo/TelaFimDeJogo';
import styles from './GridServidores.module.css';
import {
    TOTAL_NOS,
    inicializarEstadoJogo,
    processarProximaRodada,
    calcularServidoresComprometidos,
    aplicarAcaoJogador
} from '../LogicaJogo/motorJogo';

function GridServidores() {
    const [nodes, setNodes] = useState([]);
    const [idNodeSelecionado, setIdNodeSelecionado] = useState(null);
    const [rodadaAtual, setRodadaAtual] = useState(0);
    const [gameMessage, setGameMessage] = useState("Bem-vindo ao Firewall! Clique em 'Próxima Rodada'.");
    const [isModalAberto, setIsModalAberto] = useState(false);
    const [statusJogo, setStatusJogo] = useState('em_andamento');

    const carregarEstadoInicial = useCallback(() => {
        setNodes(inicializarEstadoJogo());
        setRodadaAtual(0);
        setIdNodeSelecionado(null);
        setGameMessage("Jogo reiniciado. Avance para a próxima rodada.");
        setIsModalAberto(false);
        setStatusJogo('em_andamento');
    }, []);

    useEffect(() => {
        carregarEstadoInicial();
    }, [carregarEstadoInicial]);

    const handleNodeClick = (id) => {
        if (statusJogo !== 'em_andamento') return;
        setIdNodeSelecionado(id);
        const nodeClicado = nodes.find(n => n.id === id);
        setGameMessage(`Servidor ${nodeClicado?.nome || id} selecionado. Escolha uma ação.`);
    };

    const executarAcaoJogador = (novoStatusParaSelecionado) => {
        if (idNodeSelecionado === null || statusJogo !== 'em_andamento') return;
        
        const { nodesAtualizados, mensagemAcao } = aplicarAcaoJogador(nodes, idNodeSelecionado, novoStatusParaSelecionado);
        setNodes(nodesAtualizados);
        setGameMessage(mensagemAcao);

        const todosSeguros = nodesAtualizados.every(node => node.status === 'seguro');
        if (todosSeguros && rodadaAtual > 0) {
            setStatusJogo('vitoria');
            setGameMessage("AMEAÇAS NEUTRALIZADAS! Todos os sistemas estão seguros.");
        }
    };

    const handleProximaRodada = () => {
        if (statusJogo !== 'em_andamento') return;

        const novaRodada = rodadaAtual + 1;
        setRodadaAtual(novaRodada);
        
        const resultadoDaRodada = processarProximaRodada(nodes, novaRodada);
        setNodes(resultadoDaRodada.nodesAtualizados);
        setGameMessage(resultadoDaRodada.mensagensDaRodada.join(' | '));
        
        if (resultadoDaRodada.statusJogo !== 'em_andamento') {
            setStatusJogo(resultadoDaRodada.statusJogo);
        }

        setIdNodeSelecionado(null);
    };
    
    const handleReiniciarClick = () => {
        setIsModalAberto(true);
    };

    const servidoresComprometidos = calcularServidoresComprometidos(nodes);

    return (
        <>
            <ModalConfirmacao
                estaAberto={isModalAberto}
                mensagem="Tem a certeza de que deseja reiniciar o jogo? Todo o progresso será perdido."
                aoConfirmar={carregarEstadoInicial}
                aoCancelar={() => setIsModalAberto(false)}
            />

            <TelaFimDeJogo 
                status={statusJogo} 
                rodadaFinal={rodadaAtual} 
                aoReiniciar={carregarEstadoInicial} 
            />

            <div className={styles.infoJogo}>
                <p>Rodada Atual: {rodadaAtual}</p>
                <p className={servidoresComprometidos > 0 ? styles.alertaComprometidos : ''}>
                    Servidores Comprometidos: {servidoresComprometidos} / {TOTAL_NOS}
                </p>
            </div>

            <div className={styles.gameMessageArea}>
                <p>{gameMessage}</p>
            </div>

            <div className={styles.containerGridServidores}>
                {nodes.map(node => (
                    <NodeServidor
                        key={node.id}
                        id={node.id}
                        nome={node.nome}
                        status={node.status}
                        estaSelecionado={node.id === idNodeSelecionado}
                        aoClicarNoNode={handleNodeClick}
                    />
                ))}
            </div>

            <div className={styles.controlesJogo}>
                <button 
                    onClick={handleProximaRodada} 
                    className={styles.botaoRodada}
                    disabled={statusJogo !== 'em_andamento'}
                >
                    Próxima Rodada
                </button>
                <button onClick={handleReiniciarClick} className={styles.botaoReset}>
                    Reiniciar Jogo
                </button>
            </div>

            {idNodeSelecionado !== null && statusJogo === 'em_andamento' && (
                <div className={styles.controlesNode}>
                    <p>Ações para {nodes.find(n => n.id === idNodeSelecionado)?.nome || ''}:</p>
                    <button onClick={() => executarAcaoJogador('seguro')}>Marcar como Seguro</button>
                    <button onClick={() => executarAcaoJogador('isolado')}>Isolar Servidor</button>
                </div>
            )}
        </>
    );
}

export default GridServidores;