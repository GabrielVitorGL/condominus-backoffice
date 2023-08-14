"use client";
import TextField from './components/TextField'
import Button from './components/Button'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';

export default function Login() {
  const [isLoading, setLoading] = useState<boolean>(false);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-main">
      <form className="relative flex w-80 h-80 flex-col items-center">
      <Button></Button>
      <TextField
        name="username"
        label="E-mail"
        icon={PersonIcon}
        type="email"
        className="mb-10 text-white"
        //error={authError}
        required
      />
      <TextField
        name="password"
        label="Senha"
        icon={LockIcon}
        type="password"
        className="mb-7 text-white"
        //error={authError}
        required
      />
      {/* <div className="h-10 max-w-full text-center">
        {!!errorMessages &&
          errorMessages.map((message, index) => (
            <span key={index} className="text-xs font-bold tracking-wide text-error">
              {message}
            </span>
          ))}
      </div> */}
      <Button loading={isLoading} label="ENTRAR" type="submit" className="mt-7 w-full" />
      <Button
        variant="simple"
        label="Esqueci minha senha"
        className="mt-4"
       // onClick={onResetPasswordClick}
      />
      </form>
    </main>
  )
}
