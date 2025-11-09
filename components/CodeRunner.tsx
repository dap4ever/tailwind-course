"use client";
import { useEffect, useRef, useState } from 'react';

interface CodeRunnerProps {
  initialCode: string;
  height?: number;
  storageKey?: string; // chave para persistir código do usuário
}

export default function CodeRunner({ initialCode, height = 140, storageKey }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Carrega código salvo
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`coderunner:${storageKey}`);
      if (saved) setCode(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    // Setup iframe sandbox for safe execution
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument!;
    const html = `<!doctype html><html><body><pre id="log"></pre><script>
      (function(){
        const log = document.getElementById('log');
        const origLog = console.log;
        function write(...args){
          const line = args.map(a => typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' ');
          log.textContent += line + '\n';
        }
        console.log = write;
        window.onerror = function(message){ write('Error:', message); };
        window.addEventListener('message', (e) => {
          log.textContent='';
          try { eval(e.data); } catch(err){ write('Error:', err.message); }
        });
      })();
    <\/script></body></html>`;
    doc.open();
    doc.write(html);
    doc.close();
  }, []);

  function run() {
    setOutput('');
    iframeRef.current?.contentWindow?.postMessage(code, '*');
    if (storageKey) {
      localStorage.setItem(`coderunner:${storageKey}`, code);
    }
  }

  return (
    <div className="border rounded">
      <textarea
        className="w-full p-2 text-sm font-mono border-b outline-none resize-y"
        style={{ minHeight: height }}
        value={code}
        onChange={e => {
          const val = e.target.value;
          setCode(val);
          if (storageKey) {
            // Persist em digitações menores para não perder progresso
            localStorage.setItem(`coderunner:${storageKey}`, val);
          }
        }}
      />
      <div className="flex items-center gap-3 p-2 bg-slate-50 border-b">
        <button onClick={run} className="px-3 py-1 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700">Executar</button>
        <span className="text-xs text-gray-600">Use console.log para ver saídas.</span>
      </div>
      <iframe ref={iframeRef} className="w-full h-40"></iframe>
    </div>
  );
}
