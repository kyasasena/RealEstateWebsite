// Nav scroll effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));
}

// Contact form handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent!';
    btn.style.background = '#4a7c5c';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 4000);
  });
}

// Newsletter signup handler
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribed!';
    btn.style.background = '#4a7c5c';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 4000);
  });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.diff-card, .spec-card, .step, .svc-item, .nl-card, .area-chip, .pillar, .gf-body').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(el);
});

// Mortgage Calculator
(function () {
  const homePrice          = document.getElementById('homePrice');
  if (!homePrice) return;

  const homePriceSlider    = document.getElementById('homePriceSlider');
  const downPayment        = document.getElementById('downPayment');
  const downPaymentSlider  = document.getElementById('downPaymentSlider');
  const downPctLabel       = document.getElementById('downPctLabel');
  const interestRate       = document.getElementById('interestRate');
  const interestRateSlider = document.getElementById('interestRateSlider');
  const propTax            = document.getElementById('propTax');
  const homeInsurance      = document.getElementById('homeInsurance');
  const hoaFees            = document.getElementById('hoaFees');

  let loanTermYears = 30;

  function num(el) { return parseFloat(el.value) || 0; }

  function fmt(n) {
    return '$' + Math.round(Math.max(0, n)).toLocaleString('en-US');
  }

  function fmtLoan(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000)    return '$' + Math.round(n / 1000) + 'k';
    return '$' + Math.round(n);
  }

  function calculate() {
    const price     = num(homePrice);
    const down      = num(downPayment);
    const rate      = num(interestRate);
    const tax       = num(propTax);
    const ins       = num(homeInsurance);
    const hoa       = num(hoaFees);
    const principal = Math.max(0, price - down);
    const mr        = rate / 100 / 12;
    const n         = loanTermYears * 12;

    const pi = mr > 0
      ? principal * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
      : (n > 0 ? principal / n : 0);

    const total = pi + tax + ins + hoa;

    document.getElementById('totalPayment').textContent =
      total > 0 ? fmt(total) : '—';
    document.getElementById('loanSummary').textContent =
      fmtLoan(principal) + ' loan · ' + loanTermYears + ' yr · ' + rate.toFixed(2) + '%';
    document.getElementById('amtPI').textContent  = fmt(pi);
    document.getElementById('amtTax').textContent = fmt(tax);
    document.getElementById('amtIns').textContent = fmt(ins);
    document.getElementById('amtHoa').textContent = fmt(hoa);

    ['PI', 'Tax', 'Ins', 'Hoa'].forEach(function (key, i) {
      const val = [pi, tax, ins, hoa][i];
      const pct = total > 0 ? (val / total) * 100 : 0;
      document.getElementById('bar' + key).style.width = Math.max(0, pct) + '%';
    });
  }

  // Home price — keep down payment % constant when price changes
  function getPct() { return parseFloat(downPaymentSlider.value); }

  homePrice.addEventListener('input', function () {
    homePriceSlider.value = Math.min(+this.value, +homePriceSlider.max);
    downPayment.value = Math.round(num(homePrice) * getPct() / 100);
    calculate();
  });
  homePriceSlider.addEventListener('input', function () {
    homePrice.value = this.value;
    downPayment.value = Math.round(+this.value * getPct() / 100);
    calculate();
  });

  // Down payment
  downPaymentSlider.addEventListener('input', function () {
    const pct = parseFloat(this.value);
    downPayment.value = Math.round(num(homePrice) * pct / 100);
    downPctLabel.textContent = ' (' + Math.round(pct) + '%)';
    calculate();
  });
  downPayment.addEventListener('input', function () {
    const price = num(homePrice);
    const pct = price > 0 ? Math.min(50, (num(downPayment) / price) * 100) : 0;
    downPaymentSlider.value = pct;
    downPctLabel.textContent = ' (' + Math.round(pct) + '%)';
    calculate();
  });

  // Interest rate
  interestRate.addEventListener('input', function () {
    interestRateSlider.value = this.value;
    calculate();
  });
  interestRateSlider.addEventListener('input', function () {
    interestRate.value = parseFloat(this.value).toFixed(2);
    calculate();
  });

  // Other inputs
  [propTax, homeInsurance, hoaFees].forEach(function (el) {
    el.addEventListener('input', calculate);
  });

  // Loan term toggle
  document.querySelectorAll('.toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      loanTermYears = parseInt(this.dataset.term);
      document.querySelectorAll('.toggle-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      calculate();
    });
  });

  calculate();
})();


/* =============================================
   WHAT'S MY HOME WORTH — form handler
   ============================================= */
(function () {
  var form = document.getElementById('whwForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    document.getElementById('whwSuccess').style.display = 'block';
  });
})();

/* =============================================
   RENT OR BUY CALCULATOR — sellers.html
   ============================================= */
