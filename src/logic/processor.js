export const categoriasHsse = [
  {
    id: 'ptw',
    label: 'Falha na Gestão de PTW',
    keywords: ['ptw', 'permissão', 'apr', 'liberação', 'assinatura'],
    campanha: 'Pare, Analise e Autorize: A importância da Permissão de Trabalho.',
    cor: '#e74c3c'
  },
  {
    id: 'epi',
    label: 'Falha na Gestão de EPI',
    keywords: ['epi', 'luva', 'óculos', 'capacete', 'botina', 'protetor'],
    campanha: 'Sua Proteção é Individual, mas a Responsabilidade é de Todos.',
    cor: '#f1c40f'
  },
  {
    id: 'altura',
    label: 'Risco de Trabalho em Altura',
    keywords: ['escada', 'andaime', 'cinto', 'talabarte', 'nível'],
    campanha: 'Mãos Livres e Três Pontos de Apoio: Evite Quedas.',
    cor: '#3498db'
  }
];

export const analisarDados = (listaObservacoes) => {
  let contagem = {};

  listaObservacoes.forEach(obs => {
    const texto = obs.toLowerCase();
    
    // Encontra a primeira categoria que dá match (respeitando a ordem do array)
    const categoria = categoriasHsse.find(cat => 
      cat.keywords.some(key => texto.includes(key))
    );

    const label = categoria ? categoria.label : 'Outras Observações';
    contagem[label] = (contagem[label] || 0) + 1;
  });

  return contagem;
};