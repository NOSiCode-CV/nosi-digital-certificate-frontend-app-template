import {
  useAddress,
  useWallet,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), {
  ssr: false
});

import CertificateGridList from "@/ui/CertificateGridList";
import ChatBox from "@/ui/Chat";
import Certificate from "@/models/Certificate.model";
import CMSClient from "@/client/CMSClient";
import NavBar from "@/ui/NavBar";
import RightDrawer from "@/ui/RightDrawer";

interface HomeProps {
  certificates: Certificate[];
}

const Account: React.FC<HomeProps> = ({ certificates }) => {

  const router = useRouter();

  const address = useAddress();

  const wallet = useWallet()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [isMinting, setIsMinting] = useState<boolean>(false)

  const [swalProps, setSwalProps] = useState({});

  const [currentUserWalletAddress, setCurrentUserWalletAddress] = useState<string | null>()

  useEffect(() => {
    setCurrentUserWalletAddress((wallet as any)?.connector.user.walletAddress ?? null);
    if (!address) {
      router.push("/");
    }
  }, [router, address, wallet]);

  const handleMint = async (certificate: Certificate) => {

    try {

      setIsMinting(true);
      const formData = new FormData();
      formData.append("name", certificate.courseName);
      formData.append("description", certificate.courseDescription);
      formData.append("recipientEmail", certificate.recipientEmail);
      formData.append("issueDate", certificate.issueDate);
      formData.append("recipientName", certificate.recipientName);
      formData.append("address", address ?? "");
      const response = await fetch("/api/mintNFT", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      await fetch('/api/add-to-db', {
        "method":"POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(certificate),
      })
      // Handle successful response
      setSwalProps({
        show: true,
        title: 'Sucesso',
        text: 'NFT gerado',
        icon: "success"
      });

    } catch (error) {
      setSwalProps({
        show: true,
        title: 'Ops',
        text: 'Unexpected server response',
        icon: "error"
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="pt-20">

      <SweetAlert2 {...swalProps} onConfirm={() => {
        setSwalProps({ ...swalProps, show: false })
      }} />


      {
        isMinting && <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-50 bg-opacity-55 z-50">
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }

      {/* TOP NAVBAR */}
      <NavBar />

      <RightDrawer
        isOpen={isOpen}
        certificates={certificates}
        onMint={(certificate) => handleMint(certificate)}
        onClose={() => {
          setIsOpen(!isOpen)
        }} />


      {/* LIST */}
      <div className="container-fluid mx-auto bg-slate-200 dark:bg-slate-700">
        <div className="flex" id="main-body-list">
          <div className="flex-1 flex flex-col">
            {
              currentUserWalletAddress && <CertificateGridList
                address={currentUserWalletAddress}
                onImport={() => {
                  setIsOpen(!isOpen)
                }}
              />
            }
          </div>

          {/* CHAT BOX */}
          <div className="w-[400px]" id="chat-box">
            <ChatBox />
          </div>
        </div>

      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (req: any) => {

  const certificates = await CMSClient.list(req.query.userEmail ?? "")

  return {
    props: {
      certificates
    },
  };


};

export default Account;
