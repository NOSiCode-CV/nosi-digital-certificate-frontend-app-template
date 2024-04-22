import { useContract, useOwnedNFTs } from '@thirdweb-dev/react';
import React from 'react'
import NFTCard from '../../NFTCard';
import { Label, Spinner } from 'flowbite-react'
import { NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS } from '../../../constants/constants';

interface IProps {
    address: string;
    onImport: () => void
}

function CertificateGridList({ address, onImport }: IProps) {

    const { contract } = useContract(NEXT_PUBLIC_NFT_COLLECTION_CONTRACT_ADDRESS ?? "");

    const { data = [], isLoading, error } = useOwnedNFTs(contract, address);

    const filteredCertificates = data;

    return (
        <div className='px-4 pt-6 pb-4'>
            <div className='flex justify-between items-center mb-2'>
                <Label className="text-3xl font-bold">My Digital Certificates</Label>
                <button className='p-2 bg-emerald-600 flex items-center justify-center gap-2  px-4' onClick={onImport}>
                    <Label className='text-white' >Importar Certificado</Label>
                </button>
            </div>

            {filteredCertificates && filteredCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredCertificates.map((nft) => (
                        <NFTCard
                            key={nft.metadata.id}
                            nft={nft}
                        />
                    ))} </div>
            ) : (
                <div className='w-full h-20 flex items-center justify-center'>
                    {
                        isLoading ? <Spinner /> : <Label className='text-xl font-semibold'>No NFTs found</Label>
                    }
                </div>
            )}
        </div>
    )
}

export default CertificateGridList