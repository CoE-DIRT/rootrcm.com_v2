export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('root-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
