// --- Constantes de Balanceamento do Jogo ---
export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2;
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.75;
export const RODADAS_PARA_COMPROMETER = 2;
export const RODADAS_PARA_VITORIA = 15;
export const MAX_SERVIDORES_COMPROMETIDOS = 4;

/**
 * Cria e retorna o estado inicial do tabuleiro do jogo.
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

/**
 * Processa a lógica de uma nova rodada (REFATORADO E CORRIGIDO).
 * @param {Array<Object>} nodesAtuais - O estado atual de todos os nós.
 * @param {number} rodadaAtualNumero - O número da rodada que está a começar.
 * @returns {{nodesAtualizados: Array<Object>, mensagensDaRodada: Array<string>, statusJogo: string}} Objeto com o novo estado, mensagens e o status do jogo.
 */
export function processarProximaRodada(nodesAtuais, rodadaAtualNumero) {
    let mensagensDaRodada = [`--- Rodada ${rodadaAtualNumero} Iniciada ---`];
    let statusJogo = 'em_andamento';

    // Usamos uma cópia para trabalhar, evitando mutações inesperadas.
    let nosIntermediarios = JSON.parse(JSON.stringify(nodesAtuais));

    // 1. Fase de Evolução de Ameaças (RF05)
    nosIntermediarios.forEach(node => {
        if (node.status === 'sobAtaque') {
            node.rodadasSobAtaque += 1;
            if (node.rodadasSobAtaque >= RODADAS_PARA_COMPROMETER) {
                mensagensDaRodada.push(`ALERTA: ${node.nome} foi COMPROMETIDO!`);
                node.status = 'comprometido';
                node.rodadasSobAtaque = 0;
            }
        }
    });

    // 2. Fase de Novos Ataques (RF03)
    let nosDisponiveisParaAtaque = nosIntermediarios.filter(node => node.status === 'seguro');
    nosDisponiveisParaAtaque.sort(() => 0.5 - Math.random()); // Embaralha para aleatoriedade

    let ataquesRealizadosNestaRodada = 0;
    // Itera sobre os nós disponíveis para atacar, até o limite por rodada
    for (const alvo of nosDisponiveisParaAtaque) {
        if (ataquesRealizadosNestaRodada >= MAX_NOVOS_ATAQUES_POR_RODADA) {
            break; // Sai do loop se já atingiu o máximo de ataques
        }

        if (Math.random() < CHANCE_DE_ATAQUE_EM_ALVO) {
            const noParaAtacar = nosIntermediarios.find(n => n.id === alvo.id);
            if (noParaAtacar) {
                mensagensDaRodada.push(`ATAQUE: Novo ataque detectado em ${noParaAtacar.nome}!`);
                noParaAtacar.status = 'sobAtaque';
                noParaAtacar.rodadasSobAtaque = 1;
                ataquesRealizadosNestaRodada++;
            }
        }
    }

    if (ataquesRealizadosNestaRodada === 0 && nosDisponiveisParaAtaque.length > 0) {
        mensagensDaRodada.push("Nenhum novo ataque direto nesta rodada.");
    }
    
    // O estado final da rodada é nosIntermediarios
    const nodesAtualizados = nosIntermediarios;

    // --- VERIFICAÇÃO DE FIM DE JOGO (com o estado final da rodada) ---
    if (calcularServidoresComprometidos(nodesAtualizados) >= MAX_SERVIDORES_COMPROMETIDOS) {
        statusJogo = 'derrota';
        mensagensDaRodada.push("FALHA CRÍTICA DO SISTEMA! A rede foi perdida.");
    } else if (rodadaAtualNumero >= RODADAS_PARA_VITORIA) {
        statusJogo = 'vitoria';
        mensagensDaRodada.push("PROTOCOLO DE DEFESA BEM-SUCEDIDO! A rede está estável.");
    } else if (nodesAtualizados.every(node => node.status === 'seguro')) {
        statusJogo = 'vitoria';
        mensagensDaRodada.push("AMEAÇAS NEUTRALIZADAS! Todos os sistemas estão seguros.");
    }

    return { nodesAtualizados, mensagensDaRodada, statusJogo };
}

export function calcularServidoresComprometidos(nodes) {
    return nodes.filter(node => node.status === 'comprometido').length;
}

export function aplicarAcaoJogador(nodesAtuais, idNodeAlvo, novoStatusAlvo) {
    let mensagemAcao = "";
    let nodeAlteradoNome = "";

    const nodesAtualizados = nodesAtuais.map(node => {
        if (node.id === idNodeAlvo) {
            nodeAlteradoNome = node.nome;
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