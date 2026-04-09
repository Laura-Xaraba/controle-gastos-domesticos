import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gasto } from './core/models/gasto.model';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent implements OnInit {
  //Lista sinalizada de gastos
  listaGastos = signal<Gasto[]>([]);

  //Objeto simples para armazenar os dados do formulário
  novoGasto: Gasto = {
    descricao: '',
    valor: 0,
    categoria: ''
  };

  // Valor "computado" para o total de gastos, que se atualiza automaticamente quando a lista de gastos muda
  totalGeral = computed(() => {
    return this.listaGastos().reduce((soma, item) => soma + item.valor, 0);
  });

  ngOnInit(): void {
    const dadosSalvos = localStorage.getItem('meus-gastos');
    if (dadosSalvos) {
      this.listaGastos.set(JSON.parse(dadosSalvos));
    }
  }

  // Método para adicionar um novo gasto à lista
  adicionarGasto() {
    // 1. Verificação de segurança
    // Trim remove espaços em branco no início e no final da descrição
    //Verifica se a descrição não está vazia, o valor é positivo e a categoria foi selecionada
    if (!this.novoGasto.descricao.trim() || this.novoGasto.valor <= 0 || !this.novoGasto.categoria) {
      alert('Por favor, preencha todos os campos corretamente. O valor deve ser maior que zero.');
      return;
    }

    // 2. Quando a validação passar, o gasto é adicionado à lista de gastos
    this.listaGastos.update(atual => [...atual, { ...this.novoGasto }]);

    // 3. Persistência dos dados no localStorage e limpeza do formulário
    localStorage.setItem('meus-gastos', JSON.stringify(this.listaGastos()));
    this.novoGasto = { descricao: '', valor: 0, categoria: '' };
  }


  // Método para remover um gasto da lista, recebendo o índice do item a ser removido
  removerGasto(index: number) {
    //1. Confirmação de exclusão
    if (confirm('Tem certeza que deseja remover este gasto?')) {

      //2. .update para gerar uma nova lista sem o item removido
      // Filter cria uma nova lista incluindo apenas os itens cujo índice é diferente do índice do item a ser removido
      this.listaGastos.update(atual => atual.filter((_, i) => i !== index));

      //3. Atualização do localStorage para refletir a remoção
      localStorage.setItem('meus-gastos', JSON.stringify(this.listaGastos()));
    }
  }

  // Sinal computado para calcular o total de gastos por categoria
  resumoPorCategoria = computed(() => {
    const resumo: { [key: string]: number } = {};

    // Percorre a lista de gastos e acumula o valor total para cada categoria
    this.listaGastos().forEach(gasto => {
      if (!resumo[gasto.categoria]) {
        resumo[gasto.categoria] = 0;
      }
      resumo[gasto.categoria] += gasto.valor;
    });

    // Retorna um array de objetos par facilitar o uso de @for na template
    return Object.keys(resumo).map(key => ({
      nome: key,
      total: resumo[key]
    }));
  });

  // Método para exportar os gastos em formato CSV
  exportarCSV() {
    if (this.listaGastos().length === 0) return alert('Não há gastos para exportar.');

    // Cabeçalho do CSV
    const cabecalho = 'Descrição,Valor,Categoria\n';

    // Linhas de dados
    const linhas = this.listaGastos().map(g =>
      `${g.descricao},${g.valor},${g.categoria}`
    ).join('\n');

    // Criação do blob e link para download
    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'meus-gastos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Método para limpar todos os gastos, com confirmação
  limparTudo() {
    // 1. Confirmação de limpeza, primeira trava de segurança
    const confirmar = confirm('Tem certeza que deseja limpar todos os gastos? Esta ação não pode ser desfeita.');
    
    if (confirmar) {
      // 2. Segunda trava
      const certeza = confirm('Esta é a última confirmação. Todos os seus gastos serão permanentemente removidos. Deseja continuar?');
    
      if (certeza) {
        // 3. Reset do Signal e limpeza do localStorage
        this.listaGastos.set([]);
        localStorage.removeItem('meus-gastos');
      }
    }
  }

}