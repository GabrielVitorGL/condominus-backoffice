import Image from 'next/image'
import TextField from './components/TextField'

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-main">
      <form className="relative flex w-80 h-80 flex-col items-center bg-white">
      <TextField></TextField>
    </form>
    </main>
  )
}
