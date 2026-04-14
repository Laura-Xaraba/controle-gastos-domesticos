import { Component, OnInit, signal, computed, Renderer2, inject } from '@angular/core';
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
  // Injeção do Renderer2 para manipulação de classes CSS
  private renderer = inject(Renderer2);

  // --- ESTADOS REATIVOS (Signals) ---
  darkMode = signal(false);
  listaGastos = signal<Gasto[]>([]);
  exibirTutorial = signal(false);
  abriu = false;

  // Objeto para vincular ao formulário via ngModel
  novoGasto: Partial<Gasto> = {
    descricao: '',
    valor: undefined,
    categoria: ''
  };

  // --- INTERAÇÕES DE UI ---
  toggleSeta(event: MouseEvent, element: HTMLSelectElement) {
  if (this.abriu) {
    this.abriu = false;
    element.blur(); // Tira o foco para garantir o reset
  } else {
    this.abriu = true;
  }
  }

  // --- VALORES COMPUTADOS (AUTOMÁTICOS) ---
  // Calcula o total geral sempre que a lista muda
  totalGeral = computed(() => {
    return this.listaGastos().reduce((soma, item) => soma + item.valor, 0);
  });

  // Agrupa gastos por categoria para o gráfico/cards
  resumoPorCategoria = computed(() => {
    const resumo: { [key: string]: number } = {};

    this.listaGastos().forEach(gasto => {
      if (!resumo[gasto.categoria]) {
        resumo[gasto.categoria] = 0;
      }
      resumo[gasto.categoria] += gasto.valor;
    });

    return Object.keys(resumo).map(key => ({
      nome: key,
      total: resumo[key]
    }));
  });

  ngOnInit() {
    this.inicializarDados();
    this.verificarTutorial();
    this.verificarTema();
  }

  // --- LÓGICA DE INICIALIZAÇÃO ---
  private inicializarDados() {
    const dadosSalvos = localStorage.getItem('meus-gastos');
    if (dadosSalvos) {
      this.listaGastos.set(JSON.parse(dadosSalvos));
    }
  }

  private verificarTutorial() {
    const tutorialVisualizado = localStorage.getItem('tutorial-visto');
    if (!tutorialVisualizado) {
      this.exibirTutorial.set(true);
    }
  }

  private verificarTema() {
    const temaSalvo = localStorage.getItem('tema-escuro');
    if (temaSalvo === 'true') {
      this.aplicarTema(true);
    }
  }

  // --- GERENCIAMENTO DE TEMA (DARK MODE) ---
  toggleDarkMode() {
    const novoEstado = !this.darkMode();
    this.aplicarTema(novoEstado);
  }

  private aplicarTema(escuro: boolean) {
    this.darkMode.set(escuro);
    localStorage.setItem('tema-escuro', escuro.toString());

    // Manipulação segura do DOM via Renderer2
    if (escuro) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  // --- GERENCIAMENTO DO TUTORIAL ---
  fecharTutorial() {
    this.exibirTutorial.set(false);
    localStorage.setItem('tutorial-visto', 'true');
  }
  
  abrirTutorial() {
    this.exibirTutorial.set(true);
  }

  // --- OPERAÇÕES DE GASTOS ---
  adicionarGasto() {
    const { descricao, valor, categoria } = this.novoGasto;

    if (descricao && valor !== undefined && valor !== null && categoria) {

      const gastoFinal: Gasto = {
        descricao: descricao,
        valor: Number(valor),
        categoria: categoria
      };

      this.listaGastos.update(lista => [...lista, gastoFinal]);

      this.novoGasto = {
        descricao: '',
        valor: undefined,
        categoria: '',
      };

    } else {
      alert("Por favor, preencha todos os campos corretamente.")
    }
  }

  removerGasto(index: number) {
    if (confirm('Tem certeza que deseja remover este gasto?')) {
      this.listaGastos.update(atual => atual.filter((_, i) => i !== index));
      this.salvarNoLocalStorage();
    }
  }

  private salvarNoLocalStorage() {
    localStorage.setItem('meus-gastos', JSON.stringify(this.listaGastos()));
  }

// --- UTILITÁRIOS ---
  exportarCSV() {
    if (this.listaGastos().length === 0) return alert('Não há gastos para exportar.');

    const cabecalho = 'Descrição,Valor,Categoria\n';
    const linhas = this.listaGastos().map(g =>
      `${g.descricao},${g.valor},${g.categoria}`
    ).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'meus-gastos.csv');
    link.click();
    URL.revokeObjectURL(url);
  }

  limparTudo() {
    const confirmar = confirm('Deseja limpar todos os gastos? Esta ação não pode ser desfeita.');
    if (confirmar) {
      const certeza = confirm('Confirmar remoção permanente de todos os dados?');
      if (certeza) {
        this.listaGastos.set([]);
        localStorage.removeItem('meus-gastos');
      }
    }
  }
}