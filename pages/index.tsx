import { ConnectWallet, useAddress, useWallet } from "@thirdweb-dev/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import { Label, DarkThemeToggle } from "flowbite-react";


const Home: NextPage = () => {
  const router = useRouter();
  const address = useAddress();
  const wallet = useWallet()


  useEffect(() => {
    if (address) {

      // TODO: secure
      const userEmail = `/account?userEmail=${(wallet as any).connector?.user.authDetails.email}`
      router.push(userEmail);
    }
  }, [router, address]);

  return (

    <div>
      <div className="fixed left-0 top-0 z-50">
        <DarkThemeToggle />
      </div>

      <div className="w-full lg:grid h-screen overflow-hidden lg:grid-cols-2 z-10  ">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <Label className="text-center w-full text-2xl mb-6">Autenticar</Label>
            <div className="grid gap-4">
              <ConnectWallet className=" bg-slate-900" />
            </div>
            <Label className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </Label>
          </div>
        </div>
        <div className="hidden bg-muted lg:block h-full overflow-hidden">
          <Image
            src="/login-bg.jpeg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.8]"
          />
        </div>
      </div>
    </div> 
  ) 
};

export default Home;
