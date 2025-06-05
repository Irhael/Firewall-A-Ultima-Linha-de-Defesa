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