// src/components/GridServidores/GridServidores.jsx
import React, { useState, useEffect } from 'react';
import NodeServidor from '../NodeServidor/NodeServidor'; // Caminho atualizado
import styles from './GridServidores.module.css'; 

const TOTAL_NOS = 9; 

function GridServidores() {
    const [nodes, setNodes] = useState([]); 
    const [idNodeSelecionado, setIdNodeSelecionado] = useState(null); 

    useEffect(() => {
        const nodesIniciais = [];
        const statusIniciais = ['seguro', 'seguro', 'sobAtaque', 'seguro', 'comprometido', 'seguro', 'isolado', 'seguro', 'sobAtaque'];
        for (let i = 1; i <= TOTAL_NOS; i++) {
            nodesIniciais.push({
                id: i,
                nome: `SRV-${String(i).padStart(2, '0')}`,
                status: statusIniciais[i-1] || 'seguro'
            });
        }
        setNodes(nodesIniciais);
    }, []);

    const handleNodeClick = (id) => { 
        setIdNodeSelecionado(id);
        console.log(`Servidor ${id} selecionado via React!`);
    };

    const alterarStatusNodeSelecionado = (novoStatus) => { 
        if (idNodeSelecionado === null) {
            alert('Por favor, selecione um servidor primeiro.');
            return;
        }
        setNodes(nodesAnteriores =>
            nodesAnteriores.map(node => 
                node.id === idNodeSelecionado ? { ...node, status: novoStatus } : node
            )
        );
        console.log(`Status do servidor ${idNodeSelecionado} alterado para: ${novoStatus}`);
    };

    return (
        <>
            <div className={styles.containerGridServidores}> 
                {nodes.map(node => ( 
                    <NodeServidor
                        key={node.id}
                        id={node.id}
                        nome={node.nome}
                        status={node.status}
                        estaSelecionado={node.id === idNodeSelecionado} 
                        aoClicarNoNode={handleNodeClick} 
                    />
                ))}
            </div>
            <div className={styles.controles}>
                <p>Clique em um servidor para selecioná-lo.</p>
                <p>Controles de Demonstração (para o servidor selecionado):</p>
                <button onClick={() => alterarStatusNodeSelecionado('seguro')}>Marcar como Seguro</button>
                <button onClick={() => alterarStatusNodeSelecionado('sobAtaque')}>Marcar Sob Ataque</button>
                <button onClick={() => alterarStatusNodeSelecionado('comprometido')}>Marcar Comprometido</button>
                <button onClick={() => alterarStatusNodeSelecionado('isolado')}>Marcar Isolado</button>
            </div>
        </>
    );
}

export default GridServidores;