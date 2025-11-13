// Configuração do Recharts para suprimir avisos de locale
// Este arquivo deve ser importado antes de usar componentes do Recharts

if (typeof window !== "undefined") {
  // Suprimir avisos específicos do Recharts
  const originalWarn = console.warn;
  const originalError = console.error;
  
  const shouldSuppress = (message: unknown): boolean => {
    if (typeof message !== "string") return false;
    return (
      message.includes("Locale zh-CN") ||
      message.includes("has different keys") ||
      message.includes("The width(-1) and height(-1)") ||
      message.includes("please check the style of container")
    );
  };
  
  console.warn = (...args: unknown[]) => {
    if (shouldSuppress(args[0])) {
      return; // Suprimir este aviso específico
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args: unknown[]) => {
    if (shouldSuppress(args[0])) {
      return; // Suprimir este erro específico
    }
    originalError.apply(console, args);
  };
}

