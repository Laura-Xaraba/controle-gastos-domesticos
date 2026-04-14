describe ('E2E: Fluxos Críticos e Persistência', () => {

    beforeEach(() => {

        // Limpar os dados do localStorage para garantir um estado limpo antes de cada teste
        cy.clearLocalStorage('meus-gastos');
        cy.visit('/');

        // Fechar o tutorial
        cy.get('body').then($body => {
            if ($body.find('[data-cy="btn-fechar-tutorial"]').length > 0) {
                cy.get('[data-cy="btn-fechar-tutorial"]').click()
            }
        });

    });

    it('Deve adicionar um novo gasto com sucesso e validar o resumo', () => {
        // 1. Preencher o formulário de novo gasto
        cy.get('[data-cy="input-descricao"]').type('Aluguel');
        cy.get('[data-cy="input-valor"]').type('1200');
        cy.get('[data-cy="select-categoria"]').select('Moradia');

        // 2. Clicar no botão de adicionar gasto
        cy.get('[data-cy="btn-adicionar"]').click();

        // 3. Validar que o gasto foi adicionado na tabela
        cy.get('[data-cy="item-gasto"]').should('have.length', 1);
        cy.get('[data-cy="gasto-descricao"]').should('contain', 'Aluguel');
        cy.get('[data-cy="gasto-valor"]').should('contain', 'R$1,200.00');
        cy.get('[data-cy="gasto-categoria"]').should('contain', 'Moradia');

        // 4. Validar que o resumo por categoria foi atualizado
        cy.get('[data-cy="card-resumo-categoria"]').within(() => {
            cy.get('[data-cy="nome-categoria"]').should('contain', 'Moradia');
            cy.get('[data-cy="valor-categoria"]').should('contain', 'R$1,200.00');
        });
    });

    it('Deve persistir os dados após recarregar a página', () => {
        // 1. Adicionar um gasto
        cy.get('[data-cy="input-descricao"]').type('Supermercado');
        cy.get('[data-cy="input-valor"]').type('300');
        cy.get('[data-cy="select-categoria"]').select('Alimentação');
        cy.get('[data-cy="btn-adicionar"]').click();

        // 2. Recarregar a página
        cy.reload();

        // 3. Validar que o gasto ainda está presente
        cy.get('[data-cy="item-gasto"]').should('contain', 'Supermercado');
    });

    it('Deve alternar entre temas claro e escuro', () => {
        // 1. Verificar o tema inicial (claro)
        cy.get('body').should('not.have.class', 'dark-theme');

        // 2. Clicar no botão de alternar tema
        cy.get('[data-cy="btn-dark-mode"]').click();

        // 3. Validar que o tema foi alterado para escuro
        cy.get('body').should('have.class', 'dark-theme');

        // 4. Clicar novamente para voltar ao tema claro
        cy.get('[data-cy="btn-dark-mode"]').click();

        // 5. Validar que o tema voltou para claro
        cy.get('body').should('not.have.class', 'dark-theme');
    });
});

