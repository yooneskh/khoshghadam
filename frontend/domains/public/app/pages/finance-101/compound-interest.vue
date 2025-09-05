<script setup>

/* page */

definePageMeta({
  name: 'public.finance-101.compound-interest',
});

useSeoMeta({
  title: 'Compound Interest',
  description: 'Learn about compound interest and how it works.',
});

</script>


<template>
  <window-base pito="event-viewer" title="Compound Interest">
    
    <h1 class="text-4xl font-bold px-3 my-3">
      Compound Interest: The Magic of Growing Your Savings
    </h1>

    <p class="px-3 my-3">
      Compound interest is often called the "eighth wonder of the world" because of its powerful effect on growing your money over time. Unlike simple interest, which only earns interest on your original amount, compound interest lets your interest earn interest too!
    </p>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Simple Interest vs. Compound Interest
    </p>

    <ol class="list-disc px-8 my-3">
      <li>
        <strong>Simple Interest</strong> is calculated only on the original principal (the amount you start with). For example, if you put $1,000 in a bank at 5% simple interest for 3 years, you earn $50 per year, for a total of $150.
      </li>
      <li>
        <strong>Compound Interest</strong> is calculated on the principal <em>plus</em> any interest you've already earned. This means your money grows faster, because each year you earn interest on a bigger amount.
      </li>
    </ol>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      The Compound Interest Formula
    </p>

    <p class="px-3 my-3">
      The formula for compound interest is:
    </p>

    <pre class="bg-gray-100 rounded px-3 py-2 mx-3 my-3 text-sm overflow-x-auto">A = P(1 + r/n)<sup>nt</sup></pre>

    <ol class="list-disc px-8 my-3">
      <li>
        <strong>A</strong> = the final amount (principal + interest)
      </li>
      <li>
        <strong>P</strong> = the principal (your starting amount)
      </li>
      <li>
        <strong>r</strong> = annual interest rate (as a decimal, so 5% = 0.05)
      </li>
      <li>
        <strong>n</strong> = number of times interest is compounded per year
      </li>
      <li>
        <strong>t</strong> = number of years
      </li>
    </ol>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Example: Saving $1,000 at 5% for 10 Years
    </p>

    <p class="px-3 my-3">
      Let's say you put <strong>$1,000</strong> in a savings account that pays <strong>5% annual interest</strong>, compounded <strong>once per year</strong> (<code>n = 1</code>), for <strong>10 years</strong> (<code>t = 10</code>).
    </p>

    <ol class="list-decimal px-8 my-3">
      <li>
        <strong>Write the formula:</strong>
        <br />
        <code>A = 1000 × (1 + 0.05/1)<sup>1×10</sup></code>
      </li>
      <li>
        <strong>Simplify inside the parentheses:</strong>
        <br />
        <code>1 + 0.05 = 1.05</code>
      </li>
      <li>
        <strong>Raise to the 10th power:</strong>
        <br />
        <code>1.05<sup>10</sup> ≈ 1.6289</code>
      </li>
      <li>
        <strong>Multiply by the principal:</strong>
        <br />
        <code>1000 × 1.6289 = $1,628.89</code>
      </li>
    </ol>

    <p class="px-3 my-3">
      After 10 years, your $1,000 grows to <strong>$1,628.89</strong>! That's <strong>$628.89</strong> in interest, just by letting your money sit and compound.
    </p>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Real-Life Applications
    </p>

    <ol class="list-disc px-8 my-3">
      <li>
        <strong>Savings Accounts:</strong> Most banks pay compound interest on savings, helping your money grow over time.
      </li>
      <li>
        <strong>Investments:</strong> Stocks, bonds, and retirement accounts (like 401(k)s) all benefit from compounding returns.
      </li>
      <li>
        <strong>Loans & Credit Cards:</strong> Compounding can work against you too—unpaid interest on loans or credit cards can quickly add up!
      </li>
    </ol>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Manual Calculation Walkthrough
    </p>

    <p class="px-3 my-3">
      Suppose you have $500 at 4% interest, compounded quarterly (<code>n = 4</code>), for 5 years (<code>t = 5</code>).
    </p>

    <ol class="list-decimal px-8 my-3">
      <li>
        <strong>Convert rate to decimal:</strong> 4% = 0.04
      </li>
      <li>
        <strong>Plug into formula:</strong>
        <br />
        <code>A = 500 × (1 + 0.04/4)<sup>4×5</sup></code>
      </li>
      <li>
        <strong>Simplify:</strong>
        <br />
        <code>0.04/4 = 0.01</code>
        <br />
        <code>1 + 0.01 = 1.01</code>
        <br />
        <code>4 × 5 = 20</code>
      </li>
      <li>
        <strong>Calculate:</strong>
        <br />
        <code>1.01<sup>20</sup> ≈ 1.2202</code>
        <br />
        <code>500 × 1.2202 = $610.10</code>
      </li>
    </ol>

    <p class="px-3 my-3">
      After 5 years, your $500 becomes <strong>$610.10</strong>.
    </p>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Common Pitfalls
    </p>

    <ol class="list-disc px-8 my-3">
      <li>
        <strong>Ignoring Inflation:</strong> If inflation is 3% per year and your savings earn 2%, your money is actually losing value!
      </li>
      <li>
        <strong>Not Checking Compounding Frequency:</strong> More frequent compounding (monthly, daily) grows your money faster than annual compounding.
      </li>
      <li>
        <strong>Forgetting Taxes and Fees:</strong> Some accounts deduct taxes or fees, which can reduce your real returns.
      </li>
    </ol>

    <hr />

    <p class="px-3 my-3">
      <strong>In summary:</strong> Compound interest is a powerful tool for growing your savings and investments. The earlier you start, the more time your money has to grow!
    </p>

  </window-base>
</template>
