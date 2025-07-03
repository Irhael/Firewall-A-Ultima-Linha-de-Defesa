import React from 'react';
import styles from './NodeServidor.module.css';
import IconeAtaque from '../IconeAtaque/IconeAtaque';

const detalhesStatus = {
    seguro: { icon: '🛡️', label: 'SEGURO', className: styles.seguro },
    sobAtaque: { icon: '⚠️', label: 'EM RISCO', className: styles.sobAtaque },
    comprometido: { icon: '☠️', label: 'COMPROMETIDO', className: styles.comprometido },
    isolado: { icon: '🔗', label: 'ISOLADO', className: styles.isolado },
};

const detalhesComprometimento = {
    dados_corrompidos: { icon: '📄', label: 'DADOS CORROMPIDOS' },
    dados_sequestrados: { icon: '💰', label: 'DADOS SEQUESTRADOS' },
};

function NodeServidor({ id, nome, status, tipoAtaque, ameacaAnalisada, comprometimento, estaSelecionado, aoClicarNoNode }) {
    const detalhesAtuais = detalhesStatus[status] || { icon: '?', label: 'DESCONHECIDO' };
    const detalhesComp = detalhesComprometimento[comprometimento];

    const classesDoNode = `${styles.nodeServidor} ${detalhesAtuais.className || ''} ${estaSelecionado ? styles.selecionado : ''}`;

    return (
        <div className={classesDoNode} onClick={() => aoClicarNoNode(id)}>
            <IconeAtaque tipo={tipoAtaque} analisado={ameacaAnalisada} />
            
            <div className={styles.idDoNode}>{nome || `SRV-${String(id).padStart(2, '0')}`}</div>
            
            {status === 'comprometido' && detalhesComp ? (
                <>
                    <div className={styles.iconeStatusNode}>{detalhesComp.icon}</div>
                    <div className={styles.labelStatusNode}>{detalhesComp.label}</div>
                </>
            ) : (
                <>
                    <div className={styles.iconeStatusNode}>{detalhesAtuais.icon}</div>
                    <div className={styles.labelStatusNode}>{detalhesAtuais.label}</div>
                </>
            )}
        </div>
    );
}

export default NodeServidor;