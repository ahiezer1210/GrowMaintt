import { router, usePathname } from "expo-router";
import { createContext, useContext, useEffect, useRef } from "react";

const NavigationHistoryContext = createContext();

export function NavigationHistoryProvider({ children }) {
  const pathname = usePathname();
  const history = useRef([]);

  useEffect(() => {
    if (!pathname) return;

    const lastPath = history.current[history.current.length - 1];

    if (lastPath !== pathname) {
      history.current.push(pathname);
    }

    if (history.current.length > 30) {
      history.current.shift();
    }
  }, [pathname]);

  const goBack = () => {
    if (history.current.length > 1) {
      history.current.pop();

      const previousPath = history.current[history.current.length - 1];

      if (previousPath && previousPath !== pathname) {
        router.replace(previousPath);
        return;
      }
    }

    router.back();
  };

  return (
    <NavigationHistoryContext.Provider value={{ goBack }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  return useContext(NavigationHistoryContext);
}