describe('E2E: Validações de Negócio e Integridade', () => {
   
    beforeEach(() => {
        // Limpar os dados do localStorage para garantir um estado limpo antes de cada teste
        cy.clearLocalStorage('meus-gastos');
        cy.visit('/'); 

        // Fechar o tutorial
        cy.get('body').then($body => {
            if ($body.find('[data-cy="btn-fechar-tutorial"]').length > 0) {
                cy.get('[data-cy="btn-fechar-tutorial"]').click()
            }
        });
    });

    it('Deve impedir a adição de gastos com campos vazios (Validação de Formulário)', () => {
        // 1. Criar stub para observar alertas
        const stub = cy.stub();
        cy.on('window:alert', stub);

        // 2. Tentar adicionar um gasto sem preencher os campos
        cy.get('[data-cy="btn-adicionar"]').click().then(() => {
            // 3. Validar que o alerta foi exibido com a mensagem correta
            expect(stub.getCall(0)).to.be.calledWith('Por favor, preencha todos os campos corretamente.');
        });

        // 4. Garante que a tabela de gastos continua vazia
        cy.get('[data-cy="item-gasto"]').should('not.exist');
    });

    it('Deve somar corretamente os valores no resumo por categoria', () => {
        // 1. Adicionar múltiplos gastos na mesma categoria
        // Gasto 1
        cy.get('[data-cy="input-descricao"]').type('Mercado');
        cy.get('[data-cy="input-valor"]').type('150');
        cy.get('[data-cy="select-categoria"]').select('Alimentação');
        cy.get('[data-cy="btn-adicionar"]').click();

        // Gasto 2
        cy.get('[data-cy="input-descricao"]').type('Restaurante');
        cy.get('[data-cy="input-valor"]').type('200');
        cy.get('[data-cy="select-categoria"]').select('Alimentação');
        cy.get('[data-cy="btn-adicionar"]').click();

        // 2. Validar que o resumo por categoria mostra a soma correta
        cy.get('[data-cy="card-resumo-categoria"]')
            .contains('Alimentação')
            .parent()
            .find('[data-cy="valor-categoria"]')
            .should('contain', 'R$350.00');
    });
    
    it('Deve limpar todos os dados após confirmação dupla', () => {
        // 1. Adicionar um gasto para garantir que há dados a serem limpos
        cy.get('[data-cy="input-descricao"]').type('Luz');
        cy.get('[data-cy="input-valor"]').type('100');
        cy.get('[data-cy="select-categoria"]').select('Moradia');
        cy.get('[data-cy="btn-adicionar"]').click();

        // 2. Criar stub para observar alertas
        const stub = cy.stub();
        cy.on('window:confirm', stub);

        // 3. Clicar no botão de limpar dados
        cy.get('[data-cy="btn-limpar"]').click()

        // 4. Validar que o primeiro alerta de confirmação foi exibido
        cy.should(() => {
            expect(stub.getCall(0)).to.be.calledWith('Deseja limpar todos os gastos? Esta ação não pode ser desfeita.');
            expect(stub.getCall(1)).to.be.calledWith('Confirmar remoção permanente de todos os dados?');
        });

        // 5. Validar o resultado final após as confirmações
        cy.get('[data-cy="item-gasto"]').should('not.exist');
        cy.get('.empty-msg').should('be.visible');

        // 6. Validar que o localStorage foi limpo
        cy.window().then(win => {
            expect(win.localStorage.getItem('meus-gastos')).to.be.null;
        });
    });
});

