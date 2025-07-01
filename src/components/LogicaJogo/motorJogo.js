export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2;
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.75;
export const RODADAS_PARA_COMPROMETER = 2;

/**
 * Inicializa o estado dos nós do servidor.
 * @returns {Array<Object>} Array com os nós no estado inicial.
 */
export function inicializarEstadoJogo() {
    const nodesIniciais = [];
    for (let i = 1; i <= TOTAL_NOS; i++) {
        nodesIniciais.push({
            id: i,
            nome: `SRV-${String(i).padStart(2, '0')}`,
            status: 'seguro',
            rodadasSobAtaque: 0,
        });
    }
    return nodesIniciais;
}
// Ficheiro: src/components/LogicaJogo/motorJogo.js

// --- Constantes de Balanceamento do Jogo ---
// Estas constantes podem ser ajustadas aqui para alterar a dificuldade do jogo.
export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2; // Máximo de novos ataques que podem surgir
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.75; // Chance de um servidor seguro ser realmente atacado
export const RODADAS_PARA_COMPROMETER = 2; // Rodadas que um servidor fica 'sobAtaque' antes de ser 'comprometido'

/**
 * Cria e retorna o estado inicial do tabuleiro do jogo.
 * @returns {Array<Object>} Um array de objetos, onde cada objeto representa um nó do servidor.
 */
export function inicializarEstadoJogo() {
    const nodesIniciais = [];
    for (let i = 1; i <= TOTAL_NOS; i++) {
        nodesIniciais.push({
            id: i,
            nome: `SRV-${String(i).padStart(2, '0')}`,
            status: 'seguro',
            rodadasSobAtaque: 0, // Contador para a evolução do ataque
        });
    }
    return nodesIniciais;
}

/**
 * Processa a lógica de uma nova rodada: evolui ataques existentes e gera novos.
 * @param {Array<Object>} nodesAtuais - O estado atual de todos os nós do servidor.
 * @param {number} rodadaAtualNumero - O número da rodada que está a começar.
 * @returns {{nodesAtualizados: Array<Object>, mensagensDaRodada: Array<string>}} Um objeto contendo o novo estado dos nós e as mensagens dos eventos da rodada.
 */
export function processarProximaRodada(nodesAtuais, rodadaAtualNumero) {
    let mensagensDaRodada = [`--- Rodada ${rodadaAtualNumero} Iniciada ---`];

    // 1. Fase de Evolução de Ameaças (RF05)
    // Verifica se os servidores que já estão 'sobAtaque' devem ser 'comprometidos'.
    const nosAposEvolucao = nodesAtuais.map(node => {
        if (node.status === 'sobAtaque') {
            const novasRodadas = node.rodadasSobAtaque + 1;
            if (novasRodadas >= RODADAS_PARA_COMPROMETER) {
                mensagensDaRodada.push(`ALERTA: ${node.nome} foi COMPROMETIDO!`);
                return { ...node, status: 'comprometido', rodadasSobAtaque: 0 };
            }
            return { ...node, rodadasSobAtaque: novasRodadas };
        }
        return node;
    });

    // 2. Fase de Novos Ataques (RF03)
    // Tenta gerar novos ataques em servidores que estão 'seguros'.
    let nosDisponiveisParaAtaque = nosAposEvolucao.filter(node => node.status === 'seguro');
    let ataquesRealizadosNestaRodada = 0;

    // Embaralha os nós disponíveis para que a seleção seja aleatória
    nosDisponiveisParaAtaque.sort(() => 0.5 - Math.random());

    const nodesAtualizados = nosAposEvolucao.map(node => {
        // Verifica se este nó é um candidato a ser atacado
        if (node.status === 'seguro' && ataquesRealizadosNestaRodada < MAX_NOVOS_ATAQUES_POR_RODADA && nosDisponiveisParaAtaque.includes(node)) {
            if (Math.random() < CHANCE_DE_ATAQUE_EM_ALVO) {
                mensagensDaRodada.push(`ATAQUE: Novo ataque detectado em ${node.nome}!`);
                ataquesRealizadosNestaRodada++;
                // Remove da lista de disponíveis para não ser atacado duas vezes na mesma rodada
                nosDisponiveisParaAtaque = nosDisponiveisParaAtaque.filter(n => n.id !== node.id);
                return { ...node, status: 'sobAtaque', rodadasSobAtaque: 1 };
            }
        }
        return node;
    });

    if (ataquesRealizadosNestaRodada === 0 && nosAposEvolucao.filter(n => n.status === 'seguro').length > 0) {
        mensagensDaRodada.push("Nenhum novo ataque direto nesta rodada.");
    }

    return { nodesAtualizados, mensagensDaRodada };
}

/**
 * Uma função auxiliar para calcular o número de servidores comprometidos.
 * @param {Array<Object>} nodes - O estado atual de todos os nós.
 * @returns {number} A quantidade de nós com o status 'comprometido'.
 */
export function calcularServidoresComprometidos(nodes) {
    return nodes.filter(node => node.status === 'comprometido').length;
}

/**
 * Aplica uma ação do jogador a um nó específico.
 * @param {Array<Object>} nodesAtuais - O estado atual de todos os nós.
 * @param {number} idNodeAlvo - O ID do nó que sofrerá a ação.
 * @param {string} novoStatusAlvo - O novo status a ser aplicado ao nó (ex: 'seguro', 'isolado').
 * @returns {{nodesAtualizados: Array<Object>, mensagemAcao: string}} Um objeto com o novo estado dos nós e uma mensagem de feedback da ação.
 */
export function aplicarAcaoJogador(nodesAtuais, idNodeAlvo, novoStatusAlvo) {
    let mensagemAcao = "";
    let nodeAlteradoNome = "";

    const nodesAtualizados = nodesAtuais.map(node => {
        if (node.id === idNodeAlvo) {
            nodeAlteradoNome = node.nome;
            // Se a ação "consertou" o servidor, reseta o contador de rodadas sob ataque
            const rodadasSobAtaqueResetado = (node.status === 'sobAtaque' && (novoStatusAlvo === 'seguro' || novoStatusAlvo === 'isolado'))
                ? 0
                : node.rodadasSobAtaque;
            return { ...node, status: novoStatusAlvo, rodadasSobAtaque: rodadasSobAtaqueResetado };
        }
        return node;
    });

    if (nodeAlteradoNome) {
        mensagemAcao = `AÇÃO: ${nodeAlteradoNome} agora está ${novoStatusAlvo.toUpperCase()}.`;
    } else {
        mensagemAcao = `AÇÃO: Nó com ID ${idNodeAlvo} não encontrado.`;
    }

    return { nodesAtualizados, mensagemAcao };
}
