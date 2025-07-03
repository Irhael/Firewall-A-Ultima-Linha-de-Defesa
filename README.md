#  Firewall: A Última Linha de Defesa 

##  Visão Geral do Jogo

**Firewall: A Última Linha de Defesa** é um jogo cooperativo 2D baseado em turnos, inspirado na dinâmica do popular jogo *Pandemic*, mas com uma imersiva temática de segurança da informação. Neste desafio, de 2 a 4 jogadores assumem o papel de analistas de cibersegurança de elite, encarregados de proteger a infraestrutura digital crítica de uma grande corporação contra uma onda implacável de ciberataques.

O "mapa" do jogo é uma rede de servidores interconectados, representada por um grid 3x3. A cada rodada, diferentes tipos de ameaças digitais (vírus, ransomware, ataques DDoS) surgem aleatoriamente, testando a capacidade de resposta e a estratégia da equipa. Os jogadores devem colaborar intensamente, movimentar-se entre os servidores e utilizar ações estratégicas para mitigar as ameaças, instalar firewalls e analisar os perigos.

O jogo termina com a **vitória** da equipa se todos os ataques forem contidos com sucesso, ou com a **derrota** se um número crítico de servidores for comprometido, levando a rede ao colapso.

---

##  Tecnologias Utilizadas

* **Frontend:** React com Vite
* **Linguagem Principal:** JavaScript 
* **Estilização:** CSS Modules 
* **Controlo de Versão:** Git & GitHub
* **Gestão de Projeto:** GitHub Issues


---

##  Funcionalidades Principais

* ** Grid de Servidores Interativo (3x3):** O campo de batalha digital onde a ação acontece. 
* ** Geração Aleatória de Ataques:** Diferentes tipos de ciberataques (vírus, ransomware, DDoS, phishing) surgem a cada rodada, mantendo a jogabilidade dinâmica e desafiadora. 
* ** Controlo de Servidores Comprometidos:** Um indicador visual e lógico do quão perto a rede está do colapso. 
* ** Condições de Vitória e Derrota:** Objetivos claros para o sucesso ou fracasso da equipa. 
* ** Acessível via Navegador:** Jogue em qualquer lugar, a qualquer hora. 
* ** Código Aberto:** Licenciado sob MIT, incentivando a colaboração e o aprendizado. 

---

## 룰 Regras do Jogo: Manual do Analista

Bem-vindo ao centro de comando do **Firewall**. A sua missão é proteger a rede corporativa de uma série de ciberataques sofisticados. A seguir estão os protocolos e procedimentos que precisa de dominar para ser bem-sucedido.

### Objetivo do Jogo

A sua equipa vence ou perde em conjunto. A vitória pode ser alcançada de duas formas:
* **Vitória por Resiliência:** Sobreviva por **15 rodadas** sem que a rede entre em colapso.
* **Vitória por Limpeza Total:** Neutralize todas as ameaças, deixando todos os 9 servidores no estado `SEGURO` ou `ISOLADO` (esta condição só é válida após a Rodada 0).

A derrota é imediata se:
* **Derrota por Colapso da Rede:** **4 ou mais servidores** ficarem no estado `COMPROMETIDO` ao mesmo tempo.

---

### O Seu Turno

Cada rodada representa um turno de trabalho. No seu turno, você tem um número limitado de ações para responder às crises.

* **Ações por Turno:** Você começa cada turno com **3 Ações**.
* **Fim do Turno:** O seu turno termina de duas formas:
    1.  **Automaticamente:** Quando as suas ações chegam a 0.
    2.  **Manualmente:** Clicando no botão "Terminar Turno", caso queira poupar ações (elas não acumulam).
* **Ação Bónus:** Ao neutralizar com sucesso uma ameaça (Vírus, Ransomware ou DDoS), você ganha **+1 Ação Bónus** que será adicionada ao total de ações da sua **próxima rodada**.

---

### As Ameaças Digitais

A cada rodada, novas ameaças podem surgir. Inicialmente, toda a ameaça é desconhecida e precisa de ser analisada.

