import React from "react";
import Link from "next/link";
import { MonadLogo } from "./assets/MonadLogo";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 bg-black px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              {/* TODO: add the scaffold-eth-monad repo link */}
              <a href="https://x.com/blockhashlabs" target="_blank" rel="noreferrer" className="link">
                @blockhashlabs
              </a>
            </div>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p>and</p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://monad.xyz/"
                target="_blank"
                rel="noreferrer"
              >
                <MonadLogo className="w-3 h-5 pb-1" />
                <span className="link">Forma</span>
              </a>
            </div>
            <span>·</span>
            <div className="text-center"></div>
          </div>
        </ul>
      </div>
    </div>
  );
};
