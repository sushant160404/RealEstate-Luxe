import { Router } from 'express';

export const mortgageRouter = Router();

// POST /api/mortgage/calculate (public)
mortgageRouter.post('/calculate', (req, res) => {
  const {
    homePrice = 48500000,
    downPayment = 9700000,
    interestRate = 8.5,
    loanTermYears = 20,
    annualPropertyTax,
    annualHomeInsurance,
    monthlyHoa = 12000,
  } = req.body;

  const price = Number(homePrice);
  const down = Number(downPayment);
  const principal = Math.max(0, price - down);
  const rate = Number(interestRate);
  const years = Number(loanTermYears);

  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;

  let monthlyPrincipalInterest = 0;
  if (monthlyRate > 0 && numberOfPayments > 0) {
    monthlyPrincipalInterest =
      principal * ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1));
  } else {
    monthlyPrincipalInterest = principal / Math.max(1, numberOfPayments);
  }

  const taxMonthly = (Number(annualPropertyTax) || price * 0.002) / 12;
  const insuranceMonthly = (Number(annualHomeInsurance) || 25000) / 12;
  const hoa = Number(monthlyHoa) || 0;

  const totalMonthly = monthlyPrincipalInterest + taxMonthly + insuranceMonthly + hoa;
  const totalLoanCost = monthlyPrincipalInterest * numberOfPayments;
  const totalInterestPaid = Math.max(0, totalLoanCost - principal);

  res.json({
    success: true,
    calculation: {
      homePrice: price,
      principal: Math.round(principal),
      downPayment: Math.round(down),
      downPaymentPercent: Number(((down / price) * 100).toFixed(1)),
      interestRate: rate,
      termYears: years,
      monthlyBreakdown: {
        principalAndInterest: Math.round(monthlyPrincipalInterest),
        propertyTax: Math.round(taxMonthly),
        homeInsurance: Math.round(insuranceMonthly),
        hoa: Math.round(hoa),
        totalMonthly: Math.round(totalMonthly),
      },
      lifetimeSummary: {
        totalInterestPaid: Math.round(totalInterestPaid),
        totalLoanCost: Math.round(totalLoanCost + down),
      },
    },
  });
});
