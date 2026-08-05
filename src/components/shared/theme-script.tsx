export function ThemeScript() {
  // This script runs synchronously before paint to prevent FOUC.
  // It reads localStorage or prefers-color-scheme and sets the class on <html>.
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var resolved = theme;
        if (!theme || theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        var d = document.documentElement;
        d.classList.remove('light', 'dark');
        d.classList.add(resolved);
        d.style.colorScheme = resolved;
      } catch (e) {}
    })();
  `;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
