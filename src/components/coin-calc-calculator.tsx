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
  X,
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
  priorityFeeBuy: z.coerce.number().min(0).default(0.0001),
  bribeFeeBuy: z.coerce.number().min(0).default(0.0001),
  gasFeeBuy: z.coerce.number().min(0).default(0.001),
  sellingTax: z.coerce.number().min(0).max(100).default(0.75),
  priorityFeeSell: z.coerce.number().min(0).default(0.0001),
  bribeFeeSell: z.coerce.number().min(0).default(0.0001),
  gasFeeSell: z.coerce.number().min(0).default(0.001),
  solIncinerator: z.coerce.number().min(0).default(0.002),
});

type FormData = z.infer<typeof formSchema>;

const FeeInput = ({
  control,
  name,
  label,
  icon: Icon,
  placeholder = "0.00",
  step,
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
  unit,
  unitIcon: UnitIcon
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  isFooter?: boolean;
  className?: string;
  unit?: string;
  unitIcon?: LucideIcon;
}) => (
  <div className={cn("flex items-center justify-between", className)}>
    <p className={`flex items-center gap-2 ${isFooter ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
      <Icon className="h-4 w-4" />
      {label}
    </p>
    <p className={`font-mono flex items-center gap-1 ${isFooter ? 'font-bold text-lg' : 'font-medium'}`}>
      {value.toFixed(6)} 
      {unit && <span className="text-xs">{unit}</span>}
      {UnitIcon && <UnitIcon className="h-4 w-4" />}
    </p>
  </div>
);

export function CoinCalcCalculator() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyAmount: 0,
      buyingTax: 0.75,
      priorityFeeBuy: 0.0001,
      bribeFeeBuy: 0.0001,
      gasFeeBuy: 0.001,
      sellingTax: 0.75,
      priorityFeeSell: 0.0001,
      bribeFeeSell: 0.0001,
      gasFeeSell: 0.001,
      solIncinerator: 0.002,
    },
  });

  const [totalBuyFees, setTotalBuyFees] = useState(0);
  const [breakEvenSell, setBreakEvenSell] = useState(0);
  const [totalSellFees, setTotalSellFees] = useState(0);
  const [totalSpentInFees, setTotalSpentInFees] = useState(0);
  const [pnlNeeded, setPnlNeeded] = useState(0);

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
      solIncinerator = 0,
    } = watchedValues;

    // "total buy fees" formula is (("amount you put in sol" * ("buying tax"/100)) + "priority fee" + "bribe fee" + "gas fee")
    const buyingTaxValue = buyAmount * (buyingTax / 100);
    const totalBuyFeesCalc = buyingTaxValue + priorityFeeBuy + bribeFeeBuy + gasFeeBuy;

    // "Break even Sell" formula is ("total buy fees"+"amount you put in sol")
    const breakEvenSellCalc = totalBuyFeesCalc + buyAmount;

    // "total sell fees" formula is (("Break even Sell" * ("selling tax"/100)) + "priority fee" + "bribe fee" + "gas fee")
    const sellingTaxValue = breakEvenSellCalc * (sellingTax / 100);
    const totalSellFeesCalc = sellingTaxValue + priorityFeeSell + bribeFeeSell + gasFeeSell;

    // "total spent in fee" formula is ("total buy fees" + "total sell fees" - "sol incinerator")
    const totalSpentInFeesCalc = totalBuyFeesCalc + totalSellFeesCalc - solIncinerator;

    // "PnL needed to break even" formula is (("total spent in fee" /"amount you put in sol") * 100)
    let pnlNeededCalc = 0;
    if (buyAmount > 0) {
      pnlNeededCalc = (totalSpentInFeesCalc / buyAmount) * 100;
    }

    setTotalBuyFees(totalBuyFeesCalc);
    setBreakEvenSell(breakEvenSellCalc);
    setTotalSellFees(totalSellFeesCalc);
    setTotalSpentInFees(totalSpentInFeesCalc);
    setPnlNeeded(pnlNeededCalc);

  }, [watchedValues]);

  const handleReset = () => {
    form.reset({
      buyAmount: 0,
      buyingTax: 0.75,
      priorityFeeBuy: 0.0001,
      bribeFeeBuy: 0.0001,
      gasFeeBuy: 0.001,
      sellingTax: 0.75,
      priorityFeeSell: 0.0001,
      bribeFeeSell: 0.0001,
      gasFeeSell: 0.001,
      solIncinerator: 0.002,
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
              <FeeInput control={form.control} name="priorityFeeBuy" label="PRIORITY FEE ⛽" icon={ShieldCheck} step="0.00001" />
              <FeeInput control={form.control} name="bribeFeeBuy" label="BRIBE FEE 🫴" icon={Gift} step="0.00001" />
              <FeeInput control={form.control} name="gasFeeBuy" label="GAS FEE" icon={Flame} step="0.00100" />
            </CardContent>
            <CardFooter className="pt-4 mt-auto">
              <ResultDisplay label="TOTAL BUY FEES" value={totalBuyFees} icon={ReceiptText} isFooter unit="SOL" className="w-full"/>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Sell</CardTitle>
              <CardDescription>Fees for the break-even sell transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="space-y-2 rounded-lg border bg-secondary/50 p-4">
                  <ResultDisplay label="Break even Sell" value={breakEvenSell} icon={ArrowRightLeft} unit="SOL" />
                  <p className="text-xs text-muted-foreground pt-1">This is the total SOL you need to sell for to cover all fees and initial investment.</p>
              </div>
               <FeeInput control={form.control} name="sellingTax" label="SELLING TAX (%)" icon={Percent} placeholder="0.75" step="0.25"/>
              <FeeInput control={form.control} name="priorityFeeSell" label="PRIORITY FEE ⛽" icon={ShieldCheck} step="0.00001" />
              <FeeInput control={form.control} name="bribeFeeSell" label="BRIBE FEE 🫴" icon={Gift} step="0.00001" />
              <FeeInput control={form.control} name="gasFeeSell" label="GAS FEE" icon={Flame} step="0.00100" />
            </CardContent>
            <CardFooter className="pt-4 mt-auto">
              <ResultDisplay label="TOTAL SELL FEES" value={totalSellFees} icon={ReceiptText} isFooter unit="SOL" className="w-full"/>
            </CardFooter>
          </Card>
        </div>

        <Card className="w-full">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>A summary of your total costs to break even.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
                 <FeeInput control={form.control} name="solIncinerator" label="SOL INCINERATOR" icon={Trash2} step="0.001" />
                <Separator/>
                <ResultDisplay label="TOTAL SPENT IN FEES" value={totalSpentInFees} icon={Landmark} unit="SOL" />
                 <Separator/>
                <ResultDisplay label="PnL needed to Break Even" value={pnlNeeded} icon={TrendingUp} unit="%" />
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
