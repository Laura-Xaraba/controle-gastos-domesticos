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
    // Adiciona o novo gasto à lista usando o método "update" para garantir que a reatividade funcione corretamente
    this.listaGastos.update(atual => [...atual, { ...this.novoGasto }]);

    // Salva a lista atualizada no localStorage
    localStorage.setItem('meus-gastos', JSON.stringify(this.listaGastos()));

    // Limpa o formulário
    this.novoGasto = {
      descricao: '',
      valor: 0,
      categoria: ''
    };
  }
}
