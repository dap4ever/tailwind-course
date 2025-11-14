"use client";
import { useEffect, useRef, useState } from 'react';

interface CodeRunnerProps {
  initialCode: string;
  height?: number;
  storageKey?: string;
}

export default function CodeRunner({ initialCode, height = 140, storageKey }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Carrega código salvo
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`coderunner:${storageKey}`);
      if (saved) setCode(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    // Setup iframe sandbox
    if (!iframeRef.current) return;
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'log') {
        setOutput(prev => [...prev, e.data.message]);
      } else if (e.data.type === 'error') {
        setError(e.data.message);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    const doc = iframeRef.current.contentDocument!;
    const html = `<!doctype html><html><body><script>
      (function(){
        const origLog = console.log;
        console.log = function(...args){
          const message = args.map(a => 
            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
          ).join(' ');
          window.parent.postMessage({ type: 'log', message }, '*');
        };
        
        window.onerror = function(message){
          window.parent.postMessage({ type: 'error', message: String(message) }, '*');
          return true;
        };
        
        window.addEventListener('message', (e) => {
          if (e.data.type === 'execute') {
            try {
              eval(e.data.code);
            } catch(err) {
              window.parent.postMessage({ type: 'error', message: err.message }, '*');
            }
          }
        });
      })();
    <\/script></body></html>`;
    doc.open();
    doc.write(html);
    doc.close();
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function run() {
    setOutput([]);
    setError('');
    iframeRef.current?.contentWindow?.postMessage({ type: 'execute', code }, '*');
    if (storageKey) {
      localStorage.setItem(`coderunner:${storageKey}`, code);
    }
  }

  return (
    <div className="border rounded bg-white shadow-sm">
      {/* Instruções */}
      <div className="bg-blue-50 border-b border-blue-200 p-3">
        <p className="text-sm text-blue-900 font-medium mb-1">
          💻 Como usar o CodeRunner:
        </p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>1. Digite ou edite o código JavaScript abaixo</li>
          <li>2. Use <code className="bg-blue-100 px-1 rounded">console.log()</code> para mostrar resultados</li>
          <li>3. Clique em <strong>Executar</strong> para rodar o código</li>
          <li>4. Veja os resultados na área preta abaixo</li>
        </ul>
      </div>

      <textarea
        className="w-full p-3 text-sm font-mono border-b outline-none resize-y bg-gray-50"
        style={{ minHeight: height }}
        value={code}
        onChange={e => {
          const val = e.target.value;
          setCode(val);
          if (storageKey) {
            localStorage.setItem(`coderunner:${storageKey}`, val);
          }
        }}
        placeholder="Digite seu código JavaScript aqui...&#10;&#10;Exemplo:&#10;const nome = 'Maria';&#10;console.log(nome);"
      />
      <div className="flex items-center gap-3 p-3 bg-slate-50 border-b">
        <button 
          onClick={run} 
          className="px-4 py-2 text-sm font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-2"
        >
          ▶ Executar Código
        </button>
        <span className="text-xs text-gray-600">
          💡 Dica: Seu código é salvo automaticamente!
        </span>
      </div>
      
      {/* Área de Saída Visível */}
      <div className="bg-gray-900">
        <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold">📺 SAÍDA DO CONSOLE</span>
          {(output.length > 0 || error) && (
            <button
              onClick={() => {
                setOutput([]);
                setError('');
              }}
              className="text-xs text-gray-400 hover:text-white transition"
              title="Limpar saída"
            >
              🗑️ Limpar
            </button>
          )}
        </div>
        <div className="p-3 text-gray-100 font-mono text-sm min-h-[120px] max-h-[300px] overflow-auto">
          {output.length === 0 && !error && (
            <div className="text-gray-500 italic">
              ⏳ Aguardando execução... Clique em "Executar Código" acima!
            </div>
          )}
          {output.map((line, i) => (
            <div key={i} className="py-0.5 hover:bg-gray-800 px-1 -mx-1 rounded">
              <span className="text-green-400">→</span> {line}
            </div>
          ))}
          {error && (
            <div className="text-red-400 py-1 bg-red-900 bg-opacity-20 px-2 rounded border-l-2 border-red-500">
              <span className="font-bold">❌ Erro:</span> {error}
            </div>
          )}
        </div>
      </div>
      
      {/* Iframe oculto */}
      <iframe ref={iframeRef} className="hidden"></iframe>
    </div>
  );
}
