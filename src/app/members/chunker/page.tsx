
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { simulate, Inputs, Outputs } from '@/lib/chunker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info, HelpCircle, PiggyBank, Receipt, Rocket, Repeat, Loader2, Zap } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { pmt } from '@/lib/amort';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

type Step = { title: string; body: string; icon: React.ElementType };
type QA = { q: string; a: string };

interface LocalePack {
  title: string;
  subtitle: string;
  howTitle: string;
  steps: Step[];
  faqTitle: string;
  faq: QA[];
  form: {
      mortgageTitle: string;
      cashflowTitle: string;
      strategyTitle: string;
      calculate: string;
      howChunksWork: string;
      assetsTitle: string;
  };
  results: {
      title: string;
      interestSaved: string;
      monthsSaved: string;
      miSaved: string;
      baselineTitle: string;
      strategyTitle: string;
      months: string;
      totalInterest: string;
      totalMI: string;
      balanceOverTime: string;
      balanceDescription: string;
      timelineTitle: string;
      timelineDescription: string;
      table: {
        month: string;
        mortgageBal: string;
        helocBal: string;
        mortInt: string;
        mortPmt: string;
        chunk: string;
        helocInt: string;
        mi: string;
        surplusUsed: string;
      },
      placeholderTitle: string;
      placeholderDescription: string;
      strategyCardTitle: string;
      arbitrageAlertTitle: string;
      arbitrageAlertDescription: string;
  };
  disclaimer: string;
  explainers: Record<string, string>;
  labels: Record<string, string>;
}


