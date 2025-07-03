

export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2;
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.8;
export const RODADAS_PARA_COMPROMETER = 2;
export const RODADAS_PARA_VITORIA = 15;
export const MAX_SERVIDORES_COMPROMETIDOS = 4;
export const DURACAO_ISOLAMENTO = 3;

const TIPOS_DE_ATAQUE = [
    { tipo: 'virus', probabilidade: 0.5 },
    { tipo: 'ransomware', probabilidade: 0.2 },
    { tipo: 'ddos', probabilidade: 0.3 },
];

const ADJACENCIAS = {
    1: [2, 4], 2: [1, 3, 5], 3: [2, 6],
    4: [1, 5, 7], 5: [2, 4, 6, 8], 6: [3, 5, 9],
    7: [4, 8], 8: [5, 7, 9], 9: [6, 8],
};

export function inicializarEstadoJogo() {
    const nodesIniciais = [];
    for (let i = 1; i <= TOTAL_NOS; i++) {
        nodesIniciais.push({
            id: i,
            nome: `SRV-${String(i).padStart(2, '0')}`,
            status: 'seguro',
            tipoAtaque: 'nenhum',
            ameacaAnalisada: false,
            rodadasSobAtaque: 0,
            rodadasIsolado: 0,
        });
    }
    return nodesIniciais;
}

function sortearTipoAtaque() {
    const rand = Math.random();
    let acumulado = 0;
    for (const ataque of TIPOS_DE_ATAQUE) {
        acumulado += ataque.probabilidade;
        if (rand < acumulado) {
            return ataque.tipo;
        }
    }
    return TIPOS_DE_ATAQUE[0].tipo;
}

export function processarProximaRodada(nodesAtuais, rodadaAtualNumero) {
    let mensagensDaRodada = [`--- Rodada ${rodadaAtualNumero} Iniciada ---`];
    let statusJogo = 'em_andamento';
    let nosIntermediarios = JSON.parse(JSON.stringify(nodesAtuais));

    const nosParaVerificarVirus = [...nosIntermediarios];
    nosParaVerificarVirus.forEach(nodeOriginal => {
        if (nodeOriginal.tipoAtaque === 'virus' && nodeOriginal.status === 'sobAtaque') {
            const vizinhos = ADJACENCIAS[nodeOriginal.id];
            vizinhos.forEach(vizinhoId => {
                const vizinhoAlvo = nosIntermediarios.find(n => n.id === vizinhoId);
                if (vizinhoAlvo && vizinhoAlvo.status === 'seguro') {
                    mensagensDaRodada.push(`VÍRUS: ${nodeOriginal.nome} está a infetar ${vizinhoAlvo.nome}!`);
                    vizinhoAlvo.status = 'sobAtaque';
                    vizinhoAlvo.tipoAtaque = 'virus';
                    vizinhoAlvo.ameacaAnalisada = false;
                    vizinhoAlvo.rodadasSobAtaque = 1;
                }
            });
        }
    });

    nosIntermediarios.forEach(node => {
        if (node.status === 'sobAtaque') {
            node.rodadasSobAtaque += 1;
            if (node.rodadasSobAtaque >= RODADAS_PARA_COMPROMETER) {
                mensagensDaRodada.push(`ALERTA: ${node.nome} foi COMPROMETIDO!`);
                node.status = 'comprometido';
                node.tipoAtaque = 'nenhum';
                node.ameacaAnalisada = false;
                node.rodadasSobAtaque = 0;
            }
        }
        if (node.status === 'isolado') {
            node.rodadasIsolado -= 1;
            if (node.rodadasIsolado <= 0) {
                mensagensDaRodada.push(`INFO: A proteção de ${node.nome} expirou.`);
                node.status = 'seguro';
            }
        }
    });

    let nosDisponiveisParaAtaque = nosIntermediarios.filter(n => n.status === 'seguro');
    nosDisponiveisParaAtaque.sort(() => 0.5 - Math.random());
    let ataquesRealizadosNestaRodada = 0;

    for (const alvo of nosDisponiveisParaAtaque) {
        if (ataquesRealizadosNestaRodada >= MAX_NOVOS_ATAQUES_POR_RODADA) break;
        if (Math.random() < CHANCE_DE_ATAQUE_EM_ALVO) {
            const noParaAtacar = nosIntermediarios.find(n => n.id === alvo.id);
            if (noParaAtacar) {
                const tipoAtaqueSorteado = sortearTipoAtaque();
                ataquesRealizadosNestaRodada++;
                noParaAtacar.tipoAtaque = tipoAtaqueSorteado;
                noParaAtacar.ameacaAnalisada = false;

                if (tipoAtaqueSorteado === 'ransomware') {
                    mensagensDaRodada.push(`RANSOMWARE: ${noParaAtacar.nome} foi instantaneamente COMPROMETIDO!`);
                    noParaAtacar.status = 'comprometido';
                    noParaAtacar.tipoAtaque = 'nenhum';
                } else {
                    mensagensDaRodada.push(`ATAQUE: Ameaça desconhecida detectada em ${noParaAtacar.nome}!`);
                    noParaAtacar.status = 'sobAtaque';
                    noParaAtacar.rodadasSobAtaque = 1;
                }
            }
        }
    }
    
    const nodesAtualizados = nosIntermediarios;

    if (calcularServidoresComprometidos(nodesAtualizados) >= MAX_SERVIDORES_COMPROMETIDOS) {
        statusJogo = 'derrota';
    } else if (rodadaAtualNumero >= RODADAS_PARA_VITORIA) {
        statusJogo = 'vitoria';
    } else if (nodesAtualizados.every(n => n.status === 'seguro' || n.status === 'isolado')) {
        statusJogo = 'vitoria';
    }

    return { nodesAtualizados, mensagensDaRodada, statusJogo };
}

