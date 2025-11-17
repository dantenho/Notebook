import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

// Initialize mermaid with proper configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    useMaxWidth: true,
  },
  gantt: {
    useMaxWidth: true,
  },
});

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (elementRef.current && chart) {
      const renderChart = async () => {
        try {
          elementRef.current!.innerHTML = '';
          const { svg } = await mermaid.render(idRef.current, chart);
          elementRef.current!.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          elementRef.current!.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Erro ao renderizar diagrama Mermaid:</strong>
              <pre class="mt-2 text-sm">${error}</pre>
            </div>
          `;
        }
      };

      renderChart();
    }
  }, [chart]);

  return <div ref={elementRef} className="mermaid-container my-4" />;
}
