import React, { useState } from 'react';
import { analisarDadosExcel } from './logic/analyzer';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function App() {
  const [analise, setAnalise] = useState(null);

  const onFileChange = async (e) => {
    const res = await analisarDadosExcel(e.target.files[0]);
    setAnalise(res);
  };

  const chartData = {
    labels: analise?.ranking.map(r => r.termo) || [],
    datasets: [{
      label: 'Repetições',
      data: analise?.ranking.map(r => r.qtd) || [],
      backgroundColor: '#3b82f6'
    }]
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <h1>Analisador Inteligente de HSSE</h1>
      <input type="file" accept=".xlsx" onChange={onFileChange} />

      {analise && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Ponto Focal Detectado: <span style={{color: 'red'}}>{analise.pontoFocal.toUpperCase()}</span></h2>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>Proposta de Ação:</h3>
            <p>Com base na frequência de "{analise.pontoFocal}", recomenda-se criar uma campanha de DDS focada em conscientização operacional e revisão dos procedimentos de {analise.pontoFocal}.</p>
          </div>
          <div style={{ maxWidth: '600px' }}>
            <Bar data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;