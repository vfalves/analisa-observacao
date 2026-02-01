import React, { useState } from 'react';
import { analisarDadosExcel, planosDeAcao } from './logic/analyzer';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import logoVa from './assets/va.png';

// Registra componentes dos gráficos (Barras e Pizza)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {
  const [analise, setAnalise] = useState(null);

  const handleFile = async (e) => {
    // Verifica se algum arquivo foi realmente selecionado
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      const res = await analisarDadosExcel(e.target.files[0]);
      setAnalise(res);
    } catch (err) {
      alert("Erro ao processar: " + err);
    }
  };

  // Cores vibrantes para os gráficos
  const coresDinamicas = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#f97316', '#71717a'
  ];

  const chartData = {
    labels: analise?.ranking.map(r => r.categoria) || [],
    datasets: [{
      label: 'Frequência Relativa (%)',
      data: analise?.ranking.map(r => r.percentual) || [],
      backgroundColor: coresDinamicas,
      borderColor: '#0f172a',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { labels: { color: '#ffffff', font: { size: 14 } } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` } }
    },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#ffffff' } },
      y: { ticks: { color: '#ffffff', font: { weight: 'bold' } } }
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img src={logoVa} alt="Logo" style={{ width: '150px' }} />
        <h1 style={{ margin: '10px 0 20px 0' }}>SafetyNet 360</h1>
        
        {/* --- NOVO BOTÃO DE UPLOAD PERSONALIZADO --- */}
        <div style={{ marginTop: '20px' }}>
          <input 
            type="file" 
            id="file-upload" 
            accept=".xlsx" 
            onChange={handleFile} 
            style={{ display: 'none' }} /* Esconde o input feio original */
          />
          <label 
            htmlFor="file-upload" 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              display: 'inline-block',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            📂 Clique aqui para Carregar a Planilha
          </label>
        </div>
        {/* ------------------------------------------ */}
        
      </header>

      {analise && (
        <main style={{ flex: 1 }}>
          {/* PÁGINA 1: DASHBOARD */}
          <section style={{ pageBreakAfter: 'always', marginBottom: '4rem' }}>
            <h2 style={{ textAlign: 'center', color: '#3b82f6', marginBottom: '2rem' }}>Dashboard de Frequência Relativa</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              {/* Gráfico de Barras */}
              <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#94a3b8', textAlign: 'center' }}>Ranking de Desvios (%)</h4>
                <Bar data={chartData} options={chartOptions} />
              </div>

              {/* Gráfico de Pizza */}
              <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ color: '#94a3b8', textAlign: 'center' }}>Distribuição Setorial</h4>
                <div style={{ width: '300px' }}>
                  <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #3b82f6' }}>
                    <th style={{ padding: '12px' }}>Categoria</th>
                    <th style={{ padding: '12px' }}>Frequência Relativa</th>
                  </tr>
                </thead>
                <tbody>
                  {analise.ranking.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '12px' }}>{item.categoria}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>{item.percentual}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PÁGINA 2: PLANO DE AÇÃO */}
          <section style={{ paddingTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', color: '#ef4444', marginBottom: '2rem' }}>Plano de Ação Estratégico</h2>
            <div style={{ background: '#1e293b', padding: '3rem', borderRadius: '12px', borderLeft: '15px solid #ef4444' }}>
              <h3 style={{ fontSize: '1.8rem' }}>Fator Crítico: {analise.topCategoria.categoria}</h3>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#cbd5e1', marginTop: '1.5rem' }}>
                {planosDeAcao[analise.topCategoria.categoria]}
              </p>
            </div>
            <button onClick={() => window.print()} style={{ marginTop: '3rem', width: '100%', padding: '1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Gerar Relatório Técnico (PDF)
            </button>
          </section>
        </main>
      )}

      <footer style={{ textAlign: 'center', marginTop: 'auto', padding: '2rem 0', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>
        <p>Desenvolvido por Victor Alves || 2026</p>
      </footer>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          button, input, label { display: none !important; } /* Esconde botões na impressão */
          div, section { background: white !important; color: black !important; box-shadow: none !important; border-color: #eee !important; }
          h2, h3, h4 { color: black !important; }
        }
      `}</style>
    </div>
  );
}

export default App;