export function aplicarAcaoJogador(nodesAtuais, idNodeAlvo, tipoDeAcao) {
    const nodeAlvo = nodesAtuais.find(n => n.id === idNodeAlvo);
    if (!nodeAlvo) return { nodesAtualizados: null, mensagemAcao: "Erro: Nó alvo não encontrado." };

    let mensagemAcao = "";
    let nodesAtualizados = JSON.parse(JSON.stringify(nodesAtuais));

    switch (tipoDeAcao) {
        case 'instalarFirewall':
            if (nodeAlvo.status === 'sobAtaque') {
                const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);
                mensagemAcao = `AÇÃO: Firewall instalado em ${nodeAlvo.nome}. Ameaça (${nodeAlvo.tipoAtaque}) neutralizada.`;
                noModificado.status = 'seguro';
                noModificado.tipoAtaque = 'nenhum';
                noModificado.ameacaAnalisada = false;
                noModificado.rodadasSobAtaque = 0;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Firewall só pode ser instalado em servidores sob ataque.` };
            }
            break;

        case 'isolar':
            if (nodeAlvo.status === 'seguro' || nodeAlvo.status === 'sobAtaque') {
                const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);
                noModificado.status = 'isolado';
                noModificado.rodadasIsolado = DURACAO_ISOLAMENTO;
                noModificado.tipoAtaque = 'nenhum';
                noModificado.ameacaAnalisada = false;
                noModificado.rodadasSobAtaque = 0;
                mensagemAcao = `AÇÃO: ${nodeAlvo.nome} foi isolado e está protegido.`;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Não é possível isolar um servidor já comprometido ou isolado.` };
            }
            break;

        case 'analisar':
            if (nodeAlvo.status === 'sobAtaque' && !nodeAlvo.ameacaAnalisada) {
                const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);
                noModificado.ameacaAnalisada = true;
                mensagemAcao = `ANÁLISE: A ameaça em ${nodeAlvo.nome} é um ${nodeAlvo.tipoAtaque.toUpperCase()}!`;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Só é possível analisar ameaças novas e desconhecidas.` };
            }
            break;

        default:
            return { nodesAtualizados: null, mensagemAcao: "Erro: Ação desconhecida." };
    }

    return { nodesAtualizados, mensagemAcao };
}

export function calcularServidoresComprometidos(nodes) {
    return nodes.filter(node => node.status === 'comprometido').length;
}