* **Ameaça Desconhecida (`❓`):**
    * É assim que toda a nova ameaça num servidor `EM RISCO` aparece.
    * Você não sabe a sua natureza ou os seus efeitos.
    * A sua primeira prioridade é usar a ação **Analisar Ameaça** para descobrir o que está a enfrentar.

#### Tipos de Ameaça (Após Análise)

* **Vírus (`🦠`):**
    * **Efeito:** Se um Vírus não for tratado, no início da próxima rodada, ele tentará **infetar todos os servidores adjacentes** que estiverem `SEGUROS`, espalhando a ameaça pela rede.
    * **Comprometimento:** Se um servidor com Vírus ficar `EM RISCO` por muito tempo, ele será comprometido e os seus **Dados serão Corrompidos (`📄`)**.
    * **Solução:** Ação **Instalar Firewall**.

* **Ransomware (`🔒`):**
    * **Efeito:** É uma ameaça de tempo curto. Se não for neutralizado rapidamente (em 1 rodada após surgir), ele **compromete o servidor** e os **Dados são Sequestrados (`💰`)**.
    * **Solução:** Ação **Neutralizar Ransomware** (enquanto está `EM RISCO`).

* **DDoS (`🚦`):**
    * **Efeito:** Este ataque não danifica o servidor nem o compromete. Em vez disso, ele ataca **você**, o jogador.
    * **Penalidade Global:** Enquanto houver um ataque DDoS **analisado e ativo** na rede, o seu número total de ações por turno é **reduzido em 1**. Um alerta global aparecerá para o informar disto.
    * **Solução:** Ação **Isolar Servidor**.

---

### Ações do Analista

Cada ação custa **1 ponto de ação**. É obrigatório analisar uma ameaça antes de poder usar uma ação de defesa.

1.  **Analisar Ameaça:**
    * **Quando usar:** É a **primeira e única ação** que pode ser usada num servidor `EM RISCO` com uma ameaça desconhecida (`❓`).
    * **Efeito:** Revela o tipo real da ameaça (Vírus, Ransomware ou DDoS), mudando o seu ícone. A mensagem do jogo informará qual ameaça foi descoberta. Após a análise, as ações de defesa específicas ficam disponíveis.

2.  **Instalar Firewall (Contra Vírus):**
    * **Quando usar:** Num servidor `EM RISCO` que foi analisado e revelou ser um **Vírus (`🦠`)**.
    * **Efeito:** Neutraliza o Vírus e retorna o servidor ao estado `SEGURO`. Concede **+1 Ação Bónus** para a próxima rodada.

3.  **Isolar Servidor (Contra DDoS):**
    * **Quando usar:** Num servidor `EM RISCO` que foi analisado e revelou ser um **DDoS (`🚦`)**.
    * **Efeito:** Neutraliza o ataque DDoS, mudando o estado do servidor para `ISOLADO`. Um servidor isolado fica protegido de novos ataques por um curto período. Concede **+1 Ação Bónus** para a próxima rodada.

4.  **Neutralizar Ransomware (Contra Ransomware):**
    * **Quando usar:** Num servidor `EM RISCO` que foi analisado e revelou ser um **Ransomware (`🔒`)**.
    * **Efeito:** Neutraliza a ameaça de Ransomware antes que ela comprometa o servidor, retornando-o ao estado `SEGURO`. Concede **+1 Ação Bónus** para a próxima rodada.

---


##  Como Configurar e Rodar o Projeto Localmente

Para executar o "Firewall: A Última Linha de Defesa" no seu ambiente de desenvolvimento local, siga estes passos:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/Irhael/Firewall-A-Ultima-Linha-de-Defesa.git]
    cd Firewall-A-Ultima-Linha-de-Defesa
    ```

2.  **Instale as Dependências:**
    Certifique-se de ter o Node.js e o npm (ou yarn) instalados.
    ```bash
    npm install
    ```

3.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    

4.  **Acesse o Jogo:**
    Abra o seu navegador e vá para o endereço local fornecido pelo Vite (geralmente `http://localhost:5173` ou similar).

---
