import { MediaRenderer, shortenIfAddress } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { Label } from "flowbite-react"

type NFTCardProps = {
    nft: NFT;
};

const NFTCard = ({ nft }: NFTCardProps) => {
    return (
        <div className="dark:bg-slate-800 bg-white border-solid p-4 rounded-lg  border border-slate-50 dark:border-slate-600 cursor-pointer transition-all ease-in-out dark:hover:bg-slate-700 hover:bg-slate-50">
            <div className="h-48 relative overflow-hidden flex items-start justify-center bg-white rounded-md">

                {
                    nft && (
                        <MediaRenderer
                            src={nft.metadata.image}
                            className="object-cover w-full h-full  hover:scale-110 transition-all ease-in-out"
                        />
                    )
                }
            </div>
            <div className="mt-4 flex flex-col">
                <Label className="text-xl font-bold">{nft?.metadata.name ?? ""}</Label>
                <Label className="text-sm font-semibold ">Owned by: {shortenIfAddress(nft?.owner ?? "")}</Label>
            </div>
        </div>
    )
};
export default NFTCard