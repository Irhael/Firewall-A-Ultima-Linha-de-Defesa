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

const ACOES_POR_TURNO = 4; // Define o número de ações que o jogador tem por turno

function GridServidores() {
    const [nodes, setNodes] = useState([]);
    const [idNodeSelecionado, setIdNodeSelecionado] = useState(null);
    const [rodadaAtual, setRodadaAtual] = useState(0);
    const [gameMessage, setGameMessage] = useState("Bem-vindo ao Firewall! Clique em 'Próxima Rodada'.");
    const [isModalAberto, setIsModalAberto] = useState(false);
    const [statusJogo, setStatusJogo] = useState('em_andamento');
    const [acoesRestantes, setAcoesRestantes] = useState(ACOES_POR_TURNO); // NOVO ESTADO

    // Função para avançar para a próxima rodada (agora também reseta as ações)
    const handleProximaRodada = useCallback(() => {
        if (statusJogo !== 'em_andamento') return;

        const novaRodada = rodadaAtual + 1;
        setRodadaAtual(novaRodada);
        
        const resultadoDaRodada = processarProximaRodada(nodes, novaRodada);
        setNodes(resultadoDaRodada.nodesAtualizados);
        setGameMessage(resultadoDaRodada.mensagensDaRodada.join(' | '));
        
        if (resultadoDaRodada.statusJogo !== 'em_andamento') {
            setStatusJogo(resultadoDaRodada.statusJogo);
        }

        setAcoesRestantes(ACOES_POR_TURNO); // Reseta as ações para o próximo turno
        setIdNodeSelecionado(null);
    }, [nodes, rodadaAtual, statusJogo]);

    // useEffect para avançar a rodada automaticamente quando as ações acabam
    useEffect(() => {
        if (acoesRestantes <= 0 && statusJogo === 'em_andamento') {
            setGameMessage("Sem ações restantes. Avançando para a próxima rodada...");
            // Um pequeno delay para o jogador ver o resultado da última ação
            const timeoutId = setTimeout(() => {
                handleProximaRodada();
            }, 1500);

            return () => clearTimeout(timeoutId);
        }
    }, [acoesRestantes, statusJogo, handleProximaRodada]);

    // Função para carregar/reiniciar o estado inicial do jogo
    const carregarEstadoInicial = useCallback(() => {
        setNodes(inicializarEstadoJogo());
        setRodadaAtual(0);
        setIdNodeSelecionado(null);
        setGameMessage("Jogo reiniciado. Você tem 4 ações.");
        setIsModalAberto(false);
        setStatusJogo('em_andamento');
        setAcoesRestantes(ACOES_POR_TURNO); // Reseta as ações ao reiniciar
    }, []);

    useEffect(() => {
        carregarEstadoInicial();
    }, [carregarEstadoInicial]);

    const handleNodeClick = (id) => {
        if (statusJogo !== 'em_andamento' || acoesRestantes <= 0) return;
        setIdNodeSelecionado(id);
        const nodeClicado = nodes.find(n => n.id === id);
        setGameMessage(`Servidor ${nodeClicado?.nome || id} selecionado. Escolha uma ação.`);
    };

    // Função para executar uma ação do jogador (agora decrementa as ações)
    const executarAcaoJogador = (novoStatusParaSelecionado) => {
        if (idNodeSelecionado === null || statusJogo !== 'em_andamento' || acoesRestantes <= 0) {
            setGameMessage("Não é possível executar a ação. Sem ações restantes ou jogo terminado.");
            return;
        }
        
        const { nodesAtualizados, mensagemAcao } = aplicarAcaoJogador(nodes, idNodeSelecionado, novoStatusParaSelecionado);
        setNodes(nodesAtualizados);
        setGameMessage(mensagemAcao);
        
        setAcoesRestantes(prevAcoes => prevAcoes - 1); // Decrementa o contador de ações

        // Verifica condição de vitória por limpeza após a ação
        const todosSeguros = nodesAtualizados.every(node => node.status === 'seguro');
        if (todosSeguros && rodadaAtual > 0) {
            setStatusJogo('vitoria');
            setGameMessage("AMEAÇAS NEUTRALIZADAS! Todos os sistemas estão seguros.");
        }
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
                <p>Rodada Atual: <span className={styles.infoValor}>{rodadaAtual}</span></p>
                <p>Ações Restantes: <span className={styles.infoValor}>{acoesRestantes}</span></p>
                <p className={servidoresComprometidos > 0 ? styles.alertaComprometidos : ''}>
                    Servidores Comprometidos: <span className={styles.infoValor}>{servidoresComprometidos} / {TOTAL_NOS}</span>
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
                    disabled={statusJogo !== 'em_andamento' || acoesRestantes <= 0}
                >
                    Terminar Turno
                </button>
                <button onClick={handleReiniciarClick} className={styles.botaoReset}>
                    Reiniciar Jogo
                </button>
            </div>

            {idNodeSelecionado !== null && statusJogo === 'em_andamento' && (
                <div className={styles.controlesNode}>
                    <p>Ações para {nodes.find(n => n.id === idNodeSelecionado)?.nome || ''}:</p>
                    <button onClick={() => executarAcaoJogador('seguro')} disabled={acoesRestantes <= 0}>Marcar como Seguro</button>
                    <button onClick={() => executarAcaoJogador('isolado')} disabled={acoesRestantes <= 0}>Isolar Servidor</button>
                </div>
            )}
        </>
    );
}

export default GridServidores;