import ReactDOM from "react-dom/client";
import './index.css';

import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { ThemeProvider } from "./components/context/theme-provider";

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider defaultTheme='system' storageKey="vite-ui-theme">    
    <RouterProvider router={router} />
  </ThemeProvider>
);
