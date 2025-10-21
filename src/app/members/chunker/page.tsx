'use client';
import React, { useState } from "react";
import { simulate, Inputs, Outputs } from "@/lib/chunker";
import { Button } from "@/components/ui/button";

const initial: Inputs = {
  mortgageBalance: 600000,
  mortgageAPR: 5.5,
  termMonthsRemaining: 300,
  monthlyMortgagePayment: undefined, // auto-calc if undefined
  homeValue: 750000,
  monthlyMI: 0, // set if user pays MI/CMHC
  netIncome: 9000,
  livingExpenses: 4500,
  helocAPR: 7.5,
  helocLimit: 40000,
  helocOpeningBalance: 0,
  readvanceable: true,
  chunkMode: "AUTO",
  fixedChunkAmount: undefined,
  billTiming: "OPTIMIZED",
};

export default function MemberHelocCalculator() {
  const [form, setForm] = useState<Inputs>(initial);
  const [res, setRes] = useState<Outputs | null>(null);

  function onChange<K extends keyof Inputs>(k: K, v: Inputs[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function run() {
    const out = simulate(form);
    setRes(out);
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mortgage Cutter: HELOC-Assist Estimator</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Mortgage</h2>
          <label className="block mb-2">
            Balance
            <input type="number" className="w-full border px-2 py-1"
              value={form.mortgageBalance}
              onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            APR (%)
            <input type="number" className="w-full border px-2 py-1"
              value={form.mortgageAPR}
              onChange={e => onChange("mortgageAPR", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Months remaining
            <input type="number" className="w-full border px-2 py-1"
              value={form.termMonthsRemaining}
              onChange={e => onChange("termMonthsRemaining", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Monthly payment (leave blank to auto-calc)
            <input type="number" className="w-full border px-2 py-1"
              value={form.monthlyMortgagePayment ?? ""}
              onChange={e => onChange("monthlyMortgagePayment", e.target.value === "" ? undefined : Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Home value (for MI cutoff; optional)
            <input type="number" className="w-full border px-2 py-1"
              value={form.homeValue ?? ""}
              onChange={e => onChange("homeValue", e.target.value === "" ? undefined : Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Monthly MI/CMHC (if any)
            <input type="number" className="w-full border px-2 py-1"
              value={form.monthlyMI ?? 0}
              onChange={e => onChange("monthlyMI", Number(e.target.value))}/>
          </label>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Cash Flow</h2>
          <label className="block mb-2">
            Net income (monthly)
            <input type="number" className="w-full border px-2 py-1"
              value={form.netIncome}
              onChange={e => onChange("netIncome", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Living expenses (exclude mortgage)
            <input type="number" className="w-full border px-2 py-1"
              value={form.livingExpenses}
              onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
          </label>

          <h2 className="font-semibold mt-4 mb-2">HELOC</h2>
          <label className="block mb-2">
            APR (%)
            <input type="number" className="w-full border px-2 py-1"
              value={form.helocAPR}
              onChange={e => onChange("helocAPR", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Limit available now
            <input type="number" className="w-full border px-2 py-1"
              value={form.helocLimit}
              onChange={e => onChange("helocLimit", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Opening balance
            <input type="number" className="w-full border px-2 py-1"
              value={form.helocOpeningBalance ?? 0}
              onChange={e => onChange("helocOpeningBalance", Number(e.target.value))}/>
          </label>
          <label className="block mb-2">
            Readvanceable?
            <select className="w-full border px-2 py-1"
              value={form.readvanceable ? "yes" : "no"}
              onChange={e => onChange("readvanceable", e.target.value === "yes")}>
              <option value="yes">Yes (HPP/STEP/etc.)</option>
              <option value="no">No</option>
            </select>
          </label>

          <h2 className="font-semibold mt-4 mb-2">Strategy</h2>
          <label className="block mb-2">
            Chunk mode
            <select className="w-full border px-2 py-1"
              value={form.chunkMode}
              onChange={e => onChange("chunkMode", e.target.value as any)}>
              <option value="AUTO">Auto (safer)</option>
              <option value="FIXED">Fixed amount</option>
            </select>
          </label>
          {form.chunkMode === "FIXED" && (
            <label className="block mb-2">
              Fixed chunk amount
              <input type="number" className="w-full border px-2 py-1"
                value={form.fixedChunkAmount ?? 10000}
                onChange={e => onChange("fixedChunkAmount", Number(e.target.value))}/>
            </label>
          )}
          <label className="block mb-4">
            Bill timing
            <select className="w-full border px-2 py-1"
              value={form.billTiming}
              onChange={e => onChange("billTiming", e.target.value as any)}>
              <option value="OPTIMIZED">Optimized (batch bills)</option>
              <option value="TYPICAL">Typical (spread bills)</option>
            </select>
          </label>

          <Button onClick={run}>
            Calculate
          </Button>
        </div>
      </div>

      {res && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Months Saved</div>
              <div className="text-2xl font-bold">{res.totals.monthsSaved}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Interest Saved</div>
              <div className="text-2xl font-bold">
                ${Math.round(res.totals.interestSaved).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">MI/CMHC Saved</div>
              <div className="text-2xl font-bold">
                ${Math.round(res.totals.miSaved).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <h3 className="font-semibold mb-2">Baseline (Do Nothing)</h3>
              <div>Months: {res.baseline.months}</div>
              <div>Interest: ${Math.round(res.baseline.totalInterest).toLocaleString()}</div>
              <div>MI/CMHC: ${Math.round(res.baseline.totalMI).toLocaleString()}</div>
            </div>
            <div className="p-3 border rounded">
              <h3 className="font-semibold mb-2">Strategy</h3>
              <div>Months: {res.strategy.months}</div>
              <div>Interest: ${Math.round(res.strategy.totalInterest).toLocaleString()}</div>
              <div>MI/CMHC: ${Math.round(res.strategy.totalMI).toLocaleString()}</div>
            </div>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer">Open Month-by-Month Timeline</summary>
            <div className="overflow-auto mt-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Month</th>
                    <th className="p-2">Mortgage Bal</th>
                    <th className="p-2">HELOC Bal</th>
                    <th className="p-2">Chunk</th>
                    <th className="p-2">HELOC Int</th>
                    <th className="p-2">MI</th>
                    <th className="p-2">Surplus Used</th>
                  </tr>
                </thead>
                <tbody>
                  {res.timeline.slice(0, 240).map(row => (
                    <tr key={row.month} className="border-b">
                      <td className="p-2">{row.month}</td>
                      <td className="p-2">${Math.round(row.mortgageBal).toLocaleString()}</td>
                      <td className="p-2">${Math.round(row.helocBal).toLocaleString()}</td>
                      <td className="p-2">${Math.round(row.chunkApplied).toLocaleString()}</td>
                      <td className="p-2">${Math.round(row.helocInterest).toLocaleString()}</td>
                      <td className="p-2">${Math.round(row.mi).toLocaleString()}</td>
                      <td className="p-2">${Math.round(row.surplusUsed).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs text-gray-500 mt-2">
                (Showing first 240 months to keep the table light. Download CSV in a future release.)
              </div>
            </div>
          </details>

          <div className="mt-4 text-xs text-gray-500">
            Educational estimate only. No bank fees, promos, or taxes included. Results improve with
            positive monthly surplus, readvanceable lines, and batched bill pay.
          </div>
        </div>
      )}
    </div>
  );
}
