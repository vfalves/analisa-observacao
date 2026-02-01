import * as XLSX from 'xlsx';

export const regrasHSSE = [
  { categoria: "EPI", termos: ["luva", "glove", "óculos", "glasses", "cinto", "harness", "máscara", "mask", "viseira", "faceshield", "capacete", "hard hat", "epi", "ppe", "respiratória", "respiratory", "auditiva", "hearing", "ear"] },
  { categoria: "Housekeeping", termos: ["espalhado", "limpeza", "sujeira", "óleo", "piso", "housekeeping"] },
  { categoria: "Barulho", termos: ["barulho", "noise"] },
  { categoria: "Segregação de Resíduos", termos: ["resíduo", "coletor", "lixo", "segregação"] },
  { categoria: "Incêndio", termos: ["inflamável", "saco", "centelha", "quente", "fogo", "incêndio"] },
  { categoria: "Produto Químico", termos: ["químico", "fds", "fispq", "fracionamento", "químicos"] },
  { categoria: "Fator Humano", termos: ["procedimento", "descumprindo", "comportamento", "inseguro", "fator humano"] },
  { categoria: "Ergonomia", termos: ["postura", "body", "posture", "movimentação", "movement", "manual", "peso", "ergonomia", "ergonomic", "handling"] },
  { categoria: "Lifting", termos: ["lifting", "içamento", "carga", "cargo", "weight", "chain block", "talha", "trolley", "carro", "carrinho", "palete", "pallet"] },
  { categoria: "Ferramentas e Equipamentos", termos: ["máquina", "machine", "tool", "ferramenta", "improviso", "danificada", "damaged"] },
  { categoria: "PTW", termos: ["ptw", "tra", "tbt", "isolamento", "isolation", "insulation", "permissão", "permit"] },
  { categoria: "Sinalização", termos: ["sinalização", "signalization", "placa", "board", "chain", "corrente", "barricade", "barreira"] },
  { categoria: "Drop", termos: ["drop", "queda"] }
];

// Planos de ação baseados em melhores práticas de mercado (Ex: ISO 45001, OSHA)
export const planosDeAcao = {
  "EPI": "Ação sugerida: Destacar em DDS a importância e responsabilidade pela guarda, uso e conservação de EPI. Destacar que a TRA deve ser seguida quanto aos EPI recomendados para cada etapa da atividade.",
  "Housekeeping": "Ação sugerida: Antes de finalizar a atividade o housekeeping deve ser atendido como parte da atividade do dia. Performing Authority deve ir até o local assegurar que o housekeeping foi realizado. Area Authority não deve aceitar encerramento ou suspensão da PTW até que o housekeeping esteja atendido.",
  "Barulho": "Ação sugerida: Reforçar sobre o silêncio na acomodação e as regras do navio. ",
  "Segregação de Resíduos": "Ação sugerida: Destacar em DDS sobre a responsabilidade de todos com a segregação de resíduos, seguindo o código de cores e identificação dos coletores. Avaliar se cabe a aplicação de uma campanha de segregação de resíduos.",
  "Incêndio": "Ação sugerida: Gestão de Trabalho a Quente (Hot Work Permit). Manter substâncias inflamáveis afastadas de superfícies quentes. Reciclar com os trabalhadores os cuidados relacionados a gestao de químicos, atenção com a compatibilidade entre os produtos. No interior de cabines e escritórios nunca deixar eletrônicos carregando sozinhos, sem a presença de uma pessoa monitorando. Cuidado com o funcionamento de máquinas e equipamentos (lavanderia como exemplo), para nunca deixá-los operando sem a presença de uma pessoa próxima. Localize e familiarize-se com as botoeiras de emergência para acionamento imediato em caso de necessidade.",
  "Produto Químico": "Ação sugerida: Adotar o padrão GHS para rotulagem. Manter inventário de FISPQ atualizado e bacias de contenção dimensionadas para 110% do volume maior.",
  "Fator Humano": "Ação sugerida: Implementar Observação Comportamental. Focar em reforço positivo e análise de pré-requisitos para erro humano (fadiga, pressões, complacência, distração).",
  "Ergonomia": "Ação sugerida: Análise Ergonômica do Trabalho (AET) conforme NR-17. Rodízio de tarefas e mobiliário ajustável para reduzir Distúrbios Osteomusculares (DORT).",
  "Lifting":"Assegurar o uso do correto equipamento de içamento, avaliar inspeção dentro do prazo e seguindo o código de cores.",
  "Ferramentas e Equipamentos": "Ação sugerida: Manutenção Preventiva e Preditiva. Inspecionar as condições dos maquinários e equipamentos antes do uso e após o uso. Nunca remova os dispositivos de segurança e não faça uso em caso de falhas identificasdas e substituição de ferramentas manuais por ergonômicas.",
  "PTW": "Ação sugerida: reforço junto ao Performing Authority sobre a avaliação dos documentos para manter a conformidade. Assegurar todas as assinaturas, cumprimento de todas as etapas, realizar as visitas periódicas quando aplicável e garantir a realização da TBT antes do início das atividades.",
  "Sinalização": "Ação sugerida: Manter as áreas corretamente isoladas, com a placa, correntes nas cores corretas e fixadas no pedestal adequado. Substitua as placas e sinalizações mantendo a integridade e legibilidade ",
  "Drop": "Ação sugerida: aplicar a campanha de drops. Reforçar nas inspeções de área a identificação de risco de drops.",
};

export const analisarDadosExcel = (arquivo) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      
      // 'header: "A"' permite acessar colunas por letra. A coluna M é acessada via 'M'.
      const rows = XLSX.utils.sheet_to_json(planilha, { header: "A" });

      const contagem = {};
      regrasHSSE.forEach(r => contagem[r.categoria] = 0);

      // Filtro de Status (Substandard/Hazard ou Improvement)
      // Ajuste o índice se a coluna de Status não for a mesma, mas aqui analisamos a linha inteira para o filtro
      const linhasValidas = rows.filter(row => {
        const rowString = JSON.stringify(row).toLowerCase();
        return rowString.includes("substandard") || rowString.includes("hazard") || rowString.includes("improvement");
      });

      linhasValidas.forEach(row => {
        // Pega exclusivamente o conteúdo da coluna M
        const textoM = String(row["M"] || "").toLowerCase();
        
        for (const regra of regrasHSSE) {
          if (regra.termos.some(t => textoM.includes(t))) {
            contagem[regra.categoria]++;
            break; 
          }
        }
      });

      const totalComMatch = Object.values(contagem).reduce((a, b) => a + b, 0);

      // Converte para Percentual e remove zeros
      const ranking = Object.entries(contagem)
        .filter(([_, qtd]) => qtd > 0)
        .map(([categoria, qtd]) => ({
          categoria,
          percentual: totalComMatch > 0 ? ((qtd / totalComMatch) * 100).toFixed(1) : 0,
          qtd
        }))
        .sort((a, b) => b.qtd - a.qtd);

      resolve({
        ranking,
        topCategoria: ranking[0] || { categoria: "N/A", percentual: 0 },
        totalAnalisado: totalComMatch
      });
    };
    reader.readAsArrayBuffer(arquivo);
  });
};