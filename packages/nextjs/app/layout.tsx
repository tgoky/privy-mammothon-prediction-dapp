import ClientOnlyPrivy from "./PrivyProvider";
import "@rainbow-me/rainbowkit/styles.css";
import { NotificationProvider } from "~~/app/context/NotificationContext";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// Import the Privy wrapper

export const metadata = getMetadata({
  title: "Muffled Bird",
  description: "Be a Muffled Bird on the Monad Market",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nosifer&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Scribble&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ClientOnlyPrivy>
          <ThemeProvider enableSystem>
            <NotificationProvider>
              <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            </NotificationProvider>
          </ThemeProvider>
        </ClientOnlyPrivy>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
