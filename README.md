#  Firewall: A Última Linha de Defesa 

##  Visão Geral do Jogo

**Firewall: A Última Linha de Defesa** é um jogo cooperativo 2D baseado em turnos, inspirado na dinâmica do popular jogo *Pandemic*, mas com uma imersiva temática de segurança da informação. Neste desafio, de 2 a 4 jogadores assumem o papel de analistas de cibersegurança de elite, encarregados de proteger a infraestrutura digital crítica de uma grande corporação contra uma onda implacável de ciberataques.

O "mapa" do jogo é uma rede de servidores interconectados, representada por um grid 3x3. A cada rodada, diferentes tipos de ameaças digitais (vírus, ransomware, ataques DDoS, phishing) surgem aleatoriamente, testando a capacidade de resposta e a estratégia da equipa. Os jogadores devem colaborar intensamente, movimentar-se entre os servidores e utilizar ações estratégicas para mitigar as ameaças, instalar firewalls e analisar os perigos.

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
* ** Ações Estratégicas dos Jogadores:**
    * Isolar Servidor
    * Instalar Firewall
    * Analisar Ameaça
    * (Outras ações que vocês implementarem) 
* ** Controlo de Servidores Comprometidos:** Um indicador visual e lógico do quão perto a rede está do colapso. 
* ** Condições de Vitória e Derrota:** Objetivos claros para o sucesso ou fracasso da equipa. 
* ** Multiplayer Cooperativo (Planeado):** Suporte para 2 a 4 jogadores trabalhando juntos. 
* ** Acessível via Navegador:** Jogue em qualquer lugar, a qualquer hora. 
* ** Código Aberto:** Licenciado sob MIT, incentivando a colaboração e o aprendizado. 

---

##  Como Jogar (Guia Rápido)

1.  **Reúna a sua Equipa:** Forme uma equipa de 2 a 4 analistas de cibersegurança.
2.  **Navegue pela Rede:** Movimente o seu avatar pelo grid de servidores.
3.  **Identifique Ameaças:** Observe os servidores que estão sob ataque. Cada tipo de ataque pode ter um comportamento ou impacto diferente.
4.  **Execute Ações:** Em cada turno, cada jogador pode executar um número limitado de ações para:
    * **Analisar Ameaças:** Para entender melhor um ataque e planear a contenção.
    * **Instalar Firewalls:** Para proteger servidores vulneráveis ou limpar os que estão sob ataque leve.
    * **Isolar Servidores:** Uma medida drástica para impedir a propagação de ataques graves, mas que pode ter consequências.
5.  **Contenha os Ataques:** Trabalhe em equipa para reduzir o nível de ameaça em todos os servidores.
6.  **Evite o Colapso:** Não deixe que muitos servidores sejam totalmente comprometidos!
7.  **Alcance a Vitória:** Contenha todos os ataques ativos e proteja a rede para vencer o jogo.

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
