import React from 'react';
import styles from './ServerNode.module.css'

const statusDetails = {
    secure: { icon: '🛡️', label: 'SEGURO', className: styles.secure },
    'under-attack': { icon: '⚠️', label: 'EM RISCO', className: styles.underAttack },
    compromised: { icon: '☠️', label: 'COMPROMETIDO', className: styles.compromised },
    isolated: { icon: '🔗', label: 'ISOLADO', className: styles.isolated },
    unknown: { icon: '❓', label: 'DESCONHECIDO', className: styles.unknown }
};

function ServerNode({ id, name, status,isSelected, onNodeClick }) {
    const currentStatusDetails = statusDetails[status] || statusDetails.unknown;
    const nodeClasses = `
        ${styles.serverNode} 
        ${currentStatusDetails.className || ''} 
        ${isSelected ? styles.selected : ''}
    `;

    return (
        <div className={nodeClasses} onClick={() => onNodeClick(id)}>
            <div className={styles.nodeId}>{name || `SRV-${String(id).padStart(2, '0')}`}</div>
            <div className={styles.nodeStatusIcon}>{currentStatusDetails.icon}</div>
            <div className={styles.nodeLabel}>{currentStatusDetails.label}</div>
        </div>
    );
}

export default ServerNode;

