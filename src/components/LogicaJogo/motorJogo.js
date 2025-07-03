export const TOTAL_NOS = 9;
export const MAX_NOVOS_ATAQUES_POR_RODADA = 2;
export const CHANCE_DE_ATAQUE_EM_ALVO = 0.8;
export const RODADAS_PARA_COMPROMETER_VIRUS = 2;
export const RODADAS_PARA_COMPROMETER_RANSOMWARE = 1;
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
            comprometimento: 'nenhum',
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

    const novasInfeccoesDeVirus = [];
    nosIntermediarios.forEach(nodeOriginal => {
        if (nodeOriginal.tipoAtaque === 'virus' && nodeOriginal.status === 'sobAtaque') {
            const vizinhos = ADJACENCIAS[nodeOriginal.id];
            vizinhos.forEach(vizinhoId => {
                const vizinhoAlvo = nosIntermediarios.find(n => n.id === vizinhoId);
                if (vizinhoAlvo && vizinhoAlvo.status === 'seguro') {
                    novasInfeccoesDeVirus.push({ id: vizinhoId, nomeOrigem: nodeOriginal.nome });
                }
            });
        }
    });

    novasInfeccoesDeVirus.forEach(infeccao => {
        const noParaInfetar = nosIntermediarios.find(n => n.id === infeccao.id);
        if (noParaInfetar && noParaInfetar.status === 'seguro') {
            mensagensDaRodada.push(`VÍRUS: ${infeccao.nomeOrigem} está a infetar ${noParaInfetar.nome}!`);
            noParaInfetar.status = 'sobAtaque';
            noParaInfetar.tipoAtaque = 'virus';
            noParaInfetar.ameacaAnalisada = false;
            noParaInfetar.rodadasSobAtaque = 1;
        }
    });

    nosIntermediarios.forEach(node => {
        if (node.status === 'sobAtaque' && node.tipoAtaque !== 'ddos') {
            node.rodadasSobAtaque += 1;
            const limiteComprometimento = node.tipoAtaque === 'ransomware' ? RODADAS_PARA_COMPROMETER_RANSOMWARE : RODADAS_PARA_COMPROMETER_VIRUS;
            if (node.rodadasSobAtaque >= limiteComprometimento) {
                mensagensDaRodada.push(`ALERTA: ${node.nome} foi COMPROMETIDO!`);
                node.status = 'comprometido';
                node.comprometimento = node.tipoAtaque === 'ransomware' ? 'dados_sequestrados' : 'dados_corrompidos';
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
                mensagensDaRodada.push(`ATAQUE: Ameaça desconhecida detectada em ${noParaAtacar.nome}!`);
                noParaAtacar.status = 'sobAtaque';
                noParaAtacar.rodadasSobAtaque = 1;
            }
        }
    }
    
    const nodesAtualizados = nosIntermediarios;

    if (calcularServidoresComprometidos(nodesAtualizados) >= MAX_SERVIDORES_COMPROMETIDOS) {
        statusJogo = 'derrota';
    } else if (rodadaAtualNumero >= RODADAS_PARA_VITORIA) {
        statusJogo = 'vitoria';
    } else if (rodadaAtualNumero > 0 && nodesAtualizados.every(n => n.status === 'seguro' || n.status === 'isolado')) {
        statusJogo = 'vitoria';
    }

    return { nodesAtualizados, mensagensDaRodada, statusJogo };
}

export function aplicarAcaoJogador(nodesAtuais, idNodeAlvo, tipoDeAcao) {
    const nodeAlvo = nodesAtuais.find(n => n.id === idNodeAlvo);
    if (!nodeAlvo) return { nodesAtualizados: null, mensagemAcao: "Erro: Nó alvo não encontrado.", acoesBonus: 0 };

    let mensagemAcao = "";
    let acoesBonus = 0;
    let nodesAtualizados = JSON.parse(JSON.stringify(nodesAtuais));
    const noModificado = nodesAtualizados.find(n => n.id === idNodeAlvo);

    if (tipoDeAcao !== 'analisar' && !nodeAlvo.ameacaAnalisada && nodeAlvo.status === 'sobAtaque') {
        return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: É preciso analisar a ameaça em ${nodeAlvo.nome} antes de agir.`, acoesBonus: 0 };
    }

    switch (tipoDeAcao) {
        case 'instalarFirewall':
            if (nodeAlvo.tipoAtaque === 'virus') {
                mensagemAcao = `AÇÃO: Firewall instalado em ${nodeAlvo.nome}. Vírus neutralizado. Você ganhou 1 ação bónus para a próxima rodada!`;
                noModificado.status = 'seguro';
                noModificado.tipoAtaque = 'nenhum';
                noModificado.ameacaAnalisada = false;
                acoesBonus = 1;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Firewall é eficaz apenas contra Vírus.`, acoesBonus: 0 };
            }
            break;

        case 'isolarServidor':
            if (nodeAlvo.tipoAtaque === 'ddos') {
                mensagemAcao = `AÇÃO: ${nodeAlvo.nome} foi isolado da rede. Ataque DDoS contido. Você ganhou 1 ação bónus para a próxima rodada!`;
                noModificado.status = 'isolado';
                noModificado.rodadasIsolado = DURACAO_ISOLAMENTO;
                noModificado.tipoAtaque = 'nenhum';
                noModificado.ameacaAnalisada = false;
                acoesBonus = 1;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Isolar é eficaz apenas contra DDoS.`, acoesBonus: 0 };
            }
            break;

        case 'neutralizarRansomware':
            if (nodeAlvo.tipoAtaque === 'ransomware') {
                mensagemAcao = `AÇÃO: Ameaça de Ransomware em ${nodeAlvo.nome} foi neutralizada. Você ganhou 1 ação bónus para a próxima rodada!`;
                noModificado.status = 'seguro';
                noModificado.tipoAtaque = 'nenhum';
                noModificado.ameacaAnalisada = false;
                acoesBonus = 1;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Esta ação é eficaz apenas contra Ransomware.`, acoesBonus: 0 };
            }
            break;

        case 'analisar':
            if (nodeAlvo.status === 'sobAtaque' && !nodeAlvo.ameacaAnalisada) {
                noModificado.ameacaAnalisada = true;
                mensagemAcao = `ANÁLISE: A ameaça em ${nodeAlvo.nome} é um ${nodeAlvo.tipoAtaque.toUpperCase()}!`;
            } else {
                return { nodesAtualizados: null, mensagemAcao: `AÇÃO INVÁLIDA: Só é possível analisar ameaças novas e desconhecidas.`, acoesBonus: 0 };
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

export function isDDoSAnalisadoAtivo(nodes) {
    return nodes.some(node => node.tipoAtaque === 'ddos' && node.ameacaAnalisada);
}