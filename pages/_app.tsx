import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import { Flowbite } from "flowbite-react";
import { NEXT_PUBLIC_TEMPLATE_CLIENT_ID } from "../constants/constants";



// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = PolygonAmoyTestnet;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="bg-slate-100 dark:bg-slate-900">

      <Flowbite>




        <ThirdwebProvider
          clientId={NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
          activeChain={activeChain}
          supportedWallets={[embeddedWallet(
            {
              auth: {
                options: ["email", "google"],
              },
            }
          )]}
        >
          <Component {...pageProps} />
        </ThirdwebProvider>
      </Flowbite>
    </main>
  );
}

export default MyApp;
