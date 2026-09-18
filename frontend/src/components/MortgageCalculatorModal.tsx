import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Percent, ShieldCheck } from 'lucide-react';
import { formatINR, formatIndianNumber } from '../utils/currency';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 48500000,
}) => {
  if (!isOpen) return null;

  const [price, setPrice] = useState(defaultPrice);
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(8.5); // Standard Indian benchmark home loan rate
  const [term, setTerm] = useState(20); // 20 years is standard in India
  const [annualTaxRate, setAnnualTaxRate] = useState(0.2); // ~0.2% municipal property tax in India
  const [annualInsurance, setAnnualInsurance] = useState(25000); // Home insurance in INR
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(12000); // Society maintenance dues in INR

  const downPaymentAmount = (price * downPercent) / 100;
  const loanAmount = price - downPaymentAmount;
  const monthlyRate = rate / 100 / 12;
  const totalMonths = term * 12;

  const monthlyPrincipalInterest =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const monthlyTax = (price * (annualTaxRate / 100)) / 12;
  const monthlyIns = annualInsurance / 12;
  const totalMonthlyEMI = Math.round(monthlyPrincipalInterest + monthlyTax + monthlyIns + monthlyMaintenance);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 flex items-center justify-center text-[#16a34a]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Home Loan EMI Estimator</h3>
              <p className="text-xs text-neutral-500">
                Accurate Indian home loan calculation with society maintenance & municipal tax
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Output Banner */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 mb-6">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Total Estimated Monthly Outlay (EMI + Maintenance)
          </span>
          <div className="text-4xl font-extrabold text-white mt-1">
            ₹{totalMonthlyEMI.toLocaleString('en-IN')}{' '}
            <span className="text-base font-normal text-neutral-400">/ month</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 mt-5 border-t border-white/10 text-xs">
            <div>
              <div className="text-neutral-400">Loan EMI</div>
              <div className="font-semibold text-neutral-200 mt-0.5">
                ₹{Math.round(monthlyPrincipalInterest).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">Property Tax</div>
              <div className="font-semibold text-neutral-200 mt-0.5">
                ₹{Math.round(monthlyTax).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">Insurance</div>
              <div className="font-semibold text-neutral-200 mt-0.5">
                ₹{Math.round(monthlyIns).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">Society Maint.</div>
              <div className="font-semibold text-neutral-200 mt-0.5">
                ₹{Math.round(monthlyMaintenance).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Input Sliders & Controls */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Property Purchase Price</span>
              <span className="text-neutral-900 font-bold">
                {formatINR(price)} ({formatIndianNumber(price)})
              </span>
            </div>
            <input
              type="range"
              min="2500000"
              max="250000000"
              step="500000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#22c55e] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Down Payment ({downPercent}%)</span>
                <span>{formatINR(downPaymentAmount)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPercent}
                onChange={(e) => setDownPercent(Number(e.target.value))}
                className="w-full accent-[#22c55e] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Interest Rate (p.a.)</span>
                <span>{rate}%</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="14.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#22c55e] cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Loan Tenure
              </label>
              <div className="flex gap-2">
                {[10, 15, 20, 25].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      term === t
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {t} Yrs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Monthly Society Maintenance (₹)
              </label>
              <input
                type="number"
                value={monthlyMaintenance}
                onChange={(e) => setMonthlyMaintenance(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            *Indicative estimates based on prevailing Indian bank lending benchmarks (SBI/HDFC/ICICI).
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
