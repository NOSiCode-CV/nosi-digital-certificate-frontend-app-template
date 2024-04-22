import React from 'react'
import { Drawer, Label } from "flowbite-react";
import Certificate from '@/models/Certificate.model';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onMint: (certificate: Certificate) => void;
    certificates: Certificate[]
}
function RightDrawer({ isOpen, onClose, certificates, onMint }: IProps) {
    return (
        <Drawer position="right" open={isOpen} onClose={onClose}>

            <Drawer.Header title="My Certificates" onClick={onClose} />

            <Drawer.Items>
                {
                    (certificates?.length != 0) && (
                        <div className="grid grid-cols-1 gap-4">
                            {certificates?.map((certificate) => (
                                <div key={certificate.recipientEmail} className="dark:bg-slate-600 bg-slate-100 p-4 rounded-md flex flex-col cursor-pointer">
                                    <Label className="text-xl font-semibold mb-1">{certificate.courseName}</Label>
                                    <Label className="mb-3 text-muted font-light">{certificate.courseDescription}</Label>
                                    <button className="p-2  text-white w-full bg-emerald-600  text-sm"
                                        onClick={() => onMint(certificate)}>
                                        Importar para a Carteira
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                }

                {
                    (certificates?.length == 0) && (
                        <div className='w-full h-20 flex items-center justify-center'>
                            <Label className='text-sm font-semibold'>No Certificates found</Label>
                        </div>
                    )
                }

            </Drawer.Items>
        </Drawer>
    )
}

export default RightDrawer