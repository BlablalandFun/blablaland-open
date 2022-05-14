import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app'
import { AuthWrapper } from '../components/AuthStore';

function MyApp({ Component, pageProps }: AppProps) {
  return <AuthWrapper><Component {...pageProps} /></AuthWrapper>
}
export default MyApp
