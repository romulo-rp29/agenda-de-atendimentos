// src/app/layout.tsx

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
return (
    <html lang="pt-br">
        <head />
        <body>
            {children}
        </body>
    </html>
  );
}
