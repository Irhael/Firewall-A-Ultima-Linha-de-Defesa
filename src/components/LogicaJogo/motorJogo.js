// --- Constantes de Balanceamento do Jogo ---
export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2;
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.75;
export const RODADAS_PARA_COMPROMETER = 2;
export const RODADAS_PARA_VITORIA = 15;
export const MAX_SERVIDORES_COMPROMETIDOS = 4;
export const DURACAO_ISOLAMENTO = 3; // Servidor fica isolado por 3 rodadas (a atual + 2)

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
            rodadasIsolado: 0, // NOVO: Contador para a duração do isolamento
        });
    }
    return nodesIniciais;
}

/**
 * Processa a lógica de uma nova rodada.
 */
export function processarProximaRodada(nodesAtuais, rodadaAtualNumero) {
    let mensagensDaRodada = [`--- Rodada ${rodadaAtualNumero} Iniciada ---`];
    let statusJogo = 'em_andamento';

    let nosIntermediarios = JSON.parse(JSON.stringify(nodesAtuais));

    // 1. Fase de Manutenção de Status (Evolução e Contagem de Isolamento)
    nosIntermediarios.forEach(node => {
        // Evolução de 'sobAtaque' para 'comprometido'
        if (node.status === 'sobAtaque') {
            node.rodadasSobAtaque += 1;
            if (node.rodadasSobAtaque >= RODADAS_PARA_COMPROMETER) {
                mensagensDaRodada.push(`ALERTA: ${node.nome} foi COMPROMETIDO!`);
                node.status = 'comprometido';
                node.rodadasSobAtaque = 0;
            }
        }
        // Contagem regressiva do isolamento
        if (node.status === 'isolado') {
            node.rodadasIsolado -= 1;
            if (node.rodadasIsolado <= 0) {
                mensagensDaRodada.push(`INFO: A proteção de ${node.nome} expirou. Agora está seguro.`);
                node.status = 'seguro';
            }
        }
    });

    // 2. Fase de Novos Ataques (RF03)
    // Servidores isolados ou comprometidos não podem ser atacados
    let nosDisponiveisParaAtaque = nosIntermediarios.filter(node => node.status === 'seguro');
    nosDisponiveisParaAtaque.sort(() => 0.5 - Math.random());

    let ataquesRealizadosNestaRodada = 0;
    for (const alvo of nosDisponiveisParaAtaque) {
        if (ataquesRealizadosNestaRodada >= MAX_NOVOS_ATAQUES_POR_RODADA) break;
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
    
    const nodesAtualizados = nosIntermediarios;

    // 3. Verificação de Fim de Jogo
    if (calcularServidoresComprometidos(nodesAtualizados) >= MAX_SERVIDORES_COMPROMETIDOS) {
        statusJogo = 'derrota';
        mensagensDaRodada.push("FALHA CRÍTICA DO SISTEMA! A rede foi perdida.");
    } else if (rodadaAtualNumero >= RODADAS_PARA_VITORIA) {
        statusJogo = 'vitoria';
        mensagensDaRodada.push("PROTOCOLO DE DEFESA BEM-SUCEDIDO! A rede está estável.");
    } else if (nodesAtualizados.every(node => node.status === 'seguro' || node.status === 'isolado')) {
        statusJogo = 'vitoria';
        mensagensDaRodada.push("AMEAÇAS NEUTRALIZADAS! Todos os sistemas estão seguros.");
    }

    return { nodesAtualizados, mensagensDaRodada, statusJogo };
}

/**
 * Aplica uma ação específica do jogador a um nó.
 * @param {Array<Object>} nodesAtuais - O estado atual de todos os nós.
 * @param {number} idNodeAlvo - O ID do nó que sofrerá a ação.
 * @param {string} tipoDeAcao - O tipo de ação a ser executada (ex: 'instalarFirewall', 'isolar', 'analisar').
 * @returns {{nodesAtualizados: Array<Object>|null, mensagemAcao: string, acoesBonus: number}} Objeto com o novo estado, mensagem e ações bónus. Retorna null para nós se a ação for inválida.
 */
export function aplicarAcaoJogador(nodesAtuais, idNodeAlvo, tipoDeAcao) {
    const nodeAlvo = nodesAtuais.find(n => n.id === idNodeAlvo);
    if (!nodeAlvo) {
        return { nodesAtualizados: null, mensagemAcao: "Erro: Nó alvo não encontrado.", acoesBonus: 0 };
    }

    let mensagemAcao = "";
    let acoesBonus = 0;
    let nodesAtualizados = JSON.parse(JSON.stringify(nodesAtuais)); // Cria cópia para modificar

    switch (tipoDeAcao) {
        case 'instalarFirewall':
            if (nodeAlvo.status === 'sobAtaque') {
                const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);
                noModificado.status = 'seguro';
                noModificado.rodadasSobAtaque = 0;
                mensagemAcao = `AÇÃO: Firewall instalado em ${nodeAlvo.nome}. Ameaça neutralizada.`;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Só é possível instalar firewall em servidores sob ataque.`, acoesBonus: 0 };
            }
            break;

        case 'isolar':
            if (nodeAlvo.status === 'seguro' || nodeAlvo.status === 'sobAtaque') {
                const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);
                noModificado.status = 'isolado';
                noModificado.rodadasIsolado = DURACAO_ISOLAMENTO;
                noModificado.rodadasSobAtaque = 0;
                mensagemAcao = `AÇÃO: ${nodeAlvo.nome} foi isolado e está protegido por ${DURACAO_ISOLAMENTO-1} rodada(s).`;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Não é possível isolar um servidor já comprometido ou isolado.`, acoesBonus: 0 };
            }
            break;

        case 'analisar':
            if (nodeAlvo.status === 'sobAtaque') {
                acoesBonus = 1;
                mensagemAcao = `AÇÃO: Análise de ${nodeAlvo.nome} concluída. Você ganhou 1 ação bónus!`;
                // A ação não muda o estado do nó, apenas concede o bónus.
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Só é possível analisar servidores sob ataque.`, acoesBonus: 0 };
            }
            break;

        default:
            return { nodesAtualizados: null, mensagemAcao: "Erro: Ação desconhecida.", acoesBonus: 0 };
    }

    return { nodesAtualizados, mensagemAcao, acoesBonus };
}

export function calcularServidoresComprometidos(nodes) {
    return nodes.filter(node => node.status === 'comprometido').length;
}