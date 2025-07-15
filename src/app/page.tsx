import { CoinCalcCalculator } from '@/components/coin-calc-calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 py-12 sm:p-8 md:p-12">
      <div className="w-full max-w-5xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            CFee v1
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The simplest meme coin fee calculator for Solana.
          </p>
        </header>
        <CoinCalcCalculator />
      </div>
    </main>
  );
}
