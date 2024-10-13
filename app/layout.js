import "./globals.css";

export const metadata = {
  title: "Miyamizu Web",
  description: "Productos de Maquillaje & Cuidado Personal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
