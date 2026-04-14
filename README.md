# 💰 Controle de Gastos Domésticos

Este projeto foi desenvolvido como **Atividade Extensionista** do curso de Análise e Desenvolvimento de Sistemas (ADS). O objetivo é oferecer uma ferramenta simples, acessível e funcional para auxiliar moradores de São Carlos (SP) no controle de suas finanças domésticas, promovendo a educação financeira local.

![Recording 2026-04-14 at 13 33 19](https://github.com/user-attachments/assets/faeb43bd-878e-4c3d-b8e2-4103bb348dd2)

## 🎯 Propósito e Impacto Social
O projeto está alinhado com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU:
* **Consumo e Produção Responsáveis:** Auxilia na gestão consciente dos recursos familiares.
* **Trabalho Decente e Crescimento Econômico:** Promove a estabilidade financeira através do planejamento.

## 🛠️ Tecnologias Utilizadas
* **Framework:** Angular (v18+) utilizando **Signals** para reatividade.
* **Linguagem:** **TypeScript** (escolhida para elevar o nível técnico e simular padrões reais de mercado).
* **Persistência:** LocalStorage (focado em acessibilidade e privacidade, sem necessidade de login).
* **Testes E2E:** **Cypress** com TypeScript.

## 🧪 Foco em QA (O Diferencial)
Embora seja um app simples, o chapter de **Quality Assurance** foi levado a sério. Decidi implementar o Cypress como adição estratégica para me aprofundar na ferramenta e garantir a entrega de um software resiliente.

### Estratégia de Testes
A suíte de testes cobre **13 casos de uso**, organizados em:
1.  **Fluxos Críticos:** Cadastro de gastos e persistência de dados após recarregamento (LocalStorage).
2.  **Regras de Negócio:** Validação de campos obrigatórios, cálculos de precisão decimal e soma por categorias (Signals/Computed).
3.  **Interface e UX:** Alternância de tema (Dark Mode) e controle manual de tutorial.
4.  **Integrações de Sistema:** Exportação de massa de dados para arquivo CSV.

<img width="1846" height="765" alt="image" src="https://github.com/user-attachments/assets/7c8466a6-b30b-4986-bf88-690eef5bbda0" />

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js instalado.
* Angular CLI.

### Instalação e Execução
1.  Clone o repositório:
    ```bash
    git clone https://github.com/Laura-Xaraba/controle-gastos-domesticos.git
    ```
2.  Instale as dependências (Angular e Cypress):
    ```bash
    npm install
    ```
3.  Execute o app:
    ```bash
    ng serve
    ```

### Executando os Testes (QA)
Para abrir a interface do Cypress e ver os testes rodando em tempo real:
```bash
npx cypress open
```
Ou para rodar em modo *headless* (terminal):
```bash
npx cypress run
```


## 🧠 Aprendizados e Desafios
* **TypeScript como Desafio Central:** O maior desafio foi me forçar a trabalhar com TypeScript do início ao fim. Sendo uma linguagem nova para mim, decidi ignorar a facilidade do JS puro para "aprender na marra" os conceitos de tipagem, interfaces e segurança de código que o mercado exige.
* **Mentalidade de QA:** Implementar o Cypress me forçou a pensar não apenas como quem constrói o código, mas como quem tenta encontrar falhas nele. Aprender a validar lógica de estados (Signals), persistência e manipulação de arquivos (CSV) elevou minha maturidade técnica no chapter de Qualidade.
* **Integração de Tecnologias:** Unificar um projeto Angular com uma suíte de testes robusta, garantindo que as configurações de ambiente (como o `tsconfig` e dependências) conversassem entre si, foi um exercício prático de Engenharia de Software.


## 🎭 Análise de Qualidade (Lighthouse)

O projeto foi submetido a auditorias automatizadas de performance e acessibilidade, garantindo uma aplicação leve e funcional para o usuário final.

<img width="1913" height="907" alt="image" src="https://github.com/user-attachments/assets/84ff7503-8016-4083-a9d7-75bbde4543ab" />

O sistema atingiu 77 em acessibilidade, e como melhoria futura identificada pelo Lighthouse, pretendo ajustar o contraste de cores e labels para atingir a nota máxima, garantindo inclusão total para a comunidade de São Carlos.


---
**Desenvolvido por:** Laura Alves Xaraba  

*Estudante de Engenharia de Software & ADS*  

🪢 Vamos nos conectar! [**LinkedIn**](https://www.linkedin.com/in/laura-alves-xaraba/)  

---

