"use client";
import Image from "next/image";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { Person, Lock } from "@mui/icons-material/";
import { SetStateAction, useState } from "react";
import CondominusLogo from "../../assets/logo.png";
import { useRouter } from "next/navigation";
import authProvider from "../../providers/authProvider";

export default function Login() {
  // const router = useRouter();

  // if (localStorage.getItem("accessToken")) {
  //   router.replace("/backoffice");
  // }

  const [activeContent, setActiveContent] = useState<"login" | "resetPassword">(
    "login"
  );

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let content: React.ReactNode = null;
  if (activeContent === "login") {
    content = (
      <LoginContent
        onResetPasswordClick={() => setActiveContent("resetPassword")}
      />
    );
  }

  if (activeContent === "resetPassword") {
    content = (
      <ResetPasswordContent onBackToLogin={() => setActiveContent("login")} />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-main py-20">
      <Image
        src={CondominusLogo}
        alt="Condominus Logo"
        className="mt-14 mb-14 w-80"
      />
      {content}
    </main>
  );
}

function LoginContent({
  onResetPasswordClick,
}: {
  onResetPasswordClick: () => void;
}) {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    event.preventDefault();
    setLoading(true);
    setErrorMessages([]);

    const formData = new FormData(event.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData.entries());

    try {
      await authProvider.login({
        username: formObject.username as string,
        password: formObject.password as string,
      });
    } catch (error) {
      console.log(error);
      console.log((error as any).response?.status);

      if ((error as any).response?.status == 400) {
        setErrorMessages(["Usuário ou senha inválidos."]);
      } else {
        setErrorMessages(["Ocorreu um erro inesperado. Tente novamente"]);
      }

      setLoading(false);
      return;
    }

    router.push("/moradores");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex w-80 h-80 flex-col items-center"
    >
      <TextField
        name="username"
        label="E-mail"
        icon={<Person />}
        type="email"
        className="mb-10 text-white"
        error={!!errorMessages}
        required
      />
      <TextField
        name="password"
        label="Senha"
        icon={<Lock />}
        type="password"
        className="mb-4 text-white"
        error={!!errorMessages}
        required
      />
      {errorMessages.length > 0 && (
        <div className="h-10 max-w-full text-center">
          {errorMessages.map((message, index) => (
            <span
              key={index}
              className="text-sm font-medium text-black tracking-wide text-error"
            >
              {message}
            </span>
          ))}
        </div>
      )}
      <Button
        loading={isLoading}
        label="ENTRAR"
        type="submit"
        className="mt-7 w-full"
      />
      {/* <Button
        variant="simple"
        label="Esqueci minha senha"
        className="mt-4"
        onClick={onResetPasswordClick}
      /> */}
    </form>
  );
}

function ResetPasswordContent({
  onBackToLogin,
}: {
  onBackToLogin: () => void;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const successMessage =
    "Muito obrigado! Caso seu e-mail esteja cadastrado conosco, você receberá uma mensagem em breve.";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessages([]);
    setShowSuccessMessage(false);

    const formData = new FormData(event.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData.entries());
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex w-80 flex-col items-center"
    >
      <p className="mb-8 text-center text-gray-200">
        Digite abaixo o seu e-mail e enviaremos um link para cadastrar uma nova
        senha:
      </p>
      <TextField
        name="username"
        label="E-mail"
        icon={<Person />}
        type="email"
        className="mb-4 text-white"
        required
      />
      <div className="max-w-full text-center">
        {!!errorMessages &&
          errorMessages.map((message, index) => (
            <span
              key={index}
              className="text-xs font-bold tracking-wide text-error"
            >
              {message}
            </span>
          ))}
      </div>
      {showSuccessMessage && (
        <div className="mb-4 max-w-full text-center">
          <span className="font-bold tracking-wide text-gray-200">
            {successMessage}
          </span>
        </div>
      )}
      <Button
        loading={isLoading}
        label="ENVIAR"
        type="submit"
        className="mt-7 w-full"
      />
      <Button
        variant="simple"
        label="Voltar"
        className="mt-4"
        onClick={onBackToLogin}
      />
    </form>
  );
}