const i18n: Record<string, LocalePack> = {
  en: {
    title: "HELOC-Assist Estimator",
    subtitle: "Turn HELOC access into months off your mortgage. No switching lenders. Just use credit you already have to nuke principal.",
    howTitle: "How This Strategy Works",
    steps: [
      {icon: PiggyBank, title:"Deposit pay into HELOC", body:"Your cash lowers HELOC’s daily balance, cutting interest."},
      {icon: Receipt, title:"Pay bills from HELOC", body:"Batch bills so cash sits longer against balance."},
      {icon: Rocket, title:"Chunk to mortgage", body:"Send a lump-sum prepayment to principal (payment stays same; term shrinks)."},
      {icon: Repeat, title:"Use surplus to reset", body:"Your monthly surplus pays HELOC back; repeat."}
    ],
    faqTitle: "Common Questions",
    faq: [
      {q:"Will my mortgage payment change?", a:"No—unless you ask your lender to recast. We typically don’t recast. Payment stays the same; the term shrinks."},
      {q:"Do I need a special account?", a:"Any HELOC or readvanceable LOC works. Keep it simple and bank-agnostic."},
      {q:"What if my surplus is small?", a:"Small still works. The calculator sizes safe chunk amounts for you."}
    ],
    form: {
      mortgageTitle: "1. Mortgage Details",
      cashflowTitle: "2. Cash Flow & HELOC",
      strategyTitle: "3. Strategy",
      assetsTitle: "4. Cash & Assets (Optional)",
      calculate: "Calculate",
      howChunksWork: "How do chunks work?",
    },
    results: {
      title: "Results",
      interestSaved: "Interest Saved",
      monthsSaved: "Months Saved",
      miSaved: "MI/CMHC Saved",
      baselineTitle: "Baseline (Do Nothing)",
      strategyTitle: "With Chunker Strategy",
      months: "Months",
      totalInterest: "Total Interest",
      totalMI: "Total MI/CMHC",
      balanceOverTime: "Balance Over Time",
      balanceDescription: "Mortgage vs. Total Debt with Chunker Strategy",
      timelineTitle: "View Month-by-Month Timeline",
      timelineDescription: "(Showing first 240 months to keep the table light.)",
      table: {
        month: "Month",
        mortgageBal: "Mortgage Bal",
        helocBal: "HELOC Bal",
        mortInt: "Mortgage Int.",
        mortPmt: "Mortgage Prin.",
        chunk: "Chunk",
        helocInt: "HELOC Int",
        mi: "MI",
        surplusUsed: "Surplus Used"
      },
      placeholderTitle: "Your results will appear here.",
      placeholderDescription: "Fill out the form and click 'Calculate' to see your potential savings.",
      strategyCardTitle: "Strategy Used",
      arbitrageAlertTitle: "HELOC Arbitrage Mode Activated!",
      arbitrageAlertDescription: "Your HELOC rate is lower than your mortgage rate. We've automatically engaged a more aggressive strategy, using your cheaper HELOC to pay down your expensive mortgage faster."
    },
    disclaimer: "Educational estimate only. No bank fees, promos, or taxes included. Results improve with positive monthly surplus, readvanceable lines, and batched bill pay.",
    explainers: {
      mortgageBalance: "Your current unpaid principal on the mortgage (not the original loan).\nExample: If your statement shows $612,350 remaining, enter 612350.",
      mortgageAPR: "Your annual interest rate for the mortgage. If you have a fixed rate, use that. If variable, use today’s stated APR.\nExample: 5.49",
      termRemaining: "How much time is left on your current mortgage. You can enter in years or months.\nExample: 25 years (or 300 months).",
      monthlyMortgagePayment: "Leave blank to auto-calculate. If your payment includes property tax/insurance, enter only the loan payment portion.\nExample: Leave blank, or enter 3,456.",
      homeValue: "Estimated current market value. Used only to estimate when mortgage insurance (MI/CMHC) falls off at 80% LTV.\nExample: 750000.",
      monthlyMI: "Monthly mortgage insurance (U.S.) or CMHC premium (Canada), if you pay one. Enter 0 if none.\nExample: 120.",
      netIncome: "Take-home pay each month after taxes/deductions (household total).\nExample: Your pay stubs total $8,900 after tax → enter 8900.",
      livingExpenses: "All monthly spending except the mortgage payment: utilities, groceries, etc.\nExample: 4300.",
      helocAPR: "Your HELOC’s variable or fixed annual rate.\nExample: 7.25.",
      helocLimit: "The maximum you can draw today (credit limit minus any current HELOC balance).\nExample: Credit limit 50,000 and current balance 8,500 → enter 41500.",
      helocOpeningBalance: "Your current HELOC balance before starting the strategy. Use 0 if you haven’t drawn yet.\nExample: 0 or 8500.",
      readvanceable: "Yes if your line re-advances as you pay your mortgage (e.g., STEP/HPP). No for a basic non-readvanceable HELOC.",
      chunkMode: "Auto = we size safe chunks based on your surplus. Fixed = you choose the chunk size. Auto is recommended.",
      fixedChunkAmount: "How much to draw from the HELOC each time we ‘chunk’ down your mortgage principal.\nExample: 10000.",
      billTiming: "Optimized = you batch most bills at once, keeping cash parked against the HELOC longer. Typical = bills are scattered.",
      chunkModalTitle: "How the 'Chunk' Strategy Works",
      chunkModalBody: "We draw a small HELOC chunk to knock down mortgage principal, then your monthly surplus repays the HELOC. Once the HELOC balance is near zero, we repeat. Lower principal sooner = less interest over time.",
      savings: "Cash in a standard savings account. This will be used to pay down the HELOC balance on day one.",
      chequing: "Cash in your primary chequing/current account. This will also be used to immediately reduce your HELOC principal.",
      shortTerm: "Cash in liquid, short-term investments you're willing to use (e.g., GICs, money market funds)."
    },
     labels: {
      language: "Language",
      years: "Years",
      months: "Months",
      termRemaining: "Term Remaining",
      mortgageBalance: "Mortgage Balance",
      mortgageAPR: "Mortgage APR (%)",
      monthlyMortgagePayment: "Monthly Payment (Optional)",
      homeValue: "Home Value (Optional)",
      monthlyMI: "Monthly MI/CMHC (Optional)",
      netIncome: "Net Monthly Income",
      livingExpenses: "Monthly Living Expenses (excl. mortgage)",
      helocAPR: "HELOC APR (%)",
      helocLimit: "HELOC Limit (Available Now)",
      helocOpeningBalance: "HELOC Opening Balance",
      chunkMode: "Chunk Mode",
      fixedChunkAmount: "Fixed Chunk Amount",
      billTiming: "Bill Timing",
      readvanceable: "Readvanceable?",
      auto: "Auto",
      fixed: "Fixed",
      optimized: "Optimized",
      typical: "Typical",
      savings: "Savings Account",
      chequing: "Chequing Account",
      shortTerm: "Short-Term Investments",
    }
  },
  "fr-CA": {
    title: "Simulateur d'aide MCH",
    subtitle: "Transformez l'accès à votre MCH en mois de moins sur votre hypothèque. Pas de changement de prêteur. Utilisez le crédit que vous avez déjà pour réduire le capital.",
    howTitle: "Comment fonctionne cette stratégie",
    steps: [
      {icon: PiggyBank, title:"Déposez votre paie dans la MCH", body:"Votre argent réduit le solde quotidien et les intérêts."},
      {icon: Receipt, title:"Payez vos dépenses depuis la MCH", body:"Groupez les paiements pour laisser l’argent plus longtemps."},
      {icon: Rocket, title:"Versement forfaitaire à l’hypothèque", body:"Un paiement en capital réduit la durée (la mensualité reste la même)."},
      {icon: Repeat, title:"Remboursez avec votre surplus", body:"Votre surplus mensuel rembourse la MCH; répétez."}
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {q:"Ma mensualité va-t-elle changer ?", a:"Non—sauf si vous demandez un recalcul à la banque. En général, on ne le fait pas."},
      {q:"Compte spécial nécessaire ?", a:"Toute marge de crédit hypothécaire (MCH) ou réutilisable convient."},
      {q:"Et si mon surplus est faible ?", a:"Même un petit surplus fonctionne. Le simulateur dimensionne des montants sécuritaires."}
    ],
    form: {
      mortgageTitle: "1. Détails de l'hypothèque",
      cashflowTitle: "2. Flux de trésorerie et MCH",
      strategyTitle: "3. Stratégie",
      assetsTitle: "4. Actifs et liquidités (Optionnel)",
      calculate: "Calculer",
      howChunksWork: "Comment fonctionnent les versements ?",
    },
    results: {
      title: "Résultats",
      interestSaved: "Intérêts économisés",
      monthsSaved: "Mois économisés",
      miSaved: "Assurance écon.",
      baselineTitle: "Scénario de base",
      strategyTitle: "Avec stratégie Chunker",
      months: "Mois",
      totalInterest: "Intérêts totaux",
      totalMI: "Assurance tot.",
      balanceOverTime: "Solde au fil du temps",
      balanceDescription: "Hypothèque vs Dette totale avec la stratégie Chunker",
      timelineTitle: "Voir l'échéancier mois par mois",
      timelineDescription: "(Affichage des 240 premiers mois pour alléger le tableau.)",
      table: {
        month: "Mois",
        mortgageBal: "Solde Hypo.",
        helocBal: "Solde MCH",
        mortInt: "Int. Hypo.",
        mortPmt: "Prin. Hypo.",
        chunk: "Versement",
        helocInt: "Int. MCH",
        mi: "Assurance",
        surplusUsed: "Surplus utilisé"
      },
      placeholderTitle: "Vos résultats apparaîtront ici.",
      placeholderDescription: "Remplissez le formulaire et cliquez sur 'Calculer' pour voir vos économies potentielles.",
      strategyCardTitle: "Stratégie utilisée",
      arbitrageAlertTitle: "Mode d'arbitrage MCH activé !",
      arbitrageAlertDescription: "Votre taux MCH est inférieur à votre taux hypothécaire. Nous avons automatiquement engagé une stratégie plus agressive, en utilisant votre MCH moins chère pour rembourser plus rapidement votre hypothèque coûteuse."
    },
    disclaimer: "Estimation à titre éducatif uniquement. N'inclut pas les frais bancaires, promotions ou taxes. Les résultats s'améliorent avec un surplus mensuel positif, des marges réutilisables et des paiements de factures groupés.",
    explainers: {
        mortgageBalance: "Votre capital impayé actuel sur l'hypothèque (pas le prêt initial).\nExemple: Si votre relevé indique 612 350 $ restants, entrez 612350.",
        mortgageAPR: "Votre taux d'intérêt annuel pour l'hypothèque. Si vous avez un taux fixe, utilisez-le. Si variable, utilisez le TAEG actuel.\nExemple: 5.49",
        termRemaining: "Le temps qu'il reste sur votre hypothèque actuelle. Vous pouvez entrer en années ou en mois.\nExemple: 25 ans (ou 300 mois).",
        monthlyMortgagePayment: "Laissez vide pour un calcul automatique. Si votre paiement inclut les taxes foncières/assurance, n'entrez que la partie du prêt.\nExemple: Laissez vide, ou entrez 3456.",
        homeValue: "Valeur marchande actuelle estimée. Utilisé uniquement pour estimer quand l'assurance hypothécaire (MI/SCHL) tombe à 80% du RPV.\nExemple: 750000.",
        monthlyMI: "Assurance hypothécaire mensuelle (US) ou prime SCHL (Canada), si vous en payez une. Entrez 0 sinon.\nExemple: 120.",
        netIncome: "Salaire net mensuel après impôts/déductions (total du ménage).\nExemple: Vos fiches de paie totalisent 8900 $ après impôts → entrez 8900.",
        livingExpenses: "Toutes les dépenses mensuelles sauf le paiement hypothécaire: services publics, épicerie, etc.\nExemple: 4300.",
        helocAPR: "Le taux annuel variable ou fixe de votre MCH.\nExemple: 7.25.",
        helocLimit: "Le montant maximum que vous pouvez retirer aujourd'hui (limite de crédit moins le solde actuel de la MCH).\nExemple: Limite de crédit 50 000 et solde actuel 8 500 → entrez 41500.",
        helocOpeningBalance: "Votre solde MCH actuel avant de commencer la stratégie. Utilisez 0 si vous n'avez pas encore retiré.\nExemple: 0 ou 8500.",
        readvanceable: "Oui si votre marge se réavance au fur et à mesure que vous payez votre hypothèque (ex: STEP/HPP). Non pour une MCH de base non réutilisable.",
        chunkMode: "Auto = nous dimensionnons des versements sûrs en fonction de votre surplus. Fixe = vous choisissez le montant. Auto est recommandé.",
        fixedChunkAmount: "Montant à retirer de la MCH chaque fois que nous réduisons le capital de votre hypothèque.\nExemple: 10000.",
        billTiming: "Optimisé = vous regroupez la plupart des factures en une fois, gardant l'argent plus longtemps sur la MCH. Typique = factures étalées.",
        chunkModalTitle: "Comment fonctionne la stratégie de 'versement'",
        chunkModalBody: "Nous retirons un petit versement de la MCH pour réduire le capital de l'hypothèque, puis votre surplus mensuel rembourse la MCH. Une fois le solde de la MCH proche de zéro, nous répétons. Un capital plus bas plus tôt = moins d'intérêts sur la durée.",
        savings: "Argent dans un compte d'épargne standard. Il sera utilisé pour rembourser le solde de la MCH le premier jour.",
        chequing: "Argent dans votre compte chèques principal. Il sera également utilisé pour réduire immédiatement le capital de votre MCH.",
        shortTerm: "Argent dans des investissements liquides à court terme que vous êtes prêt à utiliser (par ex., CPG, fonds du marché monétaire)."
    },
    labels: {
      language: "Langue",
      years: "Années",
      months: "Mois",
      termRemaining: "Durée restante",
      mortgageBalance: "Solde de l'hypothèque",
      mortgageAPR: "TAEG de l'hypothèque (%)",
      monthlyMortgagePayment: "Paiement mensuel (Facultatif)",
      homeValue: "Valeur de la maison (Facultatif)",
      monthlyMI: "Assurance hypothécaire/SCHL mensuelle (Facultatif)",
      netIncome: "Revenu mensuel net",
      livingExpenses: "Dépenses de subsistance mensuelles (sauf hypothèque)",
      helocAPR: "TAEG de la MCH (%)",
      helocLimit: "Limite de la MCH (disponible maintenant)",
      helocOpeningBalance: "Solde d'ouverture de la MCH",
      chunkMode: "Mode de versement",
      fixedChunkAmount: "Montant du versement fixe",
      billTiming: "Calendrier des factures",
      readvanceable: "Réutilisable ?",
      auto: "Auto",
      fixed: "Fixe",
      optimized: "Optimisé",
      typical: "Typique",
      savings: "Compte d'épargne",
      chequing: "Compte chèques",
      shortTerm: "Placements à court terme",
    }
  },
  es: {
    title: "Estimador de Asistencia HELOC",
    subtitle: "Convierta el acceso a su HELOC en meses menos de su hipoteca. Sin cambiar de prestamista. Solo use el crédito que ya tiene para reducir el capital.",
    howTitle: "Cómo funciona esta estrategia",
    steps: [
      {icon: PiggyBank, title: "Deposita el sueldo en HELOC", body: "Tu efectivo reduce el saldo diario de la HELOC, disminuyendo el interés."},
      {icon: Receipt, title: "Paga las facturas desde HELOC", body: "Agrupa las facturas para que el efectivo permanezca más tiempo contra el saldo."},
      {icon: Rocket, title: "Abona a la hipoteca", body: "Envía un prepago a capital (el pago se mantiene, el plazo se acorta)."},
      {icon: Repeat, title: "Usa el superávit para reiniciar", body: "Tu superávit mensual paga la HELOC; repite."}
    ],
    faqTitle: "Preguntas Frecuentes",
    faq: [
      {q: "¿Cambiará mi pago de hipoteca?", a: "No, a menos que le pidas a tu prestamista que recalcule. Generalmente no lo hacemos. El pago se mantiene igual; el plazo se acorta."},
      {q: "¿Necesito una cuenta especial?", a: "Cualquier HELOC o línea de crédito readmisible funciona. Mantenlo simple e independiente del banco."},
      {q: "¿Qué pasa si mi superávit es pequeño?", a: "Pequeño también funciona. La calculadora ajusta montos de abono seguros para ti."}
    ],
    form: {
      mortgageTitle: "1. Detalles de la Hipoteca",
      cashflowTitle: "2. Flujo de Caja y HELOC",
      strategyTitle: "3. Estrategia",
      assetsTitle: "4. Efectivo y Activos (Opcional)",
      calculate: "Calcular",
      howChunksWork: "¿Cómo funcionan los abonos?",
    },
    results: {
      title: "Resultados",
      interestSaved: "Interés Ahorrado",
      monthsSaved: "Meses Ahorrados",
      miSaved: "MI/CMHC Ahorrado",
      baselineTitle: "Línea de Base (Sin hacer nada)",
      strategyTitle: "Con Estrategia de Abonos",
      months: "Meses",
      totalInterest: "Interés Total",
      totalMI: "MI/CMHC Total",
      balanceOverTime: "Saldo a lo Largo del Tiempo",
      balanceDescription: "Hipoteca vs. Deuda Total con Estrategia de Abonos",
      timelineTitle: "Ver Cronología Mes a Mes",
      timelineDescription: "(Mostrando los primeros 240 meses para mantener la tabla ligera.)",
      table: {
        month: "Mes",
        mortgageBal: "Saldo Hipoteca",
        helocBal: "Saldo HELOC",
        mortInt: "Int. Hipoteca",
        mortPmt: "Prin. Hipoteca",
        chunk: "Abono",
        helocInt: "Int. HELOC",
        mi: "MI",
        surplusUsed: "Superávit Usado"
      },
      placeholderTitle: "Tus resultados aparecerán aquí.",
      placeholderDescription: "Completa el formulario y haz clic en 'Calcular' para ver tus posibles ahorros.",
      strategyCardTitle: "Estrategia Utilizada",
      arbitrageAlertTitle: "¡Modo de Arbitraje HELOC Activado!",
      arbitrageAlertDescription: "La tasa de su HELOC es más baja que la de su hipoteca. Hemos activado automáticamente una estrategia más agresiva, utilizando su HELOC más barata para pagar su hipoteca más cara más rápido."
    },
    disclaimer: "Estimación solo para fines educativos. No incluye comisiones bancarias, promociones o impuestos. Los resultados mejoran con un superávit mensual positivo, líneas readmisibles y pagos de facturas agrupados.",
    explainers: {
      mortgageBalance: "Tu capital actual no pagado de la hipoteca (no el préstamo original).\nEjemplo: Si tu estado de cuenta muestra $612,350 restantes, ingresa 612350.",
      mortgageAPR: "Tu tasa de interés anual para la hipoteca. Si tienes una tasa fija, úsala. Si es variable, usa la TPA declarada hoy.\nEjemplo: 5.49",
      termRemaining: "Cuánto tiempo queda en tu hipoteca actual. Puedes ingresarlo en años o meses.\nEjemplo: 25 años (o 300 meses).",
      monthlyMortgagePayment: "Déjalo en blanco para autocalcular. Si tu pago incluye impuestos sobre la propiedad/seguro, ingresa solo la porción del pago del préstamo.\nEjemplo: Déjalo en blanco, o ingresa 3,456.",
      homeValue: "Valor de mercado actual estimado. Usado solo para estimar cuándo se elimina el seguro hipotecario (MI/CMHC) al 80% de LTV.\nEjemplo: 750000.",
      monthlyMI: "Seguro hipotecario mensual (EE. UU.) o prima CMHC (Canadá), si pagas uno. Ingresa 0 si no tienes.\nEjemplo: 120.",
      netIncome: "Pago neto mensual después de impuestos/deducciones (total del hogar).\nEjemplo: Tus recibos de pago suman $8,900 después de impuestos → ingresa 8900.",
      livingExpenses: "Todos los gastos mensuales excepto el pago de la hipoteca: servicios públicos, comestibles, etc.\nEjemplo: 4300.",
      helocAPR: "La tasa anual variable o fija de tu HELOC.\nEjemplo: 7.25.",
      helocLimit: "El máximo que puedes retirar hoy (límite de crédito menos cualquier saldo actual de HELOC).\nEjemplo: Límite de crédito 50,000 y saldo actual 8,500 → ingresa 41500.",
      helocOpeningBalance: "Tu saldo actual de HELOC antes de comenzar la estrategia. Usa 0 si aún no has retirado.\nEjemplo: 0 o 8500.",
      readvanceable: "Sí si tu línea se readmite a medida que pagas tu hipoteca (p. ej., STEP/HPP). No para una HELOC básica no readmisible.",
      chunkMode: "Automático = dimensionamos abonos seguros basados en tu superávit. Fijo = tú eliges el tamaño del abono. Se recomienda Automático.",
      fixedChunkAmount: "Cuánto retirar de la HELOC cada vez que 'abonamos' al capital de tu hipoteca.\nEjemplo: 10000.",
      billTiming: "Optimizado = agrupas la mayoría de las facturas a la vez, manteniendo el efectivo estacionado contra la HELOC por más tiempo. Típico = las facturas están dispersas.",
      chunkModalTitle: "Cómo Funciona la Estrategia de 'Abonos'",
      chunkModalBody: "Retiramos un pequeño abono de la HELOC para reducir el capital de la hipoteca, luego tu superávit mensual paga la HELOC. Una vez que el saldo de la HELOC está cerca de cero, repetimos. Un capital más bajo antes = menos interés con el tiempo.",
      savings: "Dinero en una cuenta de ahorros estándar. Se utilizará para pagar el saldo de la HELOC el primer día.",
      chequing: "Dinero en su cuenta corriente principal. También se utilizará para reducir inmediatamente el capital de su HELOC.",
      shortTerm: "Dinero en inversiones líquidas a corto plazo que está dispuesto a utilizar (por ejemplo, GIC, fondos del mercado monetario)."
    },
    labels: {
      language: "Idioma",
      years: "Años",
      months: "Meses",
      termRemaining: "Plazo Restante",
      mortgageBalance: "Saldo de Hipoteca",
      mortgageAPR: "TPA Hipoteca (%)",
      monthlyMortgagePayment: "Pago Mensual (Opcional)",
      homeValue: "Valor de la Vivienda (Opcional)",
      monthlyMI: "MI/CMHC Mensual (Opcional)",
      netIncome: "Ingreso Mensual Neto",
      livingExpenses: "Gastos de Vida Mensuales (excl. hipoteca)",
      helocAPR: "TPA HELOC (%)",
      helocLimit: "Límite HELOC (Disponible ahora)",
      helocOpeningBalance: "Saldo Inicial HELOC",
      chunkMode: "Modo de Abono",
      fixedChunkAmount: "Monto de Abono Fijo",
      billTiming: "Programación de Facturas",
      readvanceable: "¿Readmisible?",
      auto: "Auto",
      fixed: "Fijo",
      optimized: "Optimizado",
      typical: "Típico",
      savings: "Cuenta de Ahorros",
      chequing: "Cuenta Corriente",
      shortTerm: "Inversiones a Corto Plazo",
    }
  },
  "pt-BR": {
    title: "Estimador de Assistência HELOC",
    subtitle: "Transforme o acesso ao seu HELOC em meses a menos na sua hipoteca. Sem trocar de credor. Apenas use o crédito que você já tem para abater o principal.",
    howTitle: "Como a Estratégia Funciona",
    steps: [
        {icon: PiggyBank, title: "Deposite o salário no HELOC", body: "Seu dinheiro reduz o saldo diário do HELOC, cortando juros."},
        {icon: Receipt, title: "Pague contas pelo HELOC", body: "Agrupe contas para que o dinheiro fique mais tempo contra o saldo."},
        {icon: Rocket, title: "Abata na hipoteca", body: "Envie um pré-pagamento em montante para o principal (o pagamento permanece o mesmo; o prazo encurta)."},
        {icon: Repeat, title: "Use o superávit para zerar", body: "Seu superávit mensal paga o HELOC; repita."}
    ],
    faqTitle: "Perguntas Frequentes",
    faq: [
        {q: "Meu pagamento da hipoteca vai mudar?", a: "Não, a menos que você peça ao seu credor para recalcular. Normalmente não fazemos isso. O pagamento permanece o mesmo; o prazo encurta."},
        {q: "Preciso de uma conta especial?", a: "Qualquer HELOC ou linha de crédito reavançável funciona. Mantenha simples e agnóstico ao banco."},
        {q: "E se meu superávit for pequeno?", a: "Pequeno ainda funciona. A calculadora dimensiona valores seguros de abatimento para você."}
    ],
    form: {
        mortgageTitle: "1. Detalhes da Hipoteca",
        cashflowTitle: "2. Fluxo de Caixa & HELOC",
        strategyTitle: "3. Estratégia",
        assetsTitle: "4. Dinheiro e Ativos (Opcional)",
        calculate: "Calcular",
        howChunksWork: "Como funcionam os abatimentos?",
    },
    results: {
        title: "Resultados",
        interestSaved: "Juros Economizados",
        monthsSaved: "Meses Economizados",
        miSaved: "MI/CMHC Economizado",
        baselineTitle: "Base (Não fazer nada)",
        strategyTitle: "Com Estratégia de Abatimento",
        months: "Meses",
        totalInterest: "Juros Totais",
        totalMI: "MI/CMHC Total",
        balanceOverTime: "Saldo ao Longo do Tempo",
        balanceDescription: "Hipoteca vs. Dívida Total com a Estratégia de Abatimento",
        timelineTitle: "Ver Linha do Tempo Mês a Mês",
        timelineDescription: "(Mostrando os primeiros 240 meses para manter a tabela leve.)",
        table: {
            month: "Mês",
            mortgageBal: "Saldo Hipoteca",
            helocBal: "Saldo HELOC",
            mortInt: "Juros Hipoteca",
            mortPmt: "Principal Hipoteca",
            chunk: "Abatimento",
            helocInt: "Juros HELOC",
            mi: "MI",
            surplusUsed: "Superávit Usado"
        },
        placeholderTitle: "Seus resultados aparecerão aqui.",
        placeholderDescription: "Preencha o formulário e clique em 'Calcular' para ver sua economia potencial.",
        strategyCardTitle: "Estratégia Utilizada",
        arbitrageAlertTitle: "Modo de Arbitragem HELOC Ativado!",
        arbitrageAlertDescription: "Sua taxa HELOC é menor que a taxa da sua hipoteca. Ativamos automaticamente uma estratégia mais agressiva, usando seu HELOC mais barato para quitar sua hipoteca cara mais rápido."
    },
    disclaimer: "Estimativa apenas para fins educacionais. Não inclui taxas bancárias, promoções ou impostos. Os resultados melhoram com um superávit mensal positivo, linhas reavançáveis e pagamentos de contas agrupados.",
    explainers: {
        mortgageBalance: "Seu saldo devedor atual da hipoteca (não o empréstimo original).\nExemplo: Se seu extrato mostra R$612.350 restantes, insira 612350.",
        mortgageAPR: "Sua taxa de juros anual para a hipoteca. Se você tem uma taxa fixa, use essa. Se for variável, use a TAE de hoje.\nExemplo: 5.49",
        termRemaining: "Quanto tempo resta na sua hipoteca atual. Você pode inserir em anos ou meses.\nExemplo: 25 anos (ou 300 meses).",
        monthlyMortgagePayment: "Deixe em branco para autocalcular. Se seu pagamento inclui imposto predial/seguro, insira apenas a parte do pagamento do empréstimo.\nExemplo: Deixe em branco, ou insira 3.456.",
        homeValue: "Valor de mercado atual estimado. Usado apenas para estimar quando o seguro hipotecário (MI/CMHC) é removido a 80% de LTV.\nExemplo: 750000.",
        monthlyMI: "Seguro hipotecário mensal (EUA) ou prêmio CMHC (Canadá), se você paga um. Insira 0 se não tiver.\nExemplo: 120.",
        netIncome: "Salário líquido mensal após impostos/deduções (total da casa).\nExemplo: Seus holerites totalizam R$8.900 após impostos → insira 8900.",
        livingExpenses: "Todos os gastos mensais, exceto o pagamento da hipoteca: contas de consumo, supermercado, etc.\nExemplo: 4300.",
        helocAPR: "A taxa anual variável ou fixa do seu HELOC.\nExemplo: 7.25.",
        helocLimit: "O máximo que você pode sacar hoje (limite de crédito menos qualquer saldo atual do HELOC).\nExemplo: Limite de crédito 50.000 e saldo atual 8.500 → insira 41500.",
        helocOpeningBalance: "Seu saldo atual do HELOC antes de iniciar a estratégia. Use 0 se ainda não sacou.\nExemplo: 0 ou 8500.",
        readvanceable: "Sim se sua linha reavança conforme você paga sua hipoteca (ex: STEP/HPP). Não para um HELOC básico não reavançável.",
        chunkMode: "Auto = dimensionamos abatimentos seguros com base no seu superávit. Fixo = você escolhe o tamanho do abatimento. Auto é recomendado.",
        fixedChunkAmount: "Quanto sacar do HELOC cada vez que 'abatemos' o principal da sua hipoteca.\nExemplo: 10000.",
        billTiming: "Otimizado = você agrupa a maioria das contas de uma vez, mantendo o dinheiro parado contra o HELOC por mais tempo. Típico = as contas são espalhadas.",
        chunkModalTitle: "Como a Estratégia de 'Abatimento' Funciona",
        chunkModalBody: "Sacamos um pequeno abatimento do HELOC para diminuir o principal da hipoteca, então seu superávit mensal paga o HELOC. Assim que o saldo do HELOC está perto de zero, repetimos. Um principal mais baixo mais cedo = menos juros ao longo do tempo.",
        savings: "Dinheiro em uma conta poupança padrão. Será usado para pagar o saldo do HELOC no primeiro dia.",
        chequing: "Dinheiro em sua conta corrente principal. Também será usado para reduzir imediatamente o principal do seu HELOC.",
        shortTerm: "Dinheiro em investimentos líquidos de curto prazo que você está disposto a usar (por exemplo, CDBs, fundos do mercado monetário)."
    },
    labels: {
        language: "Idioma",
        years: "Anos",
        months: "Meses",
        termRemaining: "Prazo Restante",
        mortgageBalance: "Saldo da Hipoteca",
        mortgageAPR: "TAE da Hipoteca (%)",
        monthlyMortgagePayment: "Pagamento Mensal (Opcional)",
        homeValue: "Valor do Imóvel (Opcional)",
        monthlyMI: "MI/CMHC Mensal (Opcional)",
        netIncome: "Renda Mensal Líquida",
        livingExpenses: "Despesas Mensais (excl. hipoteca)",
        helocAPR: "TAE do HELOC (%)",
        helocLimit: "Limite do HELOC (Disponível agora)",
        helocOpeningBalance: "Saldo Inicial do HELOC",
        chunkMode: "Modo de Abatimento",
        fixedChunkAmount: "Valor Fixo do Abatimento",
        billTiming: "Programação de Contas",
        readvanceable: "Reavançável?",
        auto: "Auto",
        fixed: "Fixo",
        optimized: "Otimizado",
        typical: "Típico",
        savings: "Conta Poupança",
        chequing: "Conta Corrente",
        shortTerm: "Investimentos de Curto Prazo",
    }
  },
  hi: {
    title: "HELOC-सहायता अनुमानक",
    subtitle: "HELOC एक्सेस को अपनी मॉर्गेज से महीनों कम करने में बदलें। ऋणदाता बदलने की जरूरत नहीं। बस उस क्रेडिट का उपयोग करें जो आपके पास पहले से है।",
    howTitle: "यह रणनीति कैसे काम करती है",
    steps: [
        {icon: PiggyBank, title: "HELOC में वेतन जमा करें", body: "आपका नकद HELOC के दैनिक शेष को कम करता है, जिससे ब्याज में कटौती होती है।"},
        {icon: Receipt, title: "HELOC से बिलों का भुगतान करें", body: "बिलों को बैच मेंจ่ายें ताकि नकद शेष के खिलाफ अधिक समय तक रहे।"},
        {icon: Rocket, title: "मॉर्गेज में एकमुश्त भुगतान करें", body: "मूलधन में एकमुश्त पूर्व-भुगतान भेजें (भुगतान वही रहता है; अवधि घट जाती है)।"},
        {icon: Repeat, title: "रीसेट करने के लिए अधिशेष का उपयोग करें", body: "आपका मासिक अधिशेष HELOC का भुगतान करता है; दोहराएं।"}
    ],
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faq: [
        {q: "क्या मेरा मॉर्गेज भुगतान बदलेगा?", a: "नहीं—जब तक आप अपने ऋणदाता से पुनर्गणना करने के लिए नहीं कहते। हम आमतौर पर पुनर्गणना नहीं करते। भुगतान वही रहता है; अवधि घट जाती है।"},
        {q: "क्या मुझे एक विशेष खाते की आवश्यकता है?", a: "कोई भी HELOC या पुन: अग्रिम योग्य LOC काम करेगा। इसे सरल और बैंक-अज्ञेयवादी रखें।"},
        {q: "अगर मेरा अधिशेष छोटा है तो क्या होगा?", a: "छोटा भी काम करता है। कैलकुलेटर आपके लिए सुरक्षित एकमुश्त राशि का आकार तय करता है।"}
    ],
    form: {
        mortgageTitle: "1. मॉर्गेज विवरण",
        cashflowTitle: "2. नकदी प्रवाह और HELOC",
        strategyTitle: "3. रणनीति",
        assetsTitle: "4. नकदी और संपत्ति (वैकल्पिक)",
        calculate: "गणना करें",
        howChunksWork: "एकमुश्त भुगतान कैसे काम करते हैं?",
    },
    results: {
        title: "परिणाम",
        interestSaved: "ब्याज बचाया",
        monthsSaved: "महीने बचाए",
        miSaved: "MI/CMHC बचाया",
        baselineTitle: "आधार रेखा (कुछ न करें)",
        strategyTitle: "चंकर रणनीति के साथ",
        months: "महीने",
        totalInterest: "कुल ब्याज",
        totalMI: "कुल MI/CMHC",
        balanceOverTime: "समय के साथ शेष राशि",
        balanceDescription: "मॉर्गेज बनाम कुल ऋण चंकर रणनीति के साथ",
        timelineTitle: "महीने-दर-महीने समयरेखा देखें",
        timelineDescription: "(तालिका को हल्का रखने के लिए पहले 240 महीने दिखा रहा है।)",
        table: {
            month: "महीना",
            mortgageBal: "मॉर्गेज शेष",
            helocBal: "HELOC शेष",
            mortInt: "मॉर्गेज ब्याज",
            mortPmt: "मॉर्गेज मूलधन",
            chunk: "एकमुश्त",
            helocInt: "HELOC ब्याज",
            mi: "MI",
            surplusUsed: "प्रयुक्त अधिशेष"
        },
        placeholderTitle: "आपके परिणाम यहां दिखाई देंगे।",
        placeholderDescription: "संभावित बचत देखने के लिए फ़ॉर्म भरें और 'गणना करें' पर क्लिक करें।",
        strategyCardTitle: "प्रयुक्त रणनीति",
        arbitrageAlertTitle: "HELOC आर्बिट्रेज मोड सक्रिय!",
        arbitrageAlertDescription: "आपकी HELOC दर आपकी मॉर्गेज दर से कम है। हमने स्वचालित रूप से एक अधिक आक्रामक रणनीति अपनाई है, आपकी सस्ती HELOC का उपयोग करके आपकी महंगी मॉर्गेज को तेजी से चुकाने के लिए।"
    },
    disclaimer: "केवल शैक्षिक अनुमान। कोई बैंक शुल्क, प्रोमो या कर शामिल नहीं है। परिणाम सकारात्मक मासिक अधिशेष, पुन: अग्रिम योग्य लाइनों और बैच किए गए बिल भुगतान के साथ बेहतर होते हैं।",
    explainers: {
        mortgageBalance: "मॉर्गेज पर आपका वर्तमान अवैतनिक मूलधन (मूल ऋण नहीं)।\nउदाहरण: यदि आपका विवरण $612,350 शेष दिखाता है, तो 612350 दर्ज करें।",
        mortgageAPR: "मॉर्गेज के लिए आपकी वार्षिक ब्याज दर। यदि आपके पास एक निश्चित दर है, तो उसका उपयोग करें। यदि चर है, तो आज की बताई गई APR का उपयोग करें।\nउदाहरण: 5.49",
        termRemaining: "आपकी वर्तमान मॉर्गेज में कितना समय बचा है। आप वर्षों या महीनों में दर्ज कर सकते हैं।\nउदाहरण: 25 वर्ष (या 300 महीने)।",
        monthlyMortgagePayment: "स्वतः-गणना के लिए खाली छोड़ दें। यदि आपके भुगतान में संपत्ति कर/बीमा शामिल है, तो केवल ऋण भुगतान भाग दर्ज करें।\nउदाहरण: खाली छोड़ दें, या 3,456 दर्ज करें।",
        homeValue: "अनुमानित वर्तमान बाजार मूल्य। केवल यह अनुमान लगाने के लिए उपयोग किया जाता है कि मॉर्गेज बीमा (MI/CMHC) 80% LTV पर कब समाप्त होता है।\nउदाहरण: 750000।",
        monthlyMI: "मासिक मॉर्गेज बीमा (U.S.) या CMHC प्रीमियम (कनाडा), यदि आप भुगतान करते हैं। यदि कोई नहीं है तो 0 दर्ज करें।\nउदाहरण: 120।",
        netIncome: "करों/कटौतियों के बाद हर महीने घर ले जाने वाला वेतन (घरेलू कुल)।\nउदाहरण: आपके वेतन पर्ची कर के बाद कुल $8,900 हैं → 8900 दर्ज करें।",
        livingExpenses: "मॉर्गेज भुगतान को छोड़कर सभी मासिक खर्च: उपयोगिताएँ, किराने का सामान, आदि।\nउदाहरण: 4300।",
        helocAPR: "आपके HELOC की परिवर्तनीय या निश्चित वार्षिक दर।\nउदाहरण: 7.25।",
        helocLimit: "आज आप जो अधिकतम राशि निकाल सकते हैं (क्रेडिट सीमा शून्य कोई वर्तमान HELOC शेष)।\nउदाहरण: क्रेडिट सीमा 50,000 और वर्तमान शेष 8,500 → 41500 दर्ज करें।",
        helocOpeningBalance: "रणनीति शुरू करने से पहले आपका वर्तमान HELOC शेष। यदि आपने अभी तक नहीं निकाला है तो 0 का उपयोग करें।\nउदाहरण: 0 या 8500।",
        readvanceable: "हाँ यदि आपकी लाइन आपके मॉर्गेज का भुगतान करते ही फिर से आगे बढ़ जाती है (जैसे, STEP/HPP)। एक मूल गैर-पुन: अग्रिम योग्य HELOC के लिए नहीं।",
        chunkMode: "ऑटो = हम आपके अधिशेष के आधार पर सुरक्षित एकमुश्त आकार देते हैं। फिक्स्ड = आप एकमुश्त आकार चुनते हैं। ऑटो की सिफारिश की जाती है।",
        fixedChunkAmount: "हर बार जब हम आपके मॉर्गेज मूलधन को 'एकमुश्त' करते हैं तो HELOC से कितनी राशि निकालनी है।\nउदाहरण: 10000।",
        billTiming: "अनुकूलित = आप एक बार में अधिकांश बिलों को बैच करते हैं, जिससे नकद HELOC के खिलाफ अधिक समय तक पार्क रहता है। विशिष्ट = बिल बिखरे हुए हैं।",
        chunkModalTitle: "'एकमुश्त' रणनीति कैसे काम करती है",
        chunkModalBody: "हम मॉर्गेज मूलधन को कम करने के लिए एक छोटा HELOC एकमुश्त निकालते हैं, फिर आपका मासिक अधिशेष HELOC का भुगतान करता है। एक बार HELOC शेष शून्य के करीब हो जाने पर, हम दोहराते हैं। पहले कम मूलधन = समय के साथ कम ब्याज।",
        savings: "एक मानक बचत खाते में नकद। इसका उपयोग पहले दिन HELOC शेष का भुगतान करने के लिए किया जाएगा।",
        chequing: "आपके प्राथमिक चालू खाते में नकद। इसका उपयोग आपके HELOC मूलधन को तुरंत कम करने के लिए भी किया जाएगा।",
        shortTerm: "तरल, अल्पकालिक निवेश में नकद जिसे आप उपयोग करने के इच्छुक हैं (उदाहरण के लिए, जीआईसी, मनी मार्केट फंड)।"
    },
    labels: {
        language: "भाषा",
        years: "वर्ष",
        months: "महीने",
        termRemaining: "अवधि शेष",
        mortgageBalance: "मॉर्गेज शेष",
        mortgageAPR: "मॉर्गेge APR (%)",
        monthlyMortgagePayment: "मासिक भुगतान (वैकल्पिक)",
        homeValue: "घर का मूल्य (वैकल्पिक)",
        monthlyMI: "मासिक MI/CMHC (वैकल्पिक)",
        netIncome: "शुद्ध मासिक आय",
        livingExpenses: "मासिक जीवनयापन व्यय (मॉर्geज को छोड़कर)",
        helocAPR: "HELOC APR (%)",
        helocLimit: "HELOC सीमा (अभी उपलब्ध)",
        helocOpeningBalance: "HELOC प्रारंभिक शेष",
        chunkMode: "एकमुश्त मोड",
        fixedChunkAmount: "निश्चित एकमुश्त राशि",
        billTiming: "बिल समय",
        readvanceable: "पुन: अग्रिम योग्य?",
        auto: "ऑटो",
        fixed: "निश्चित",
        optimized: "अनुकूलित",
        typical: "विशिष्ट",
        savings: "बचत खाता",
        chequing: "चालू खाता",
        shortTerm: "अल्पकालिक निवेश",
    }
  },
  pa: {
    title: "HELOC-ਸਹਾਇਤਾ ਅਨੁਮਾਨਕ",
    subtitle: "HELOC ਪਹੁੰਚ ਨੂੰ ਆਪਣੀ ਮੌਰਗੇਜ ਤੋਂ ਮਹੀਨੇ ਘਟਾਉਣ ਵਿੱਚ ਬਦਲੋ। ਕਰਜ਼ਾਦਾਤਾ ਬਦਲਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਬਸ ਉਸ ਕ੍ਰੈਡਿਟ ਦੀ ਵਰਤੋਂ ਕਰੋ ਜੋ ਤੁਹਾਡੇ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਹੈ।",
    howTitle: "ਇਹ ਰਣਨੀਤੀ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ",
    steps: [
        {icon: PiggyBank, title: "HELOC ਵਿੱਚ ਤਨਖਾਹ ਜਮ੍ਹਾਂ ਕਰੋ", body: "ਤੁਹਾਡਾ ਨਕਦ HELOC ਦੇ ਰੋਜ਼ਾਨਾ ਬਕਾਏ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਵਿਆਜ ਵਿੱਚ ਕਟੌਤੀ ਹੁੰਦੀ ਹੈ।"},
        {icon: Receipt, title: "HELOC ਤੋਂ ਬਿੱਲਾਂ ਦਾ ਭੁਗਤਾਨ ਕਰੋ", body: "ਬਿੱਲਾਂ ਨੂੰ ਬੈਚਾਂ ਵਿੱਚ ਭੁਗਤਾਨ ਕਰੋ ਤਾਂ ਜੋ ਨਕਦ ਬਕਾਏ ਦੇ ਵਿਰੁੱਧ ਜ਼ਿਆਦਾ ਦੇਰ ਤੱਕ ਰਹੇ।"},
        {icon: Rocket, title: "ਮੌਰਗੇਜ ਵਿੱਚ ਇੱਕਮੁਸ਼ਤ ਭੁਗਤਾਨ ਕਰੋ", body: "ਮੂਲਧਨ ਵਿੱਚ ਇੱਕਮੁਸ਼ਤ ਪੂਰਵ-ਭੁਗਤਾਨ ਭੇਜੋ (ਭੁਗਤਾਨ ਉਹੀ ਰਹਿੰਦਾ ਹੈ; ਮਿਆਦ ਘਟ ਜਾਂਦੀ ਹੈ)।"},
        {icon: Repeat, title: "ਰੀਸੈਟ ਕਰਨ ਲਈ ਵਾਧੂ ਦੀ ਵਰਤੋਂ ਕਰੋ", body: "ਤੁਹਾਡਾ ਮਹੀਨਾਵਾਰ ਵਾਧੂ HELOC ਦਾ ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ; ਦੁਹਰਾਓ।"}
    ],
    faqTitle: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ",
    faq: [
        {q: "ਕੀ ਮੇਰਾ ਮੌਰਗੇਜ ਭੁਗਤਾਨ ਬਦਲੇਗਾ?", a: "ਨਹੀਂ—ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਆਪਣੇ ਕਰਜ਼ਾਦਾਤਾ ਨੂੰ ਮੁੜ-ਗਣਨਾ ਕਰਨ ਲਈ ਨਹੀਂ ਕਹਿੰਦੇ। ਅਸੀਂ ਆਮ ਤੌਰ 'ਤੇ ਮੁੜ-ਗਣਨਾ ਨਹੀਂ ਕਰਦੇ। ਭੁਗਤਾਨ ਉਹੀ ਰਹਿੰਦਾ ਹੈ; ਮਿਆਦ ਘਟ ਜਾਂਦੀ ਹੈ।"},
        {q: "ਕੀ ਮੈਨੂੰ ਇੱਕ ਵਿਸ਼ੇਸ਼ ਖਾਤੇ ਦੀ ਲੋੜ ਹੈ?", a: "ਕੋਈ ਵੀ HELOC ਜਾਂ ਮੁੜ-ਅਗਾਊਂਯੋਗ LOC ਕੰਮ ਕਰੇਗਾ। ਇਸਨੂੰ ਸਧਾਰਨ ਅਤੇ ਬੈਂਕ-ਅਗਿਆਤ ਰੱਖੋ।"},
        {q: "ਜੇ ਮੇਰਾ ਵਾਧੂ ਛੋਟਾ ਹੈ ਤਾਂ ਕੀ ਹੋਵੇਗਾ?", a: "ਛੋਟਾ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ। ਕੈਲਕੁਲੇਟਰ ਤੁਹਾਡੇ ਲਈ ਸੁਰੱਖਿਅਤ ਇੱਕਮੁਸ਼ਤ ਰਕਮ ਦਾ ਆਕਾਰ ਤੈਅ ਕਰਦਾ ਹੈ।"}
    ],
    form: {
        mortgageTitle: "1. ਮੌਰਗੇਜ ਵੇਰਵੇ",
        cashflowTitle: "2. ਨਕਦੀ ਪ੍ਰਵਾਹ ਅਤੇ HELOC",
        strategyTitle: "3. ਰਣਨੀਤੀ",
        assetsTitle: "4. ਨਕਦੀ ਅਤੇ ਸੰਪਤੀਆਂ (ਵਿਕਲਪਿਕ)",
        calculate: "ਗਣਨਾ ਕਰੋ",
        howChunksWork: "ਇੱਕਮੁਸ਼ਤ ਭੁਗਤਾਨ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ?",
    },
    results: {
        title: "ਨਤੀਜੇ",
        interestSaved: "ਬਚਾਇਆ ਗਿਆ ਵਿਆਜ",
        monthsSaved: "ਬਚਾਏ ਗਏ ਮਹੀਨੇ",
        miSaved: "ਬਚਾਇਆ ਗਿਆ MI/CMHC",
        baselineTitle: "ਆਧਾਰ-ਰੇਖਾ (ਕੁਝ ਨਾ ਕਰੋ)",
        strategyTitle: "ਚੰਕਰ ਰਣਨੀਤੀ ਨਾਲ",
        months: "ਮਹੀਨੇ",
        totalInterest: "ਕੁੱਲ ਵਿਆਜ",
        totalMI: "ਕੁੱਲ MI/CMHC",
        balanceOverTime: "ਸਮੇਂ ਦੇ ਨਾਲ ਬਕਾਇਆ",
        balanceDescription: "ਮੌਰਗੇਜ ਬਨਾਮ ਕੁੱਲ ਕਰਜ਼ ਚੰਕਰ ਰਣਨੀਤੀ ਨਾਲ",
        timelineTitle: "ਮਹੀਨਾ-ਦਰ-ਮਹੀਨਾ ਸਮਾਂ-ਰੇਖਾ ਦੇਖੋ",
        timelineDescription: "(ਸਾਰਣੀ ਨੂੰ ਹਲਕਾ ਰੱਖਣ ਲਈ ਪਹਿਲੇ 240 ਮਹੀਨੇ ਦਿਖਾ ਰਿਹਾ ਹੈ।)",
        table: {
            month: "ਮਹੀਨਾ",
            mortgageBal: "ਮੌਰਗੇਜ ਬਕਾਇਆ",
            helocBal: "HELOC ਬਕਾਇਆ",
            mortInt: "ਮੌਰਗੇਜ ਵਿਆਜ",
            mortPmt: "ਮੌਰਗੇਜ ਮੂਲਧਨ",
            chunk: "ਇੱਕਮੁਸ਼ਤ",
            helocInt: "HELOC ਵਿਆਜ",
            mi: "MI",
            surplusUsed: "ਵਰਤਿਆ ਗਿਆ ਵਾਧੂ"
        },
        placeholderTitle: "ਤੁਹਾਡੇ ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।",
        placeholderDescription: "ਸੰਭਾਵੀ ਬੱਚਤ ਦੇਖਣ ਲਈ ਫਾਰਮ ਭਰੋ ਅਤੇ 'ਗਣਨਾ ਕਰੋ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
        strategyCardTitle: "ਵਰਤੀ ਗਈ ਰਣਨੀਤੀ",
        arbitrageAlertTitle: "HELOC ਆਰਬਿਟਰੇਜ ਮੋਡ ਐਕਟੀਵੇਟਿਡ!",
        arbitrageAlertDescription: "ਤੁਹਾਡੀ HELOC ਦਰ ਤੁਹਾਡੀ ਮੌਰਗੇਜ ਦਰ ਤੋਂ ਘੱਟ ਹੈ। ਅਸੀਂ ਸਵੈਚਲਿਤ ਤੌਰ 'ਤੇ ਇੱਕ ਹੋਰ ਹਮਲਾਵਰ ਰਣਨੀਤੀ ਅਪਣਾਈ ਹੈ, ਤੁਹਾਡੀ ਸਸਤੀ HELOC ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਤੁਹਾਡੀ ਮਹਿੰਗੀ ਮੌਰਗੇਜ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਅਦਾ ਕਰਨ ਲਈ।"
    },
    disclaimer: "ਸਿਰਫ ਵਿਦਿਅਕ ਅਨੁਮਾਨ। ਕੋਈ ਬੈਂਕ ਫੀਸ, ਪ੍ਰੋਮੋ ਜਾਂ ਟੈਕਸ ਸ਼ਾਮਲ ਨਹੀਂ ਹਨ। ਨਤੀਜੇ ਸਕਾਰਾਤਮਕ ਮਹੀਨਾਵਾਰ ਵਾਧੂ, ਮੁੜ-ਅਗਾਊਂਯੋਗ ਲਾਈਨਾਂ ਅਤੇ ਬੈਚ ਕੀਤੇ ਬਿੱਲ ਭੁਗਤਾਨ ਨਾਲ ਸੁਧਰਦੇ ਹਨ।",
    explainers: {
        mortgageBalance: "ਮੌਰਗੇਜ 'ਤੇ ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਅਣ-ਅਦਾਇਗੀ ਮੂਲਧਨ (ਅਸਲ ਕਰਜ਼ਾ ਨਹੀਂ)।\nਉਦਾਹਰਨ: ਜੇਕਰ ਤੁਹਾਡਾ ਸਟੇਟਮੈਂਟ $612,350 ਬਕਾਇਆ ਦਿਖਾਉਂਦਾ ਹੈ, ਤਾਂ 612350 ਦਰਜ ਕਰੋ।",
        mortgageAPR: "ਮੌਰਗੇਜ ਲਈ ਤੁਹਾਡੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ। ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਇੱਕ ਸਥਿਰ ਦਰ ਹੈ, ਤਾਂ ਉਸਦੀ ਵਰਤੋਂ ਕਰੋ। ਜੇਕਰ ਪਰਿਵਰਤਨਸ਼ੀਲ ਹੈ, ਤਾਂ ਅੱਜ ਦੀ ਦੱਸੀ ਗਈ APR ਦੀ ਵਰਤੋਂ ਕਰੋ।\nਉਦਾਹਰਨ: 5.49",
        termRemaining: "ਤੁਹਾਡੀ ਮੌਜੂਦਾ ਮੌਰਗੇਜ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਬਚਿਆ ਹੈ। ਤੁਸੀਂ ਸਾਲਾਂ ਜਾਂ ਮਹੀਨਿਆਂ ਵਿੱਚ ਦਰਜ ਕਰ ਸਕਦੇ ਹੋ।\nਉਦਾਹਰਨ: 25 ਸਾਲ (ਜਾਂ 300 ਮਹੀਨੇ)।",
        monthlyMortgagePayment: "ਸਵੈ-ਗਣਨਾ ਲਈ ਖਾਲੀ ਛੱਡੋ। ਜੇਕਰ ਤੁਹਾਡੇ ਭੁਗਤਾਨ ਵਿੱਚ ਜਾਇਦਾਦ ਟੈਕਸ/ਬੀਮਾ ਸ਼ਾਮਲ ਹੈ, ਤਾਂ ਸਿਰਫ ਕਰਜ਼ਾ ਭੁਗਤਾਨ ਹਿੱਸਾ ਦਰਜ ਕਰੋ।\nਉਦਾਹਰਨ: ਖਾਲੀ ਛੱਡੋ, ਜਾਂ 3,456 ਦਰਜ ਕਰੋ।",
        homeValue: "ਅਨੁਮਾਨਿਤ ਮੌਜੂਦਾ ਬਾਜ਼ਾਰ ਮੁੱਲ। ਸਿਰਫ ਇਹ ਅਨੁਮਾਨ ਲਗਾਉਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ ਕਿ ਮੌਰਗੇਜ ਬੀਮਾ (MI/CMHC) 80% LTV 'ਤੇ ਕਦੋਂ ਖਤਮ ਹੁੰਦਾ ਹੈ।\nਉਦਾਹਰਨ: 750000।",
        monthlyMI: "ਮਹੀਨਾਵਾਰ ਮੌਰਗੇਜ ਬੀਮਾ (U.S.) ਜਾਂ CMHC ਪ੍ਰੀਮੀਅਮ (ਕੈਨੇਡਾ), ਜੇਕਰ ਤੁਸੀਂ ਭੁਗਤਾਨ ਕਰਦੇ ਹੋ। ਜੇਕਰ ਕੋਈ ਨਹੀਂ ਹੈ ਤਾਂ 0 ਦਰਜ करो।\nਉਦਾਹਰਨ: 120।",
        netIncome: "ਟੈਕਸਾਂ/ਕਟੌਤੀਆਂ ਤੋਂ ਬਾਅਦ ਹਰ ਮਹੀਨੇ ਘਰ ਲੈ ਜਾਣ ਵਾਲੀ ਤਨਖਾਹ (ਪਰਿਵਾਰਕ ਕੁੱਲ)।\nਉਦਾਹਰਨ: ਤੁਹਾਡੀ ਤਨਖਾਹ ਸਲਿੱਪਾਂ ਟੈਕਸ ਤੋਂ ਬਾਅਦ ਕੁੱਲ $8,900 ਹਨ → 8900 ਦਰਜ करो।",
        livingExpenses: "ਮੌਰਗੇਜ ਭੁਗਤਾਨ ਨੂੰ ਛੱਡ ਕੇ ਸਾਰੇ ਮਹੀਨਾਵਾਰ ਖਰਚੇ: ਸਹੂਲਤਾਂ, ਕਰਿਆਨਾ, ਆਦਿ।\nਉਦਾਹਰਨ: 4300।",
        helocAPR: "ਤੁਹਾਡੇ HELOC ਦੀ ਪਰਿਵਰਤਨਸ਼ੀਲ ਜਾਂ ਸਥਿਰ ਸਾਲਾਨਾ ਦਰ।\nਉਦਾਹਰਨ: 7.25।",
        helocLimit: "ਅੱਜ ਤੁਸੀਂ ਜੋ ਵੱਧ ਤੋਂ ਵੱਧ ਰਕਮ ਕਢਵਾ ਸਕਦੇ ਹੋ (ਕ੍ਰੈਡਿਟ ਸੀਮਾ ਘਟਾਓ ਕੋਈ ਮੌਜੂਦਾ HELOC ਬਕਾਇਆ)।\nਉਦਾਹਰਨ: ਕ੍ਰੈਡਿਟ ਸੀਮਾ 50,000 ਅਤੇ ਮੌਜੂਦਾ ਬਕਾਇਆ 8,500 → 41500 ਦਰਜ ਕਰੋ।",
        helocOpeningBalance: "ਰਣਨੀਤੀ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਤੁਹਾਡਾ ਮੌਜੂਦਾ HELOC ਬਕਾਇਆ। ਜੇਕਰ ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਨਹੀਂ ਕਢਵਾਇਆ ਹੈ ਤਾਂ 0 ਦੀ ਵਰਤੋਂ ਕਰੋ।\nਉਦਾਹਰਨ: 0 ਜਾਂ 8500।",
        readvanceable: "ਹਾਂ ਜੇਕਰ ਤੁਹਾਡੀ ਲਾਈਨ ਤੁਹਾਡੀ ਮੌਰਗੇਜ ਦਾ ਭੁਗਤਾਨ ਕਰਦੇ ही ਮੁੜ-ਅੱਗੇ ਵਧਦੀ ਹੈ (ਜਿਵੇਂ, STEP/HPP)। ਇੱਕ ਮੂਲ ਗੈਰ-ਮੁੜ-ਅਗਾਊਂਯੋਗ HELOC ਲਈ ਨਹੀਂ।",
        chunkMode: "ਆਟੋ = ਅਸੀਂ ਤੁਹਾਡੇ ਵਾਧੂ ਦੇ ਆਧਾਰ 'ਤੇ ਸੁਰੱਖਿਅਤ ਇੱਕਮੁਸ਼ਤ ਆਕਾਰ ਦਿੰਦੇ ਹਾਂ। ਫਿਕਸਡ = ਤੁਸੀਂ ਇੱਕਮੁਸ਼ਤ ਆਕਾਰ ਚੁਣਦੇ ਹੋ। ਆਟੋ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
        fixedChunkAmount: "ਹਰ ਵਾਰ ਜਦੋਂ ਅਸੀਂ ਤੁਹਾਡੇ ਮੌਰਗੇਜ ਮੂਲਧਨ ਨੂੰ 'ਇੱਕਮੁਸ਼ਤ' ਕਰਦੇ ਹਾਂ ਤਾਂ HELOC ਤੋਂ ਕਿੰਨੀ ਰਕਮ ਕਢਵਾਉਣੀ ਹੈ।\nਉਦਾਹਰਨ: 10000।",
        billTiming: "ਅਨੁਕੂਲਿਤ = ਤੁਸੀਂ ਇੱਕ ਵਾਰ ਵਿੱਚ ਜ਼ਿਆਦਾਤਰ ਬਿੱਲਾਂ ਨੂੰ ਬੈਚ ਕਰਦੇ ਹੋ, ਜਿਸ ਨਾਲ ਨਕਦ HELOC ਦੇ ਵਿਰੁੱਧ ਜ਼ਿਆਦਾ ਦੇਰ ਤੱਕ ਪਾਰਕ ਰਹਿੰਦਾ ਹੈ। ਆਮ = ਬਿੱਲ ਖਿੰਡੇ ਹੋਏ ਹਨ।",
        chunkModalTitle: "'ਇੱਕਮੁਸ਼ਤ' ਰਣਨੀਤੀ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ",
        chunkModalBody: "ਅਸੀਂ ਮੌਰਗੇਜ ਮੂਲਧਨ ਨੂੰ ਘਟਾਉਣ ਲਈ ਇੱਕ ਛੋਟਾ HELOC ਇੱਕਮੁਸ਼ਤ ਕਢਵਾਉਂਦੇ ਹਾਂ, ਫਿਰ ਤੁਹਾਡਾ ਮਹੀਨਾਵਾਰ ਵਾਧੂ HELOC ਦਾ ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ। ਇੱਕ ਵਾਰ HELOC ਬਕਾਇਆ ਜ਼ੀਰੋ ਦੇ ਨੇੜੇ ਹੋ ਜਾਣ 'ਤੇ, ਅਸੀਂ ਦੁਹਰਾਉਂਦੇ ਹਾਂ। ਪਹਿਲਾਂ ਘੱਟ ਮੂਲਧਨ = ਸਮੇਂ ਦੇ ਨਾਲ ਘੱਟ ਵਿਆਜ।",
        savings: "ਇੱਕ ਸਟੈਂਡਰਡ ਬਚਤ ਖਾਤੇ ਵਿੱਚ ਨਕਦ। ਇਸਦੀ ਵਰਤੋਂ ਪਹਿਲੇ ਦਿਨ HELOC ਬਕਾਏ ਦਾ ਭੁਗਤਾਨ ਕਰਨ ਲਈ ਕੀਤੀ ਜਾਵੇਗੀ।",
        chequing: "ਤੁਹਾਡੇ ਮੁੱਖ ਚੈਕਿੰਗ ਖਾਤੇ ਵਿੱਚ ਨਕਦ। ਇਸਦੀ ਵਰਤੋਂ ਤੁਹਾਡੇ HELOC ਮੂਲਧਨ ਨੂੰ ਤੁਰੰਤ ਘਟਾਉਣ ਲਈ ਵੀ ਕੀਤੀ ਜਾਵੇਗੀ।",
        shortTerm: "ਤਰਲ, ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੇ ਨਿਵੇਸ਼ਾਂ ਵਿੱਚ ਨਕਦ ਜਿਸਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਤੁਸੀਂ ਤਿਆਰ ਹੋ (ਉਦਾਹਰਨ ਲਈ, GICs, ਮਨੀ ਮਾਰਕੀਟ ਫੰਡ)।"
    },
    labels: {
        language: "ਭਾਸ਼ਾ",
        years: "ਸਾਲ",
        months: "ਮਹੀਨੇ",
        termRemaining: "ਬਾਕੀ ਮਿਆਦ",
        mortgageBalance: "ਮੌਰਗੇਜ ਬਕਾਇਆ",
        mortgageAPR: "ਮੌਰਗੇਜ APR (%)",
        monthlyMortgagePayment: "ਮਹੀਨਾਵਾਰ ਭੁਗਤਾਨ (ਵਿਕਲਪਿਕ)",
        homeValue: "ਘਰ ਦਾ ਮੁੱਲ (ਵਿਕਲਪਿਕ)",
        monthlyMI: "ਮਹੀਨਾਵਾਰ MI/CMHC (ਵਿਕਲਪਿਕ)",
        netIncome: "ਸ਼ੁੱਧ ਮਹੀਨਾਵਾਰ ਆਮਦਨ",
        livingExpenses: "ਮਹੀਨਾਵਾਰ ਰਹਿਣ-ਸਹਿਣ ਦੇ ਖਰਚੇ (ਮੌਰਗੇਜ ਨੂੰ ਛੱਡ ਕੇ)",
        helocAPR: "HELOC APR (%)",
        helocLimit: "HELOC ਸੀਮਾ (ਹੁਣੇ ਉਪਲਬਧ)",
        helocOpeningBalance: "HELOC ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ",
        chunkMode: "ਇੱਕਮੁਸ਼ਤ ਮੋਡ",
        fixedChunkAmount: "ਸਥਿਰ ਇੱਕਮੁਸ਼ਤ ਰਕਮ",
        billTiming: "ਬਿੱਲ ਦਾ ਸਮਾਂ",
        readvanceable: "ਮੁੜ-ਅਗਾਊਂਯੋਗ?",
        auto: "ਆਟੋ",
        fixed: "ਸਥਿਰ",
        optimized: "ਅਨੁਕੂਲਿਤ",
        typical: "ਆਮ",
        savings: "ਬਚਤ ਖਾਤਾ",
        chequing: "ਚੈਕਿੰਗ ਖਾਤਾ",
        shortTerm: "ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੇ ਨਿਵੇਸ਼",
    }
  },
  ar: {
    title: "مقدّر المساعدة HELOC",
    subtitle: "حوّل الوصول إلى HELOC إلى شهور أقل من رهنك العقاري. لا حاجة لتغيير المقرضين. فقط استخدم الائتمان الذي لديك بالفعل لتقليل رأس المال.",
    howTitle: "كيف تعمل هذه الاستراتيجية",
    steps: [
        {icon: PiggyBank, title: "إيداع الراتب في HELOC", body: "يقلل نقدك من الرصيد اليومي لـ HELOC، مما يقلل الفائدة."},
        {icon: Receipt, title: "دفع الفواتير من HELOC", body: "جمع الفواتير بحيث يبقى النقد مقابل الرصيد لفترة أطول."},
        {icon: Rocket, title: "سداد دفعة مقدمة للرهن العقاري", body: "أرسل دفعة مقدمة للرأس المال (يبقى الدفع كما هو؛ تقل المدة)."},
        {icon: Repeat, title: "استخدام الفائض لإعادة التعيين", body: "فائضك الشهري يسدد HELOC؛ كرر."}
    ],
    faqTitle: "أسئلة مكررة",
    faq: [
        {q: "هل سيتغير دفع الرهن العقاري الخاص بي؟", a: "لا—إلا إذا طلبت من المُقرض إعادة الحساب. نحن عادة لا نعيد الحساب. يبقى الدفع كما هو؛ تقل المدة."},
        {q: "هل أحتاج إلى حساب خاص؟", a: "أي HELOC أو LOC قابل لإعادة التقدم يعمل. اجعله بسيطًا ومستقلًا عن البنك."},
        {q: "ماذا لو كان فائضي صغيرًا؟", a: "الصغير لا يزال يعمل. تقوم الآلة الحاسبة بتحديد أحجام دفعات آمنة لك."}
    ],
    form: {
        mortgageTitle: "1. تفاصيل الرهن العقاري",
        cashflowTitle: "2. التدفق النقدي و HELOC",
        strategyTitle: "3. الاستراتيجية",
        assetsTitle: "4. النقد والأصول (اختياري)",
        calculate: "احسب",
        howChunksWork: "كيف تعمل الدفعات؟",
    },
    results: {
        title: "النتائج",
        interestSaved: "الفائدة المحفوظة",
        monthsSaved: "الأشهر المحفوظة",
        miSaved: "MI/CMHC المحفوظة",
        baselineTitle: "خط الأساس (لا تفعل شيئًا)",
        strategyTitle: "مع استراتيجية Chuncker",
        months: "أشهر",
        totalInterest: "إجمالي الفائدة",
        totalMI: "إجمالي MI/CMHC",
        balanceOverTime: "الرصيد بمرور الوقت",
        balanceDescription: "الرهن العقاري مقابل إجمالي الدين مع استراتيجية Chuncker",
        timelineTitle: "عرض الجدول الزمني شهريًا",
        timelineDescription: "(إظهار أول 240 شهرًا للحفاظ على الجدول خفيفًا.)",
        table: {
            month: "شهر",
            mortgageBal: "رصيد الرهن العقاري",
            helocBal: "رصيد HELOC",
            mortInt: "فائدة الرهن العقاري",
            mortPmt: "رأس مال الرهن العقاري",
            chunk: "دفعة",
            helocInt: "فائدة HELOC",
            mi: "MI",
            surplusUsed: "الفائض المستخدم"
        },
        placeholderTitle: "ستظهر نتائجك هنا.",
        placeholderDescription: "املأ النموذج وانقر على 'احسب' لرؤية مدخراتك المحتملة.",
        strategyCardTitle: "الاستراتيجية المستخدمة",
        arbitrageAlertTitle: "تم تفعيل وضع المراجحة HELOC!",
        arbitrageAlertDescription: "سعر فائدة HELOC الخاص بك أقل من سعر فائدة الرهن العقاري الخاص بك. لقد قمنا تلقائيًا بتطبيق استراتيجية أكثر جرأة، باستخدام HELOC الأرخص الخاص بك لسداد رهنك العقاري الباهظ بشكل أسرع."
    },
    disclaimer: "تقدير تعليمي فقط. لا يشمل رسوم البنك أو العروض الترويجية أو الضرائب. تتحسن النتائج مع وجود فائض شهري إيجابي وخطوط قابلة لإعادة التقدم ودفع فواتير مجمعة.",
    explainers: {
        mortgageBalance: "رصيدك الأساسي غير المسدد الحالي على الرهن العقاري (وليس القرض الأصلي).\nمثال: إذا كان كشف حسابك يوضح بقاء 612,350 دولارًا، فأدخل 612350.",
        mortgageAPR: "سعر الفائدة السنوي لرهنك العقاري. إذا كان لديك سعر فائدة ثابت، فاستخدمه. إذا كان متغيرًا، فاستخدم سعر الفائدة السنوي المعلن اليوم.\nمثال: 5.49",
        termRemaining: "كم من الوقت المتبقي على رهنك العقاري الحالي. يمكنك إدخاله بالسنوات أو الأشهر.\nمثال: 25 عامًا (أو 300 شهر).",
        monthlyMortgagePayment: "اتركه فارغًا للحساب التلقائي. إذا كان دفعك يشمل ضريبة الأملاك/التأمين، فأدخل جزء دفع القرض فقط.\nمثال: اتركه فارغًا، أو أدخل 3,456.",
        homeValue: "القيمة السوقية الحالية المقدرة. تستخدم فقط لتقدير متى ينتهي تأمين الرهن العقاري (MI/CMHC) عند 80% LTV.\nمثال: 750000.",
        monthlyMI: "تأمين الرهن العقاري الشهري (الولايات المتحدة) أو قسط CMHC (كندا)، إذا كنت تدفع واحدًا. أدخل 0 إذا لم يكن هناك.\nمثال: 120.",
        netIncome: "صافي الأجر الشهري بعد الضرائب/الخصومات (إجمالي الأسرة).\nمثال: إجمالي قسائم الدفع الخاصة بك بعد خصم الضرائب هو 8,900 دولار → أدخل 8900.",
        livingExpenses: "جميع المصاريف الشهرية باستثناء دفع الرهن العقاري: المرافق، البقالة، إلخ.\nمثال: 4300.",
        helocAPR: "سعر الفائدة السنوي المتغير أو الثابت لـ HELOC الخاص بك.\nمثال: 7.25.",
        helocLimit: "الحد الأقصى الذي يمكنك سحبه اليوم (حد الائتمان مطروحًا منه أي رصيد HELOC حالي).\nمثال: حد ائتمan 50,000 ورصيد حالي 8,500 ← أدخل 41500.",
        helocOpeningBalance: "رصيد HELOC الحالي قبل بدء الاستراتيجية. استخدم 0 إذا لم تكن قد سحبت بعد.\nمثال: 0 أو 8500.",
        readvanceable: "نعم إذا كان خطك يتقدم مرة أخرى أثناء دفعك لرهنك العقاري (على سبيل المثال، STEP/HPP). لا لـ HELOC أساسي غير قابل لإعادة التقدم.",
        chunkMode: "تلقائي = نقوم بتحديد أحجام دفعات آمنة بناءً على فائضك. ثابت = تختار حجم الدفعة. يوصى بالتلقائي.",
        fixedChunkAmount: "كمية السحب من HELOC في كل مرة نقوم فيها 'بدفع' رأس مال رهنك العقاري.\nمثال: 10000.",
        billTiming: "محسن = تقوم بتجميع معظم الفواتير مرة واحدة، مع إبقاء النقد مركونًا مقابل HELOC لفترة أطول. نموذجي = الفواتير متفرقة.",
        chunkModalTitle: "كيف تعمل استراتيجية 'الدفعة'",
        chunkModalBody: "نقوم بسحب دفعة صغيرة من HELOC لخفض رأس مال الرهن العقاري، ثم يقوم فائضك الشهري بسداد HELOC. بمجرد أن يقترب رصيد HELOC من الصفر، نكرر العملية. رأس مال أقل في وقت مبكر = فائدة أقل بمرور الوقت.",
        savings: "نقد في حساب توفير قياسي. سيتم استخدامه لسداد رصيد HELOC في اليوم الأول.",
        chequing: "نقد في حسابك الجاري الأساسي. سيتم استخدامه أيضًا لتقليل رأس مال HELOC الخاص بك على الفور.",
        shortTerm: "نقد في استثمارات سائلة قصيرة الأجل ترغب في استخدامها (مثل شهادات الإيداع، صناديق سوق المال)."
    },
    labels: {
        language: "لغة",
        years: "سنوات",
        months: "شهور",
        termRemaining: "المدة المتبقية",
        mortgageBalance: "رصيد الرهن العقاري",
        mortgageAPR: "معدل الفائدة السنوية للرهن العقاري (%)",
        monthlyMortgagePayment: "الدفع الشهري (اختياري)",
        homeValue: "قيمة المنزل (اختياري)",
        monthlyMI: "MI/CMHC الشهري (اختياري)",
        netIncome: "صافي الدخل الشهري",
        livingExpenses: "نفقات المعيشة الشهرية (باستثناء الرهن العقاري)",
        helocAPR: "معدل الفائدة السنوية لـ HELOC (%)",
        helocLimit: "حد HELOC (متوفر الآن)",
        helocOpeningBalance: "رصيد HELOC الافتتاحي",
        chunkMode: "وضع الدفعة",
        fixedChunkAmount: "مبلغ الدفعة الثابتة",
        billTiming: "توقيت الفاتورة",
        readvanceable: "قابل لإعادة التقدم؟",
        auto: "تلقائي",
        fixed: "ثابت",
        optimized: "محسن",
        typical: "نموذجي",
        savings: "حساب التوفير",
        chequing: "الحساب الجاري",
        shortTerm: "استثمارات قصيرة الأجل",
    }
  }
};

