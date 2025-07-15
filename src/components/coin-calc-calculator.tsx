"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import {
  Coins,
  ShieldCheck,
  Gift,
  Flame,
  ReceiptText,
  ArrowRightLeft,
  Trash2,
  Landmark,
  TrendingUp,
  RefreshCw,
  Percent,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  buyAmount: z.coerce.number().min(0).default(0),
  buyingTax: z.coerce.number().min(0).max(100).default(0.75),
  priorityFeeBuy: z.coerce.number().min(0).default(0),
  bribeFeeBuy: z.coerce.number().min(0).default(0),
  gasFeeBuy: z.coerce.number().min(0).default(0),
  sellingTax: z.coerce.number().min(0).max(100).default(0.75),
  priorityFeeSell: z.coerce.number().min(0).default(0),
  bribeFeeSell: z.coerce.number().min(0).default(0),
  gasFeeSell: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof formSchema>;

const FeeInput = ({
  control,
  name,
  label,
  icon: Icon,
  placeholder = "0.00",
  step = "any",
}: {
  control: any;
  name: keyof FormData;
  label: string;
  icon: LucideIcon;
  placeholder?: string;
  step?: string;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </FormLabel>
        <FormControl>
          <Input
            type="number"
            step={step}
            min="0"
            placeholder={placeholder}
            {...field}
            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
            className="font-mono"
          />
        </FormControl>
      </FormItem>
    )}
  />
);

const ResultDisplay = ({
  label,
  value,
  icon: Icon,
  isFooter = false,
  className,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  isFooter?: boolean;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-between", className)}>
    <p className={`flex items-center gap-2 ${isFooter ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
      <Icon className="h-4 w-4" />
      {label}
    </p>
    <p className={`font-mono ${isFooter ? 'font-bold text-lg' : 'font-medium'}`}>
      {value.toFixed(6)} SOL
    </p>
  </div>
);

export function CoinCalcCalculator() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyAmount: undefined,
      buyingTax: 0.75,
      priorityFeeBuy: undefined,
      bribeFeeBuy: undefined,
      gasFeeBuy: undefined,
      sellingTax: 0.75,
      priorityFeeSell: undefined,
      bribeFeeSell: undefined,
      gasFeeSell: undefined,
    },
  });

  const [totalBuyFees, setTotalBuyFees] = useState(0);
  const [breakEvenSell, setBreakEvenSell] = useState(0);
  const [totalSellFees, setTotalSellFees] = useState(0);
  const [totalSpentInFees, setTotalSpentInFees] = useState(0);

  const watchedValues = form.watch();

  useEffect(() => {
    const {
      buyAmount = 0,
      buyingTax = 0,
      priorityFeeBuy = 0,
      bribeFeeBuy = 0,
      gasFeeBuy = 0,
      sellingTax = 0,
      priorityFeeSell = 0,
      bribeFeeSell = 0,
      gasFeeSell = 0,
    } = watchedValues;

    const buyingTaxRate = buyingTax / 100;
    const sellingTaxRate = sellingTax / 100;

    const buyingTaxValue = buyAmount * buyingTaxRate;
    const totalBuyFeesCalc = buyingTaxValue + priorityFeeBuy + bribeFeeBuy + gasFeeBuy;

    const otherFees = priorityFeeBuy + bribeFeeBuy + gasFeeBuy + priorityFeeSell + bribeFeeSell + gasFeeSell;
    const numerator = buyAmount + totalBuyFeesCalc + priorityFeeSell + bribeFeeSell + gasFeeSell;
    const denominator = 1 - sellingTaxRate;
    
    let breakEvenSellCalc = 0;
    if (denominator > 0 && buyAmount > 0) {
        breakEvenSellCalc = numerator / denominator;
    }

    const sellingTaxValue = breakEvenSellCalc * sellingTaxRate;
    const totalSellFeesCalc = sellingTaxValue + priorityFeeSell + bribeFeeSell + gasFeeSell;

    const totalFees = totalBuyFeesCalc + totalSellFeesCalc;

    setTotalBuyFees(totalBuyFeesCalc);
    setBreakEvenSell(breakEvenSellCalc);
    setTotalSellFees(totalSellFeesCalc);
    setTotalSpentInFees(totalFees);
  }, [watchedValues]);

  const handleReset = () => {
    form.reset({
      buyAmount: undefined,
      buyingTax: 0.75,
      priorityFeeBuy: undefined,
      bribeFeeBuy: undefined,
      gasFeeBuy: undefined,
      sellingTax: 0.75,
      priorityFeeSell: undefined,
      bribeFeeSell: undefined,
      gasFeeSell: undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Buy</CardTitle>
              <CardDescription>Enter your buy transaction details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <FeeInput control={form.control} name="buyAmount" label="Amount you put in (in SOL)" icon={Coins} step="0.1" />
              <FeeInput control={form.control} name="buyingTax" label="BUYING TAX (%)" icon={Percent} placeholder="0.75" step="0.25"/>
              <Separator />
              <FeeInput control={form.control} name="priorityFeeBuy" label="PRIORITY FEE ⛽" icon={ShieldCheck} />
              <FeeInput control={form.control} name="bribeFeeBuy" label="BRIBE FEE 🫴" icon={Gift} />
              <FeeInput control={form.control} name="gasFeeBuy" label="GAS FEE" icon={Flame} />
            </CardContent>
            <CardFooter className="pt-4 mt-auto">
              <ResultDisplay label="TOTAL BUY FEES" value={totalBuyFees} icon={ReceiptText} isFooter className="w-full"/>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Sell</CardTitle>
              <CardDescription>Fees for the break-even sell transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="space-y-2 rounded-lg border bg-secondary/50 p-4">
                  <ResultDisplay label="Break even Sell (in SOL)" value={breakEvenSell} icon={ArrowRightLeft} />
                  <p className="text-xs text-muted-foreground pt-1">This is the total SOL you need to sell for to cover all fees and initial investment.</p>
              </div>
               <FeeInput control={form.control} name="sellingTax" label="SELLING TAX (%)" icon={Percent} placeholder="0.75" step="0.25"/>
              <Separator />
              <FeeInput control={form.control} name="priorityFeeSell" label="PRIORITY FEE ⛽" icon={ShieldCheck} />
              <FeeInput control={form.control} name="bribeFeeSell" label="BRIBE FEE 🫴" icon={Gift} />
              <FeeInput control={form.control} name="gasFeeSell" label="GAS FEE" icon={Flame} />
            </CardContent>
            <CardFooter className="pt-4 mt-auto">
              <ResultDisplay label="TOTAL SELL FEES" value={totalSellFees} icon={ReceiptText} isFooter className="w-full"/>
            </CardFooter>
          </Card>
        </div>

        <Card className="w-full">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>A summary of your total costs to break even.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
                <ResultDisplay label="SOL INCINERATOR" value={totalSpentInFees} icon={Trash2} />
                <Separator/>
                <ResultDisplay label="TOTAL SPENT IN FEES" value={totalSpentInFees} icon={Landmark} />
                 <Separator/>
                <ResultDisplay label="PnL needed to Break Even" value={totalSpentInFees} icon={TrendingUp} />
            </CardContent>
            <CardFooter>
                 <Button type="button" variant="outline" onClick={handleReset} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
