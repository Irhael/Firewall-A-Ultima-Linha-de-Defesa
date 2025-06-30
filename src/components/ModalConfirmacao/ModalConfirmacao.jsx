import React from 'react';
import styles from './ModalConfirmacao.module.css';

function ModalConfirmacao({ estaAberto, mensagem, aoConfirmar, aoCancelar }) {
    if (!estaAberto) {
        return null;
    }

    return (
        <div className={styles.modalBackdrop} onClick={aoCancelar}>
            <div className={styles.modalConteudo} onClick={(e) => e.stopPropagation()}>
                <p className={styles.modalMensagem}>{mensagem}</p>
                <div className={styles.modalAcoes}>
                    <button onClick={aoCancelar} className={`${styles.botaoModal} ${styles.botaoCancelar}`}>
                        Cancelar
                    </button>
                    <button onClick={aoConfirmar} className={`${styles.botaoModal} ${styles.botaoConfirmar}`}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacao;