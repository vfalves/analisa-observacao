import * as XLSX from 'xlsx';

// Função para extrair o ponto central e palavras-chave
export const analisarDadosExcel = (arquivo) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(planilha, { header: 1 });
      
      const textos = rows.flat().filter(t => typeof t === 'string' && t.length > 5);
      const frequencia = {};
      const stopwords = ['para', 'com', 'pelo', 'pela', 'está', 'estão', 'uma', 'ponto'];

      textos.forEach(texto => {
        const palavras = texto.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
        palavras.forEach(p => {
          if (p.length > 3 && !stopwords.includes(p)) {
            frequencia[p] = (frequencia[p] || 0) + 1;
          }
        });
      });

      // Ordena por repetição
      const ranking = Object.entries(frequencia)
        .map(([termo, qtd]) => ({ termo, qtd }))
        .sort((a, b) => b.qtd - a.qtd);

      resolve({
        ranking: ranking.slice(0, 10), // Top 10 palavras-chave
        pontoFocal: ranking[0]?.termo || "Não identificado",
        total: textos.length
      });
    };
    reader.readAsArrayBuffer(arquivo);
  });
};