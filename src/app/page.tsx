import { CoinCalcCalculator } from '@/components/coin-calc-calculator';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex min-h-screen flex-col items-center bg-background p-4 py-12 sm:p-8 md:p-12">
        <div className="w-full max-w-5xl space-y-8">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
              CFee v1
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              The simplest meme coin trading platform fee calculator.
            </p>
          </header>
          <CoinCalcCalculator />
        </div>
      </main>
      <footer className="w-full bg-background p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Created by{' '}
          <span
            className="text-primary hover:underline"
          >
            @r2hdn
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          this is not a financial advice, do your own research.
        </p>
      </footer>
    </>
  );
}
