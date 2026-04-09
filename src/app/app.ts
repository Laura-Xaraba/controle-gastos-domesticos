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

}
