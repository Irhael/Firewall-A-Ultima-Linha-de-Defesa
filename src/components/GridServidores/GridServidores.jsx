import React, { useState, useEffect, useCallback } from 'react';
import NodeServidor from '../NodeServidor/NodeServidor';
import ModalConfirmacao from '../ModalConfirmacao/ModalConfirmacao'; // Importa o novo modal
import styles from './GridServidores.module.css';
import { // Importa as funções e constantes da lógica do jogo
    TOTAL_NOS,
    inicializarEstadoJogo,
    processarProximaRodada,
    calcularServidoresComprometidos,
    aplicarAcaoJogador
} from '../LogicaJogo/motorJogo'; // Assumindo que este ficheiro existe

function GridServidores() {
    // Estados do componente: para os nós, seleção, rodada, mensagens e o modal
    const [nodes, setNodes] = useState([]);
    const [idNodeSelecionado, setIdNodeSelecionado] = useState(null);
    const [rodadaAtual, setRodadaAtual] = useState(0);
    const [gameMessage, setGameMessage] = useState("Bem-vindo ao Firewall! Clique em 'Próxima Rodada'.");
    const [isModalAberto, setIsModalAberto] = useState(false);

    // Função para carregar o estado inicial do jogo, agora usando a lógica externa
    const carregarEstadoInicial = useCallback(() => {
        setNodes(inicializarEstadoJogo());
        setRodadaAtual(0);
        setIdNodeSelecionado(null);
        setGameMessage("O estado do jogo foi reiniciado. Avance para a próxima rodada.");
        setIsModalAberto(false); // Garante que o modal feche após a confirmação
    }, []);

    // useEffect para carregar o estado inicial quando o componente é montado
    useEffect(() => {
        carregarEstadoInicial();
    }, [carregarEstadoInicial]);

    // Função para lidar com o clique em um nó do servidor
    const handleNodeClick = (id) => {
        setIdNodeSelecionado(id);
        const nodeClicado = nodes.find(n => n.id === id);
        setGameMessage(`Servidor ${nodeClicado?.nome || id} selecionado. Escolha uma ação.`);
    };

    // Função para executar uma ação do jogador no nó selecionado
    const executarAcaoJogador = (novoStatusParaSelecionado) => {
        if (idNodeSelecionado === null) {
            setGameMessage('AÇÃO: Por favor, selecione um servidor primeiro.');
            return;
        }
        // Chama a lógica externa para aplicar a ação
        const { nodesAtualizados, mensagemAcao } = aplicarAcaoJogador(nodes, idNodeSelecionado, novoStatusParaSelecionado);
        setNodes(nodesAtualizados);
        setGameMessage(mensagemAcao);
    };

    // Função para avançar para a próxima rodada
    const handleProximaRodada = () => {
        const novaRodada = rodadaAtual + 1;
        setRodadaAtual(novaRodada);
        
        // Chama a lógica externa para processar a rodada
        const { nodesAtualizados, mensagensDaRodada } = processarProximaRodada(nodes, novaRodada);
        setNodes(nodesAtualizados);

        if (mensagensDaRodada.length === 1 && mensagensDaRodada[0].startsWith("--- Rodada")) {
             mensagensDaRodada.push("Nenhuma atividade significativa de ataque ou comprometimento nesta rodada.");
        }
        setGameMessage(mensagensDaRodada.join(' | '));
        setIdNodeSelecionado(null);
    };
    
    // Função para abrir o modal de confirmação antes de reiniciar
    const handleReiniciarClick = () => {
        setIsModalAberto(true);
    };

    // Calcula o número de servidores comprometidos usando a lógica externa
    const servidoresComprometidos = calcularServidoresComprometidos(nodes);

    return (
        <>
            {/* O Modal de Confirmação é renderizado aqui, mas só aparece se isModalAberto for true */}
            <ModalConfirmacao
                estaAberto={isModalAberto}
                mensagem="Tem a certeza de que deseja reiniciar o jogo? Todo o progresso será perdido."
                aoConfirmar={carregarEstadoInicial}
                aoCancelar={() => setIsModalAberto(false)}
            />

            {/* Painel de informações do jogo */}
            <div className={styles.infoJogo}>
                <p>Rodada Atual: {rodadaAtual}</p>
                <p className={servidoresComprometidos > 0 ? styles.alertaComprometidos : ''}>
                    Servidores Comprometidos: {servidoresComprometidos} / {TOTAL_NOS}
                </p>
            </div>

            {/* Área de mensagens de eventos do jogo */}
            <div className={styles.gameMessageArea}>
                <p>{gameMessage}</p>
            </div>

            {/* O grid de servidores */}
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

            {/* Controles principais do jogo */}
            <div className={styles.controlesJogo}>
                <button onClick={handleProximaRodada} className={styles.botaoRodada}>
                    Próxima Rodada / Gerar Ataques
                </button>
                <button onClick={handleReiniciarClick} className={styles.botaoReset}>
                    Reiniciar Jogo
                </button>
            </div>

            {/* Controles de ações do jogador (só aparecem quando um nó está selecionado) */}
            {idNodeSelecionado !== null && (
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
