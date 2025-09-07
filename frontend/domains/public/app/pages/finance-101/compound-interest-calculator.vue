<script setup>

/* page */

definePageMeta({
  name: 'public.finance-101.compound-interest-calculator',
});

useSeoMeta({
  title: 'Compound Interest Calculator',
  description: 'Calculate the future value of your savings with compound interest.',
});


/* calculator data */

const calculatorData = reactive({
  principal: 10000,
  annualRate: 7,
  years: 30,
  compoundingFrequency: '12',
  monthlyContribution: 0,
  contributionFrequency: '12',
});

const compoundingOptions = [
  { value: '1', label: 'Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
];

const contributionOptions = [
  { value: '1', label: 'Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
];


/* calculation logic */

const calculateCompoundInterest = () => {

  const principal = calculatorData.principal;
  const annualRate = calculatorData.annualRate / 100;
  const years = calculatorData.years;
  const compoundingFrequency = parseInt(calculatorData.compoundingFrequency);
  const monthlyContribution = calculatorData.monthlyContribution || 0;
  const contributionFrequency = parseInt(calculatorData.contributionFrequency);

  const ratePerPeriod = annualRate / compoundingFrequency;
  const totalPeriods = years * compoundingFrequency;
  const principalFutureValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);

  let contributionsFutureValue = 0;
  const contributionPerPeriod = monthlyContribution * (contributionFrequency / 12); 

  if (monthlyContribution > 0) {
    const contributionRatePerPeriod = annualRate / contributionFrequency;
    const contributionPeriods = years * contributionFrequency;
    const annuityFactor = (Math.pow(1 + contributionRatePerPeriod, contributionPeriods) - 1) / contributionRatePerPeriod;
    contributionsFutureValue = contributionPerPeriod * annuityFactor;
  }

  const totalFutureValue = principalFutureValue + contributionsFutureValue;
  const totalContributions = principal + (monthlyContribution * 12 * years);
  const totalInterest = totalFutureValue - totalContributions;

  return {
    finalAmount: totalFutureValue,
    totalContributions,
    totalInterest,
    principalGrowth: principalFutureValue - principal,
    contributionsGrowth: contributionsFutureValue,
  };
};

const results = computed(() => calculateCompoundInterest());


/* form fields */

const formFields = [
  {
    key: 'principal', identifier: 'text', label: 'Initial Investment ($)',
    type: 'number',
    min: 0,
    placeholder: '10000',
  },
  {
    key: 'annualRate', identifier: 'text', label: 'Annual Interest Rate (%)',
    type: 'number',
    min: 0, max: 100,
    placeholder: '7',
  },
  {
    key: 'years', identifier: 'text', label: 'Time Period (Years)',
    type: 'number',
    min: 1, max: 100,
    placeholder: '10',
  },
  {
    key: 'compoundingFrequency', identifier: 'select', label: 'Compounding Frequency',
    items: compoundingOptions,
  },
  {
    key: 'monthlyContribution', identifier: 'text', label: 'Monthly Contribution ($)',
    type: 'number',
    min: 0,
    placeholder: '500',
  },
  {
    key: 'contributionFrequency', identifier: 'select', label: 'Contribution Frequency',
    items: contributionOptions,
  },
];


/* formatting */

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

</script>


<template>
  <window-base pito="event-viewer" title="Compound Interest Calculator">

    <h1 class="text-4xl font-bold px-3 my-3">
      Compound Interest Calculator
    </h1>

    <div class="px-3 my-3">
      <p class="text-lg mb-6">
        Calculate the future value of your investments with compound interest. Enter your details below to see how your money can grow over time.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-3 mb-8">

      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Investment Details</h2>

        <un-form
          :target="calculatorData"
          :fields="formFields"
        />

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Higher compounding frequency = faster growth</li>
            <li>• Regular contributions accelerate wealth building</li>
            <li>• Starting early gives time the biggest advantage</li>
          </ul>
        </div>
      </div>

      <div class="space-y-6">

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Final Amount</h3>
          <div class="text-3xl font-bold text-green-900 mb-2">
            {{ formatCurrency(results.finalAmount) }}
          </div>
          <p class="text-sm text-green-700">
            After {{ calculatorData.years }} years at {{ calculatorData.annualRate }}% interest
          </p>
        </div>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Investment Breakdown</h3>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Initial Investment:</span>
              <span class="font-semibold">{{ formatCurrency(calculatorData.principal) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Contributions:</span>
              <span class="font-semibold">{{ formatCurrency(results.totalContributions) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-600">Interest Earned:</span>
              <span class="font-semibold text-green-600">{{ formatCurrency(results.totalInterest) }}</span>
            </div>

            <hr class="my-3" />

            <div class="flex justify-between items-center">
              <span class="text-gray-600">Growth from Principal:</span>
              <span class="font-semibold text-blue-600">{{ formatCurrency(results.principalGrowth) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-600">Growth from Contributions:</span>
              <span class="font-semibold text-purple-600">{{ formatCurrency(results.contributionsGrowth) }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-1">Return Multiple</h4>
            <div class="text-2xl font-bold text-blue-900">
              {{ (results.finalAmount / results.totalContributions).toFixed(2) }}x
            </div>
            <p class="text-xs text-blue-700">Your money multiplier</p>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-1">Annual Growth</h4>
            <div class="text-2xl font-bold text-purple-900">
              {{ (((results.finalAmount / results.totalContributions) ** (1 / calculatorData.years) - 1) * 100).toFixed(1) }}%
            </div>
            <p class="text-xs text-purple-700">Average annual return</p>
          </div>
        </div>

      </div>
    </div>

    <div class="px-3 my-6">
      <hr class="mb-6" />

      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 class="font-semibold text-blue-800 mb-2">Understanding Compound Interest</h3>
        <p class="text-sm text-blue-700">
          Compound interest is the interest you earn on both your original money and the interest you've already earned.
          The formula is: <code class="bg-blue-100 px-1 rounded">A = P(1 + r/n)<sup>nt</sup></code>
          where A is the final amount, P is principal, r is annual rate, n is compounding frequency, and t is time in years.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-semibold text-green-800 mb-2">🚀 Start Early</h4>
          <p class="text-sm text-green-700">Time is your greatest ally. The sooner you start, the more compound interest works for you.</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">📈 Be Consistent</h4>
          <p class="text-sm text-blue-700">Regular contributions, even small ones, can lead to significant wealth over time through compounding.</p>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-semibold text-purple-800 mb-2">🎯 Frequency Matters</h4>
          <p class="text-sm text-purple-700">More frequent compounding (monthly vs annually) can significantly boost your returns.</p>
        </div>
      </div>
    </div>

  </window-base>
</template>