const initial: Inputs = {
  mortgageBalance: 600000,
  mortgageAPR: 5.5,
  termMonthsRemaining: 300,
  monthlyMortgagePayment: undefined,
  homeValue: 750000,
  monthlyMI: 0,
  netIncome: 9000,
  livingExpenses: 4500,
  savings: { savings: 0, chequing: 0, shortTerm: 0 },
  helocAPR: 7.5,
  helocLimit: 40000,
  helocOpeningBalance: 0,
  readvanceable: true,
  chunkMode: 'AUTO',
  fixedChunkAmount: 10000,
  billTiming: 'OPTIMIZED',
};

const InputField = ({ name, label, children, explainer }: { name: string, label: string, children: React.ReactNode, explainer?: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label htmlFor={name}>{label}</Label>
      {explainer && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`Help for ${label}`}>
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-wrap">
              <p>{explainer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
  </div>
);

const ADMIN_EMAIL = 'emperorsrujal@gmail.com';

export default function ChunkerCalculatorPage() {
  const [lang, setLang] = useState('en');
  const [form, setForm] = useState<Inputs>(initial);
  const [res, setRes] = useState<Outputs | null>(null);
  const [termMode, setTermMode] = useState<'YEARS' | 'MONTHS'>('YEARS');
  const [termYears, setTermYears] = useState<number>(initial.termMonthsRemaining / 12);
  const [termMonths, setTermMonths] = useState<number>(initial.termMonthsRemaining);
  const { user, isUserLoading } = useUser();
  const router = useRouter();


  const t = i18n[lang] || i18n.en;

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      return;
    }
    
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const detectedLang = localStorage.getItem('mc_lang') || navigator.language;
    const supportedLangs = ['en', 'fr-CA', 'es', 'pt-BR', 'hi', 'pa', 'ar'];
    const finalLang = supportedLangs.includes(detectedLang) ? detectedLang : 'en';
    setLang(finalLang);
    document.documentElement.dir = finalLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const handleLangChange = (newLang: string) => {
    if (!newLang) return;
    setLang(newLang);
    localStorage.setItem('mc_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  }

  const onChange = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };
  
  const handleTermYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const years = Number(e.target.value);
    setTermYears(years);
    setForm(f => ({ ...f, termMonthsRemaining: Math.round(years * 12) }));
  };

  const handleTermMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const months = Number(e.target.value);
    setTermMonths(months);
    setForm(f => ({ ...f, termMonthsRemaining: months }));
  };
  
  const handleTermModeChange = (mode: 'YEARS' | 'MONTHS') => {
    if (mode === termMode) return;
    if (mode === 'MONTHS') {
        const m = Math.max(1, Math.round(termYears * 12));
        setTermMonths(m);
        setForm(f => ({ ...f, termMonthsRemaining: m }));
    } else { // switching to YEARS
        const y = Math.max(1, Math.ceil(termMonths / 12));
        setTermYears(y);
        setForm(f => ({...f, termMonthsRemaining: y * 12}))
    }
    setTermMode(mode);
  };

  const run = () => {
    const out = simulate(form);
    setRes(out);
  };
  
  const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const isSurplusNegative = useMemo(() => {
    const monthlyPayment = form.monthlyMortgagePayment || pmt(form.mortgageAPR, form.termMonthsRemaining, form.mortgageBalance);
    return form.netIncome > 0 && (form.livingExpenses + monthlyPayment + (form.monthlyMI || 0)) >= form.netIncome;
  }, [form]);

  const isChunkTooLarge = useMemo(() => {
      return form.chunkMode === 'FIXED' && (form.fixedChunkAmount || 0) > form.helocLimit;
  }, [form]);

  if (isUserLoading || (!user && user?.email !== ADMIN_EMAIL)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-50">
       <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
            <div className="flex items-center border rounded-md p-1 bg-white">
                <Select value={lang} onValueChange={handleLangChange}>
                  <SelectTrigger className="w-[140px] shadow-inner">
                    <SelectValue placeholder={t.labels.language} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr-CA">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="pt-BR">Português</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </div>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto mb-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t.howTitle}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {t.steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 rounded-full p-3 mb-2">
                        <Icon className="h-6 w-6 text-primary"/>
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.body}</p>
                    </div>
                  )
              })}
            </div>
            <h4 className="font-semibold mt-6 mb-2">{t.faqTitle}</h4>
            <Accordion type="single" collapsible className="w-full">
              {t.faq.map((faq, index) => (
                <AccordionItem value={`faq-${index}`} key={index}>
                  <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader><CardTitle>{t.form.mortgageTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="mortgageBalance" label={t.labels.mortgageBalance} explainer={t.explainers.mortgageBalance}>
                  <Input id="mortgageBalance" type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
              </InputField>
              <InputField name="mortgageAPR" label={t.labels.mortgageAPR} explainer={t.explainers.mortgageAPR}>
                  <Input id="mortgageAPR" type="number" step="0.01" value={form.mortgageAPR} onChange={e => onChange("mortgageAPR", Number(e.target.value))}/>
              </InputField>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label>{t.labels.termRemaining}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{t.explainers.termRemaining}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1 ml-auto border rounded-md p-0.5 bg-muted/50">
                        <Button type="button" size="sm" variant={termMode === 'YEARS' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => handleTermModeChange('YEARS')}>{t.labels.years}</Button>
                        <Button type="button" size="sm" variant={termMode === 'MONTHS' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => handleTermModeChange('MONTHS')}>{t.labels.months}</Button>
                    </div>
                </div>
                {termMode === 'YEARS' ? (
                     <Input type="number" value={termYears} onChange={handleTermYearsChange} />
                ) : (
                     <Input type="number" value={termMonths} onChange={handleTermMonthsChange} />
                )}
              </div>
              <InputField name="monthlyMortgagePayment" label={t.labels.monthlyMortgagePayment} explainer={t.explainers.monthlyMortgagePayment}>
                  <Input id="monthlyMortgagePayment" type="number" value={form.monthlyMortgagePayment ?? ""} onChange={e => onChange("monthlyMortgagePayment", e.target.value === "" ? undefined : Number(e.target.value))}/>
              </InputField>
              <InputField name="homeValue" label={t.labels.homeValue} explainer={t.explainers.homeValue}>
                  <Input id="homeValue" type="number" value={form.homeValue ?? 0} onChange={e => onChange("homeValue", e.target.value === "" ? 0 : Number(e.target.value))}/>
              </InputField>
              <InputField name="monthlyMI" label={t.labels.monthlyMI} explainer={t.explainers.monthlyMI}>
                  <Input id="monthlyMI" type="number" value={form.monthlyMI ?? 0} onChange={e => onChange("monthlyMI", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>

          <Card className="shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader><CardTitle>{t.form.cashflowTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="netIncome" label={t.labels.netIncome} explainer={t.explainers.netIncome}>
                <Input id="netIncome" type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))}/>
              </InputField>
              <InputField name="livingExpenses" label={t.labels.livingExpenses} explainer={t.explainers.livingExpenses}>
                <Input id="livingExpenses" type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
              </InputField>
              {isSurplusNegative && <Alert variant="destructive" className="text-xs"><AlertDescription>Your monthly surplus is zero or negative. Results will be limited.</AlertDescription></Alert>}
              <InputField name="helocAPR" label={t.labels.helocAPR} explainer={t.explainers.helocAPR}>
                <Input id="helocAPR" type="number" step="0.01" value={form.helocAPR} onChange={e => onChange("helocAPR", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocLimit" label={t.labels.helocLimit} explainer={t.explainers.helocLimit}>
                <Input id="helocLimit" type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocOpeningBalance" label={t.labels.helocOpeningBalance} explainer={t.explainers.helocOpeningBalance}>
                <Input id="helocOpeningBalance" type="number" value={form.helocOpeningBalance ?? 0} onChange={e => onChange("helocOpeningBalance", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>

           <Card className="shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader><CardTitle>{t.form.assetsTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="savings" label={t.labels.savings} explainer={t.explainers.savings}>
                <Input id="savings" type="number" value={form.savings.savings} onChange={e => onChange("savings", { ...form.savings, savings: Number(e.target.value) })}/>
              </InputField>
              <InputField name="chequing" label={t.labels.chequing} explainer={t.explainers.chequing}>
                <Input id="chequing" type="number" value={form.savings.chequing} onChange={e => onChange("savings", { ...form.savings, chequing: Number(e.target.value) })}/>
              </InputField>
              <InputField name="shortTerm" label={t.labels.shortTerm} explainer={t.explainers.shortTerm}>
                <Input id="shortTerm" type="number" value={form.savings.shortTerm} onChange={e => onChange("savings", { ...form.savings, shortTerm: Number(e.target.value) })}/>
              </InputField>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader><CardTitle>{t.form.strategyTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="chunkMode" label={t.labels.chunkMode} explainer={t.explainers.chunkMode}>
                  <RadioGroup value={form.chunkMode} onValueChange={(v: "AUTO" | "FIXED") => onChange("chunkMode", v)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="AUTO" id="auto"/><Label htmlFor="auto">{t.labels.auto}</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="FIXED" id="fixed"/><Label htmlFor="fixed">{t.labels.fixed}</Label></div>
                  </RadioGroup>
              </InputField>

              {form.chunkMode === 'FIXED' && (
                <InputField name="fixedChunkAmount" label={t.labels.fixedChunkAmount} explainer={t.explainers.fixedChunkAmount}>
                  <Input type="number" value={form.fixedChunkAmount ?? 10000} onChange={e => onChange("fixedChunkAmount", Number(e.target.value))} />
                   {isChunkTooLarge && <p className="text-xs text-destructive mt-1">Your fixed chunk exceeds HELOC availability. Reduce amount or use Auto mode.</p>}
                </InputField>
              )}

              <InputField name="billTiming" label={t.labels.billTiming} explainer={t.explainers.billTiming}>
                  <RadioGroup value={form.billTiming} onValueChange={(v: "OPTIMIZED" | "TYPICAL") => onChange("billTiming", v)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="OPTIMIZED" id="optimized"/><Label htmlFor="optimized">{t.labels.optimized}</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="TYPICAL" id="typical"/><Label htmlFor="typical">{t.labels.typical}</Label></div>
                  </RadioGroup>
              </InputField>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="readvanceable">{t.labels.readvanceable}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{t.explainers.readvanceable}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
                <Switch id="readvanceable" checked={form.readvanceable} onCheckedChange={v => onChange("readvanceable", v)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={run} className="w-full" size="lg">{t.form.calculate}</Button>
            </CardFooter>
          </Card>
          <div className="text-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-muted-foreground"><HelpCircle className="h-4 w-4 mr-1" />{t.form.howChunksWork}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.explainers.chunkModalTitle}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">{t.explainers.chunkModalBody}</p>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="lg:col-span-3">
          {res ? (
             <div className="space-y-6">
                {res.strategyType === 'HELOC Arbitrage' && (
                    <Alert className="bg-primary/10 border-primary/50 text-primary-foreground">
                        <Zap className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary font-bold">{t.results.arbitrageAlertTitle}</AlertTitle>
                        <AlertDescription className="text-primary/90">
                           {t.results.arbitrageAlertDescription}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.interestSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.interestSaved)}</p></CardContent>
                    </Card>
                     <Card className="shadow-md bg-white">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.monthsSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{res.totals.monthsSaved}</p></CardContent>
                    </Card>
                     <Card className="shadow-md bg-white">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.miSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.miSaved)}</p></CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-md bg-white">
                        <CardHeader><CardTitle>{t.results.baselineTitle}</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>{t.results.months}: <span className="font-semibold">{res.baseline.months}</span></p>
                            <p>{t.results.totalInterest}: <span className="font-semibold">{currencyFormatter(res.baseline.totalInterest)}</span></p>
                            <p>{t.results.totalMI}: <span className="font-semibold">{currencyFormatter(res.baseline.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                     <Card className="shadow-md bg-white">
                        <CardHeader><CardTitle>{t.results.strategyTitle}</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                             <p>{t.results.months}: <span className="font-semibold">{res.strategy.months}</span></p>
                             <p>{t.results.totalInterest}: <span className="font-semibold">{currencyFormatter(res.strategy.totalInterest)}</span></p>
                             <p>{t.results.totalMI}: <span className="font-semibold">{currencyFormatter(res.strategy.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                </div>
                 <Card className="shadow-md bg-white">
                  <CardHeader>
                      <CardTitle>{t.results.strategyCardTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                      <p>Mode: <span className="font-semibold">{res.strategyType}</span></p>
                      {(res.optimalChunkSize && res.optimalChunkSize > 0) && (
                          <p>Optimal First Chunk: <span className="font-semibold">{currencyFormatter(res.optimalChunkSize)}</span></p>
                      )}
                  </CardContent>
                </Card>
                 <Card className="shadow-xl bg-white">
                  <CardHeader>
                      <CardTitle>{t.results.balanceOverTime}</CardTitle>
                      <CardDescription>{t.results.balanceDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={res.timeline.slice(0, 240)} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickFormatter={(v) => `Yr ${Math.floor(v/12)}`} minTickGap={30}/>
                                <YAxis tickFormatter={(v) => `${(v/1000)}k`}/>
                                <RechartsTooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter(value as number)} />} />
                                <Legend />
                                <Line type="monotone" dataKey="mortgageBal" name="Baseline Mortgage" stroke="#8884d8" dot={false}/>
                                <Line type="monotone" dataKey="helocBal" name="Strategy Total Debt" stroke="#82ca9d" dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                  </CardContent>
                </Card>
                <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">{t.results.timelineTitle}</summary>
                    <div className="overflow-auto mt-2 border rounded-lg max-h-96 bg-white shadow-inner">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-secondary">
                          <tr className="text-left">
                            <th className="p-2">{t.results.table.month}</th>
                            <th className="p-2">{t.results.table.mortgageBal}</th>
                            <th className="p-2">{t.results.table.mortInt}</th>
                            <th className="p-2">{t.results.table.mortPmt}</th>
                            <th className="p-2">{t.results.table.helocBal}</th>
                            <th className="p-2">{t.results.table.chunk}</th>
                            <th className="p-2">{t.results.table.helocInt}</th>
                            <th className="p-2">{t.results.table.mi}</th>
                            <th className="p-2">{t.results.table.surplusUsed}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.timeline.slice(0, 240).map(row => (
                            <tr key={row.month} className="border-b">
                              <td className="p-2">{row.month}</td>
                              <td className="p-2">{currencyFormatter(row.mortgageBal)}</td>
                              <td className="p-2">{currencyFormatter(row.mortgageInterestPaid)}</td>
                              <td className="p-2">{currencyFormatter(row.mortgagePrincipalPaid)}</td>
                              <td className="p-2">{currencyFormatter(row.helocBal)}</td>
                              <td className="p-2">{currencyFormatter(row.chunkApplied)}</td>
                              <td className="p-2">{currencyFormatter(row.helocInterest)}</td>
                              <td className="p-2">{currencyFormatter(row.mi)}</td>
                              <td className="p-2">{currencyFormatter(row.surplusUsed)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                       {t.results.timelineDescription}
                    </div>
                </details>
                <Alert variant="default" className="text-xs bg-white shadow-sm">
                    <AlertDescription>{t.disclaimer}</AlertDescription>
                </Alert>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-xl h-full bg-white/50">
                 <p className="text-lg font-semibold">{t.results.placeholderTitle}</p>
                 <p className="text-muted-foreground mt-2">{t.results.placeholderDescription}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

    