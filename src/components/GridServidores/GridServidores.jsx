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
    aplicarAcaoJogador,
    isDDoSAnalisadoAtivo
} from '../LogicaJogo/motorJogo';

const ACOES_POR_TURNO_BASE = 4;

function GridServidores() {
    const [nodes, setNodes] = useState([]);
    const [idNodeSelecionado, setIdNodeSelecionado] = useState(null);
    const [rodadaAtual, setRodadaAtual] = useState(0);
    const [gameMessage, setGameMessage] = useState("Bem-vindo ao Firewall! Clique em 'Próxima Rodada'.");
    const [isModalAberto, setIsModalAberto] = useState(false);
    const [statusJogo, setStatusJogo] = useState('em_andamento');
    const [acoesRestantes, setAcoesRestantes] = useState(ACOES_POR_TURNO_BASE);

    const ddosAtivo = isDDoSAnalisadoAtivo(nodes);
    const acoesPorTurno = ACOES_POR_TURNO_BASE - (ddosAtivo ? 1 : 0);

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

        const ddosEstaAtivo = isDDoSAnalisadoAtivo(resultadoDaRodada.nodesAtualizados);
        setAcoesRestantes(ACOES_POR_TURNO_BASE - (ddosEstaAtivo ? 1 : 0));
        setIdNodeSelecionado(null);
    }, [nodes, rodadaAtual, statusJogo]);

    useEffect(() => {
        if (acoesRestantes <= 0 && statusJogo === 'em_andamento') {
            setGameMessage("Sem ações restantes. Avançando para a próxima rodada...");
            const timeoutId = setTimeout(() => handleProximaRodada(), 1500);
            return () => clearTimeout(timeoutId);
        }
    }, [acoesRestantes, statusJogo, handleProximaRodada]);

    const carregarEstadoInicial = useCallback(() => {
        setNodes(inicializarEstadoJogo());
        setRodadaAtual(0);
        setIdNodeSelecionado(null);
        setGameMessage("Jogo reiniciado. Você tem 4 ações.");
        setIsModalAberto(false);
        setStatusJogo('em_andamento');
        setAcoesRestantes(ACOES_POR_TURNO_BASE);
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

    const executarAcaoJogador = (tipoDeAcao) => {
        if (idNodeSelecionado === null || statusJogo !== 'em_andamento' || acoesRestantes <= 0) return;
        
        const resultadoAcao = aplicarAcaoJogador(nodes, idNodeSelecionado, tipoDeAcao);
        setGameMessage(resultadoAcao.mensagemAcao);

        if (resultadoAcao.nodesAtualizados !== null) {
            setNodes(resultadoAcao.nodesAtualizados);
            setAcoesRestantes(prevAcoes => prevAcoes - 1);

            if (rodadaAtual > 0 && resultadoAcao.nodesAtualizados.every(node => node.status === 'seguro' || node.status === 'isolado')) {
                setStatusJogo('vitoria');
            }
        }
    };
    
    const handleReiniciarClick = () => setIsModalAberto(true);

    const servidoresComprometidos = calcularServidoresComprometidos(nodes);
    const nodeSelecionado = nodes.find(n => n.id === idNodeSelecionado);

    const renderAcoesDisponiveis = () => {
        if (!nodeSelecionado || acoesRestantes <= 0) return null;

        if (nodeSelecionado.status === 'sobAtaque') {
            if (!nodeSelecionado.ameacaAnalisada) {
                return <button onClick={() => executarAcaoJogador('analisar')}>Analisar Ameaça</button>;
            } else {
                switch (nodeSelecionado.tipoAtaque) {
                    case 'virus':
                        return <button onClick={() => executarAcaoJogador('instalarFirewall')}>Instalar Firewall (Vírus)</button>;
                    case 'ddos':
                        return <button onClick={() => executarAcaoJogador('isolarServidor')}>Isolar Servidor (DDoS)</button>;
                    case 'ransomware':
                        return <button onClick={() => executarAcaoJogador('neutralizarRansomware')}>Neutralizar Ransomware</button>;
                    default:
                        return null;
                }
            }
        }
        return null;
    };

    return (
        <>
            <ModalConfirmacao estaAberto={isModalAberto} mensagem="Tem a certeza de que deseja reiniciar o jogo?" aoConfirmar={carregarEstadoInicial} aoCancelar={() => setIsModalAberto(false)} />
            <TelaFimDeJogo status={statusJogo} rodadaFinal={rodadaAtual} aoReiniciar={carregarEstadoInicial} />

            <div className={styles.infoJogo}>
                <p>Rodada: <span className={styles.infoValor}>{rodadaAtual}</span></p>
                <p>Ações: <span className={styles.infoValor}>{acoesRestantes}</span> / {acoesPorTurno}</p>
                <p className={servidoresComprometidos > 0 ? styles.alertaComprometidos : ''}>
                    Comprometidos: <span className={styles.infoValor}>{servidoresComprometidos} / {TOTAL_NOS}</span>
                </p>
            </div>

            {ddosAtivo && <div className={styles.globalAlert}>ALERTA GLOBAL: Ataque DDoS ativo está a reduzir o seu número de ações por turno!</div>}
            <div className={styles.gameMessageArea}><p>{gameMessage}</p></div>

            <div className={styles.containerGridServidores}>
                {nodes.map(node => <NodeServidor key={node.id} {...node} estaSelecionado={node.id === idNodeSelecionado} aoClicarNoNode={handleNodeClick} />)}
            </div>

            <div className={styles.controlesJogo}>
                <button onClick={handleProximaRodada} className={styles.botaoRodada} disabled={statusJogo !== 'em_andamento' || acoesRestantes <= 0}>Terminar Turno</button>
                <button onClick={handleReiniciarClick} className={styles.botaoReset}>Reiniciar Jogo</button>
            </div>

            {idNodeSelecionado !== null && statusJogo === 'em_andamento' && (
                <div className={styles.controlesNode}>
                    <p>Ações para {nodeSelecionado?.nome || ''}:</p>
                    {renderAcoesDisponiveis()}
                </div>
            )}
        </>
    );
}

export default GridServidores;