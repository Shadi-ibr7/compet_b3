import LoginButton from '@/components/auth/LoginButton';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main>
        <div className="flex justify-between items-center">
          <h1>Welcome to Next.js</h1>
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
 