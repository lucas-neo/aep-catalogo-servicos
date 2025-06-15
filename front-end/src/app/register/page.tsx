import { RegisterForm } from "@/components/register-form";
import Image from "next/image"
import shortLogo from "@/assets/short-logo.svg"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image 
            src={shortLogo} 
            alt="Logo da Plataforma"
            width={120} 
            height={60}
            className="h-auto w-auto max-w-60"
          />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
