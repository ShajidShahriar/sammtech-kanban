import { Sidebar } from '@/components/layout/Sidebar';
import { Main } from '@/components/layout/Main';

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans text-sm antialiased" >
      <Sidebar />
      <Main />
    </div>
  );
}