(function () {
  var robRent = document.getElementById('robRent');
  if (!robRent) return;

  var robPrice        = document.getElementById('robPrice');
  var robDown         = document.getElementById('robDown');
  var robDownSlider   = document.getElementById('robDownSlider');
  var robDownAmt      = document.getElementById('robDownAmt');
  var robRate         = document.getElementById('robRate');
  var robRateSlider   = document.getElementById('robRateSlider');
  var robAppreciation = document.getElementById('robAppreciation');
  var robRentIncrease = document.getElementById('robRentIncrease');
  var robTax          = document.getElementById('robTax');
  var robIns          = document.getElementById('robIns');

  var robVerdict       = document.getElementById('robVerdict');
  var robVerdictDetail = document.getElementById('robVerdictDetail');
  var robMonthlyOwn    = document.getElementById('robMonthlyOwn');
  var robMonthlyRent   = document.getElementById('robMonthlyRent');
  var robTotalRent     = document.getElementById('robTotalRent');
  var robNetOwn        = document.getElementById('robNetOwn');
  var robEquity        = document.getElementById('robEquity');
  var robBreakEven     = document.getElementById('robBreakEven');

  var horizonYears = 10;

  function num(el) { return parseFloat(el.value) || 0; }
  function fmt(n) { return '$' + Math.round(n).toLocaleString(); }
  function fmtYrs(y) {
    if (y < 1) return 'Under 1 yr';
    if (y >= 30) return '> 30 yrs';
    return y.toFixed(1) + ' yrs';
  }

  function calculate() {
    var rent      = num(robRent);
    var price     = num(robPrice);
    var downPct   = Math.min(num(robDown), 100) / 100;
    var annualRate= num(robRate) / 100;
    var appRate   = num(robAppreciation) / 100;
    var rentGrow  = num(robRentIncrease) / 100;
    var tax       = num(robTax);
    var ins       = num(robIns);
    var n         = horizonYears;

    var principal = price * (1 - downPct);
    var downAmt   = price * downPct;
    var months    = 30 * 12;
    var mr        = annualRate / 12;

    var pi = mr > 0
      ? principal * (mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1)
      : (months > 0 ? principal / months : 0);

    var monthlyOwn = pi + tax + ins;

    robDownAmt.textContent = ' (' + fmt(downAmt) + ')';

    var totalRentPaid  = 0;
    var totalOwningCost = downAmt;
    var balance        = principal;
    var homeValue      = price;
    var currentRent    = rent;
    var breakEvenYear  = null;

    for (var yr = 1; yr <= n; yr++) {
      totalRentPaid += currentRent * 12;
      currentRent *= (1 + rentGrow);

      var maintenance = homeValue * 0.01;
      totalOwningCost += (monthlyOwn * 12) + maintenance;

      for (var mo = 0; mo < 12; mo++) {
        var interest = balance * mr;
        balance = Math.max(0, balance - (pi - interest));
      }

      homeValue *= (1 + appRate);

      var equity = homeValue - balance;
      var netOwn = totalOwningCost - equity;

      if (breakEvenYear === null && netOwn < totalRentPaid) {
        breakEvenYear = yr;
      }
    }

    var finalEquity = homeValue - balance;
    var finalNetOwn = totalOwningCost - finalEquity;
    var buying = finalNetOwn < totalRentPaid;

    robVerdict.textContent = buying ? 'Buying Wins' : 'Renting Wins';
    robVerdict.className = 'rob-verdict ' + (buying ? 'buying' : 'renting');

    var diff = Math.abs(totalRentPaid - finalNetOwn);
    robVerdictDetail.textContent = 'Over ' + n + ' yrs, you save ~' + fmt(diff) + ' by ' + (buying ? 'buying.' : 'renting.');

    robMonthlyOwn.textContent  = fmt(monthlyOwn) + '/mo';
    robMonthlyRent.textContent = fmt(rent) + '/mo';
    robTotalRent.textContent   = fmt(totalRentPaid);
    robNetOwn.textContent      = fmt(Math.max(0, finalNetOwn));
    robEquity.textContent      = fmt(finalEquity);
    robBreakEven.textContent   = breakEvenYear ? fmtYrs(breakEvenYear) : '> ' + n + ' yrs';
  }

  robDown.addEventListener('input', function () {
    robDownSlider.value = Math.min(50, num(robDown));
    calculate();
  });
  robDownSlider.addEventListener('input', function () {
    robDown.value = parseFloat(this.value).toFixed(1);
    calculate();
  });
  robRate.addEventListener('input', function () {
    robRateSlider.value = this.value;
    calculate();
  });
  robRateSlider.addEventListener('input', function () {
    robRate.value = parseFloat(this.value).toFixed(2);
    calculate();
  });
  [robRent, robPrice, robAppreciation, robRentIncrease, robTax, robIns].forEach(function (el) {
    el.addEventListener('input', calculate);
  });

  document.querySelectorAll('#robHorizonToggle .toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      horizonYears = parseInt(this.dataset.years);
      document.querySelectorAll('#robHorizonToggle .toggle-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      calculate();
    });
  });

  calculate();
})();
