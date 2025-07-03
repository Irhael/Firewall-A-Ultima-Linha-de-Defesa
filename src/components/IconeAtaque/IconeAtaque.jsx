import React from 'react';
import styles from './IconeAtaque.module.css';

const detalhesAtaque = {
    virus: { icon: '🦠', label: 'Vírus' },
    ransomware: { icon: '🔒', label: 'Ransomware' },
    ddos: { icon: '🚦', label: 'DDoS' },
    desconhecido: { icon: '❓', label: 'Ameaça Desconhecida' }
};

function IconeAtaque({ tipo, analisado }) {
    if (!tipo || tipo === 'nenhum') {
        return null;
    }

    const tipoParaExibir = analisado ? tipo : 'desconhecido';
    const detalhe = detalhesAtaque[tipoParaExibir];

    return (
        <div className={`${styles.containerIcone} ${styles[tipoParaExibir]}`} title={detalhe.label}>
            {detalhe.icon}
        </div>
    );
}

export default IconeAtaque;

