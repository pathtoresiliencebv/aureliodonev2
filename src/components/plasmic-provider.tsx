"use client";

import { PlasmicCanvasHost } from "@plasmicapp/react-web/lib/host";
import { PlasmicRootProvider } from "@plasmicapp/react-web";

interface PlasmicProviderProps {
  children: React.ReactNode;
}

export function PlasmicProvider({ children }: PlasmicProviderProps) {
  return (
    <PlasmicRootProvider>
      {children}
    </PlasmicRootProvider>
  );
}

export function PlasmicCanvasHostComponent() {
  return <PlasmicCanvasHost />;
}
