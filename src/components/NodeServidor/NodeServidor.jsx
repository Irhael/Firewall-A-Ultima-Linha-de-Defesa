// src/components/NodeServidor/NodeServidor.jsx
import React from 'react';
import styles from './NodeServidor.module.css'; // Usando CSS Modules


const detalhesStatus = {
    seguro: { icon: '🛡️', label: 'SEGURO', className: styles.seguro },
    sobAtaque: { icon: '⚠️', label: 'EM RISCO', className: styles.sobAtaque },
    comprometido: { icon: '☠️', label: 'COMPROMETIDO', className: styles.comprometido },
    isolado: { icon: '🔗', label: 'ISOLADO', className: styles.isolado },
    desconhecido: { icon: '❓', label: 'DESCONHECIDO', className: styles.desconhecido }
};

function NodeServidor({ id, nome, status, estaSelecionado, aoClicarNoNode }) { // Prop aoClicarNoNode
    const detalhesAtuais = detalhesStatus[status] || detalhesStatus.desconhecido;
    
    const classesDoNode = `
        ${styles.nodeServidor} 
        ${detalhesAtuais.className || ''} 
        ${estaSelecionado ? styles.selecionado : ''} 
    `;

    return (
        <div className={classesDoNode} onClick={() => aoClicarNoNode(id)}>
            <div className={styles.idDoNode}>{nome || `SRV-${String(id).padStart(2, '0')}`}</div>
            <div className={styles.iconeStatusNode}>{detalhesAtuais.icon}</div>
            <div className={styles.labelStatusNode}>{detalhesAtuais.label}</div>
        </div>
    );
}

export default NodeServidor;