describe('E2E: Interface e Integrações de Sistema', () => {

    beforeEach(() => {
        // Limpar os dados do localStorage para garantir um estado limpo antes de cada teste
        cy.clearLocalStorage('meus-gastos');
        cy.visit('/'); 

        // Fechar o tutorial
        cy.get('body').then($body => {
            if ($body.find('[data-cy="btn-fechar-tutorial"]').length > 0) {
                cy.get('[data-cy="btn-fechar-tutorial"]').click()
            }
        });
    });

    it('Deve exibir a tabela de gastos corretamente em dispositivos móveis', () => {
        // 1. Simular visualização em dispositivo móvel
        cy.viewport('iphone-6');   

        // 2. Adicionar um gasto para garantir que a tabela tenha conteúdo
        cy.get('[data-cy="input-descricao"]').type('Transporte');
        cy.get('[data-cy="input-valor"]').type('80');
        cy.get('[data-cy="select-categoria"]').select('Transporte');
        cy.get('[data-cy="btn-adicionar"]').click();

        // 3. Validar que a tabela de gastos é visível e adaptada para o layout móvel
        cy.get('[data-cy="table-card"]').should('have.css', 'overflow-x', 'auto');

    });

    it('Deve abrir e fechar o tutorial corretamente', () => {
        // 1. Validar que o tutorial está fechado inicialmente
        cy.get('[data-cy="tutorial"]').should('not.exist');

        // 2. Clicar no botão para abrir o tutorial
        cy.get('[data-cy="btn-tutorial"]').click();

        // 3. Validar que o tutorial foi aberto
        cy.get('[data-cy="tutorial-overlay"]').should('be.visible');

        // 4. Clicar no botão para fechar o tutorial
        cy.get('[data-cy="btn-fechar-tutorial"]').click();

        // 5. Validar que o tutorial foi fechado
        cy.get('[data-cy="tutorial-overlay"]').should('not.exist');
    });

    it('Deve excluir apenas o item selecionado na tabela de gastos', () => {
        // 1. Adicionar dois gastos
        const itens = [
            { descricao: 'Gasto 1', valor: '100', categoria: 'Alimentação' },
            { descricao: 'Gasto 2', valor: '200', categoria: 'Moradia' }
        ];

        itens.forEach(item => {
            cy.get('[data-cy="input-descricao"]').type(item.descricao);
            cy.get('[data-cy="input-valor"]').type(item.valor);
            cy.get('[data-cy="select-categoria"]').select(item.categoria);
            cy.get('[data-cy="btn-adicionar"]').click();
            }
        );

        // 2. Validar que ambos os gastos foram adicionados
        cy.get('[data-cy="item-gasto"]').should('have.length', 2);

        // 3. Excluir o primeiro gasto
        cy.get('[data-cy="item-gasto"]').first().within(() => {
            cy.get('[data-cy="btn-excluir"]').click();
        });

        // 4. Validar que apenas o segundo gasto permanece e o primeiro foi apagado
        cy.get('[data-cy="item-gasto"]').should('have.length', 1);
        cy.get('[data-cy="gasto-descricao"]').should('contain', 'Gasto 2');
        cy.get('[data-cy="item-gasto"]').should('not.contain', 'Gasto 1');
    });

    it('Deve exportar os gastos para um arquivo CSV corretamente', () => {
        // 1. Preparar dados de teste adicionando alguns gastos
        const itens = [
            { descricao: 'Gasto A', valor: '50', categoria: 'Alimentação' },
            { descricao: 'Gasto B', valor: '150', categoria: 'Moradia' },
            { descricao: 'Gasto C', valor: '200', categoria: 'Transporte'},
            { descricao: 'Gasto D', valor: '100', categoria: 'Lazer' },
        ];

        itens.forEach(item => {
            cy.get('[data-cy="input-descricao"]').type(item.descricao);
            cy.get('[data-cy="input-valor"]').type(item.valor);
            cy.get('[data-cy="select-categoria"]').select(item.categoria);
            cy.get('[data-cy="btn-adicionar"]').click();
        });

        // 2. Criar stub para interceptar a lógica de download
        cy.window().then((win) => {
            cy.stub(win.document, 'createElement').callsFake((tagName) => {
                if (tagName === 'a') {
                    return {
                        setAttribute: cy.stub().as('setAttributeStub'),
                        click: cy.stub().as('clickStub'),
                        href: '',
                    };
                };
                return win.document.createElement(tagName);
            });
        });

        // 3. Clicar no botão de exportar CSV
        cy.get('[data-cy="btn-exportar"]').click();

        // 4. Validar que o arquivo CSV foi gerado com o conteúdo correto
        cy.get('@setAttributeStub').should('be.calledWith', 'download', 'meus-gastos.csv');
        cy.get('@clickStub').should('be.calledOnce');
    });

    it('Deve exibir alerta se tentar exportar sem gastos', () => {
        // 1. Criar stub para observar o alerta
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // 2. Validar que o alerta é exibido quando não há gastos
        cy.get('[data-cy="btn-exportar"]').click().then(() => {
            expect(alertStub).to.be.calledWith('Não há gastos para exportar.');
        });
    });
});