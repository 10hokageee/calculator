let calcButton = document.getElementById("btn-result");

calcButton.onclick = function (event) {
  event.preventDefault();
  calculateLoan();
};

let classicBtn = document.getElementById("classic__table-btn");
let annuityBtn = document.getElementById("annuity__table-btn");
let annuityContainer = document.getElementById("annuity-table-container");
let classicContainer = document.getElementById("classic-table-container");

classicBtn.onclick = function () {
  classicContainer.style.display = "block";
  annuityContainer.style.display = "none";
};

annuityBtn.onclick = function () {
  annuityContainer.style.display = "block";
  classicContainer.style.display = "none";
};

let clearButton = document.getElementById("btn-clear");
clearButton.onclick = clearFields;

function calculateLoan() {
  let amount = parseFloat(document.getElementById("amount").value);
  let interest = parseFloat(document.getElementById("interest").value) || 0;
  let result = document.getElementById("result");
  let downpaymentPercent = parseFloat(
    document.getElementById("downpayment-percent").value
  );

  console.log(interest)

  let list = parseFloat(document.getElementById("list").value);
  let classicMonthly = document.getElementById("classicMonthlyPayment");
  let classicInterest = document.getElementById("classicInterestExpense");
  let classicOverpay = document.getElementById("classicOverpayment");
  let classicEffective = document.getElementById("classicEffectiveRate");
  let annuityMonthly = document.getElementById("annuityMonthlyPayment");
  let annuityInterest = document.getElementById("annuityInterestExpense");
  let annuityOverpay = document.getElementById("annuityOverpayment");
  let annuityEffective = document.getElementById("annuityEffectiveRate");
  let infoBlock = document.querySelector(".form__result");

  let notaryFee = parseFloat(document.getElementById("notary").value) || 0;
  let insuranceFee =
    parseFloat(document.getElementById("insurance").value) || 0;
  let commissionFee =
    parseFloat(document.getElementById("commission").value) || 0;
  let totalOneTimeFees = notaryFee + insuranceFee + commissionFee;

  let interestValue = interest;
  let amountValue = amount;
  let downpaymentPercentValue = downpaymentPercent;
  let listValue = list;

  let principal = amountValue;
  let downpayment = (downpaymentPercentValue / 100) * principal;
  principal -= downpayment;
  let nominalRate = interestValue / 100;
  let monthlyRate = nominalRate / 12;
  let calculatePayments = listValue;
  let classicMonthlyPayment =
    principal / calculatePayments + principal * monthlyRate;
  let annuityMonthlyPayment =
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -calculatePayments));

  let annuityEffectiveRate = Math.pow(1 + monthlyRate, 12) - 1.00046;
  let classicEffectiveRate = Math.pow(1 + monthlyRate, 12) - 1;

  if (
    !isNaN(classicMonthlyPayment) &&
    classicMonthlyPayment !== Infinity &&
    classicMonthlyPayment > 0 &&
    !isNaN(annuityMonthlyPayment) &&
    annuityMonthlyPayment !== Infinity &&
    annuityMonthlyPayment > 0
  ) {
    infoBlock.style.display = "none";
    let classicInterestExpense = 0;
    let remainingBalance = principal;

    for (let i = 0; i < calculatePayments; i++) {
      let interestPayment = remainingBalance * monthlyRate;
      classicInterestExpense += interestPayment;
      let principalPayment = principal / calculatePayments;
      remainingBalance -= principalPayment;
    }

    let classicOverPayment = classicInterestExpense + totalOneTimeFees;
    let classicTotalCost =
      principal + classicInterestExpense + totalOneTimeFees;

    let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
    let annuityInterestExpense = annuityTotalPayment - principal;

    let annuityOverPayment = annuityInterestExpense + totalOneTimeFees;
    let annuityTotalCost = annuityTotalPayment + totalOneTimeFees;

    result.innerHTML = `
      Ежемесячный платёж (классическая схема): ${classicMonthlyPayment.toFixed(
        2
      )} грн.
      <br> Общие процентные расходы по кредиту (классическая схема): ${classicInterestExpense.toFixed(
        2
      )} грн.
      <br> Загальні витрати за кредитом (классическая схема): ${classicOverPayment.toFixed(
        2
      )} грн.
      <br> Эффективная процентная ставка (классическая схема): ${(
        classicEffectiveRate * 100
      ).toFixed(6)}%
      <br><br>
      Ежемесячный платёж (аннуитетная схема): ${annuityMonthlyPayment.toFixed(
        2
      )} грн.
      <br> Общие процентные расходы по кредиту (аннуитетная схема): ${annuityInterestExpense.toFixed(
        2
      )} грн.
      <br> Переплата по кредиту (аннуитетная схема): ${annuityOverPayment.toFixed(
        2
      )} грн.
      <br> Эффективная процентная ставка (аннуитетная схема): ${(
        annuityEffectiveRate * 100
      ).toFixed(6)}%
    `;

    classicOverpay.innerHTML = classicOverPayment.toFixed(2);
    document.getElementById("classicTotalCost").innerHTML =
      classicTotalCost.toFixed(2);
    annuityOverpay.innerHTML = annuityOverPayment.toFixed(2);
    document.getElementById("annuityTotalCost").innerHTML =
      annuityTotalCost.toFixed(2);

    let remainingBalanceClassic = principal;
    let classicTableBody = document
      .getElementById("classic-loan-table")
      .getElementsByTagName("tbody")[0];
    classicTableBody.innerHTML = "";
    let classicTotalPrincipal = 0;
    let classicTotalInterest = 0;

    for (let i = 0; i < calculatePayments; i++) {
      let currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + i);
      let monthName = currentDate.toLocaleString("uk-UA", { month: "long" });
      let interestPayment = remainingBalanceClassic * monthlyRate;
      let principalPayment = principal / calculatePayments;
      let monthlyPayment = principalPayment + interestPayment;
      remainingBalanceClassic -= principalPayment;

      classicTotalPrincipal += principalPayment;
      classicTotalInterest += interestPayment;

      let row = `
        <tr class="loan-table__name-list">
          <td class="loan-table__item">${i + 1} (${monthName})</td>
          <td class="loan-table__item">${monthlyPayment.toFixed(2)}</td>
          <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
          <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
          <td class="loan-table__item">${Math.max(
            remainingBalanceClassic,
            0
          ).toFixed(2)}</td>
        </tr>
      `;
      classicTableBody.innerHTML += row;
    }

    let classicTotalRow = `
      <tr class="loan-table__totals">
        <td class="loan-table__item"><strong>СУМА:</strong></td>
        <td class="loan-table__item"></td>
        <td class="loan-table__item"><strong>${classicTotalPrincipal.toFixed(
          2
        )}</strong></td>
        <td class="loan-table__item"><strong>${classicTotalInterest.toFixed(
          2
        )}</strong></td>
        <td class="loan-table__item"></td>
      </tr>
    `;
    classicTableBody.innerHTML += classicTotalRow;

    let annuityRemainingBalance = principal;
    let annuityTableBody = document
      .getElementById("annuity-loan-table")
      .getElementsByTagName("tbody")[0];
    annuityTableBody.innerHTML = "";
    let annuityTotalPrincipal = 0;
    let annuityTotalInterest = 0;

    for (let i = 0; i < calculatePayments; i++) {
      let currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + i);
      let monthName = currentDate.toLocaleString("uk-UA", { month: "long" });
      let interestPayment = annuityRemainingBalance * monthlyRate;
      let principalPayment = annuityMonthlyPayment - interestPayment;
      annuityRemainingBalance -= principalPayment;

      annuityTotalPrincipal += principalPayment;
      annuityTotalInterest += interestPayment;

      let row = `
        <tr class="loan-table__name-list">
          <td class="loan-table__item">${i + 1} (${monthName})</td>
          <td class="loan-table__item">${annuityMonthlyPayment.toFixed(2)}</td>
          <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
          <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
          <td class="loan-table__item">${Math.max(
            annuityRemainingBalance,
            0
          ).toFixed(2)}</td>
        </tr>
      `;
      annuityTableBody.innerHTML += row;
    }

    let annuityTotalRow = `
      <tr class="loan-table__totals">
        <td class="loan-table__item"><strong>СУМА:</strong></td>
        <td class="loan-table__item"></td>
        <td class="loan-table__item"><strong>${annuityTotalPrincipal.toFixed(
          2
        )}</strong></td>
        <td class="loan-table__item"><strong>${annuityTotalInterest.toFixed(
          2
        )}</strong></td>
        <td class="loan-table__item"></td>
      </tr>
    `;
    annuityTableBody.innerHTML += annuityTotalRow;

    classicMonthly.innerHTML = `${(
      principal / calculatePayments +
      principal * monthlyRate
    ).toFixed(2)} - ${(
      principal / calculatePayments +
      (principal - ((calculatePayments - 1) * principal) / calculatePayments) *
        monthlyRate
    ).toFixed(2)}`;
    classicInterest.innerHTML = classicInterestExpense.toFixed(2);
    annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);
    annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);
    classicEffective.innerHTML = (classicEffectiveRate * 100).toFixed(6);
    annuityEffective.innerHTML = (annuityEffectiveRate * 100).toFixed(6);
  } else {
    infoBlock.style.display = "block";
    infoBlock.innerHTML = "Дані вказані неправильно або відсутні";
  }
}

function clearFields() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });

  let selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    select.value = "";
  });

  let result = document.getElementById("result");
  result.innerHTML = "";

  let classicMonthly = document.getElementById("classicMonthlyPayment");
  let classicInterest = document.getElementById("classicInterestExpense");
  let classicOverpay = document.getElementById("classicOverpayment");
  let classicEffective = document.getElementById("classicEffectiveRate");
  let classicTotalCost = document.getElementById("classicTotalCost");

  let annuityMonthly = document.getElementById("annuityMonthlyPayment");
  let annuityInterest = document.getElementById("annuityInterestExpense");
  let annuityOverpay = document.getElementById("annuityOverpayment");
  let annuityEffective = document.getElementById("annuityEffectiveRate");
  let annuityTotalCost = document.getElementById("annuityTotalCost");

  let infoBlock = document.querySelector(".form__result");
  classicMonthly.innerHTML = "";
  classicInterest.innerHTML = "";
  classicOverpay.innerHTML = "";
  classicEffective.innerHTML = "";
  classicTotalCost.innerHTML = "";

  annuityMonthly.innerHTML = "";
  annuityInterest.innerHTML = "";
  annuityOverpay.innerHTML = "";
  annuityEffective.innerHTML = "";
  annuityTotalCost.innerHTML = "";

  infoBlock.style.display = "none";
  infoBlock.innerHTML = "";

  clearTableRows("classic-loan-table");
  clearTableRows("annuity-loan-table");
}

function clearTableRows(tableId) {
  let tableBody = document
    .getElementById(tableId)
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
}

// //gotovi

// let calcButton = document.getElementById("btn-result");

// calcButton.onclick = function (event) {
//   event.preventDefault();
//   calculateLoan();
// };

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById("amount").value);
//   let interest = parseFloat(document.getElementById("interest").value);
//   let result = document.getElementById("result");
//   let downpaymentPercent = parseFloat(
//     document.getElementById("downpayment-percent").value
//   );
//   let list = parseFloat(document.getElementById("list").value);
//   let classicMonthly = document.getElementById("classicMonthlyPayment");
//   let classicInterest = document.getElementById("classicInterestExpense");
//   let classicOverpay = document.getElementById("classicOverpayment");
//   let classicEffective = document.getElementById("classicEffectiveRate");
//   let annuityMonthly = document.getElementById("annuityMonthlyPayment");
//   let annuityInterest = document.getElementById("annuityInterestExpense");
//   let annuityOverpay = document.getElementById("annuityOverpayment");
//   let annuityEffective = document.getElementById("annuityEffectiveRate");
//   let infoBlock = document.querySelector(".form__result");

//   let interestValue = interest;
//   let amountValue = amount;
//   let downpaymentPercentValue = downpaymentPercent;
//   let listValue = list;

//   let principal = amountValue;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let classicMonthlyPayment =
//     principal / calculatePayments + principal * monthlyRate;
//   let annuityMonthlyPayment =
//     (principal * monthlyRate) /
//     (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//   let annuityEffectiveRate = Math.pow(1 + monthlyRate, 12) - 1.00046;
//   let classicEffectiveRate = Math.pow(1 + monthlyRate, 12) - 1;

//   if (
//     !isNaN(classicMonthlyPayment) &&
//     classicMonthlyPayment !== Infinity &&
//     classicMonthlyPayment > 0 &&
//     !isNaN(annuityMonthlyPayment) &&
//     annuityMonthlyPayment !== Infinity &&
//     annuityMonthlyPayment > 0
//   ) {
//     infoBlock.style.display = "none";
//     let classicInterestExpense = 0;
//     let remainingBalance = principal;

//     for (let i = 0; i < calculatePayments; i++) {
//       let interestPayment = remainingBalance * monthlyRate;
//       classicInterestExpense += interestPayment;
//       let principalPayment = principal / calculatePayments;
//       remainingBalance -= principalPayment;
//     }

//     let classicOverPayment = classicInterestExpense;

//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverPayment = annuityInterestExpense;

//     let classicTotalCost = principal + classicInterestExpense;
//     let annuityTotalCost = annuityTotalPayment;

//     result.innerHTML = `Ежемесячный платёж (классическая схема): ${classicMonthlyPayment.toFixed(
//       2
//     )} грн. <br> Общие процентные расходы по кредиту (классическая схема): ${classicInterestExpense.toFixed(
//       2
//     )} грн. <br> Переплата по кредиту (классическая схема): ${classicOverPayment.toFixed(
//       2
//     )} грн.<br> Эффективная процентная ставка (классическая схема): ${(
//       classicEffectiveRate * 100
//     ).toFixed(
//       6
//     )}% <br> <br> Ежемесячный платёж (аннуитетная схема): ${annuityMonthlyPayment.toFixed(
//       2
//     )} грн. <br> Общие процентные расходы по кредиту (аннуитетная схема): ${annuityInterestExpense.toFixed(
//       2
//     )} грн. <br> Переплата по кредиту (аннуитетная схема): ${annuityOverPayment.toFixed(
//       2
//     )} грн.<br> Эффективная процентная ставка (аннуитетная схема): ${(
//       annuityEffectiveRate * 100
//     ).toFixed(6)}%`;

//     let remainingBalanceClassic = principal;
//     let classicTableBody = document
//       .getElementById("classic-loan-table")
//       .getElementsByTagName("tbody")[0];
//     classicTableBody.innerHTML = "";
//     let firstPayment = null;
//     let lastPayment = null;

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString("default", { month: "long" });
//       let interestPayment = remainingBalanceClassic * monthlyRate;
//       let principalPayment = principal / calculatePayments;
//       remainingBalanceClassic -= principal / calculatePayments;

//       if (i === 1) {
//         firstPayment = principalPayment + interestPayment;
//       } else if (i === calculatePayments) {
//         lastPayment = principalPayment + interestPayment;
//       }

//       let row = `
//         <tr class="loan-table__name-list">
//           <td class="loan-table__item">${i} (${monthName})</td>
//           <td class="loan-table__item">${(
//             principalPayment + interestPayment
//           ).toFixed(2)}</td>
//           <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${remainingBalanceClassic.toFixed(
//             2
//           )}</td>
//         </tr>
//       `;
//       classicTableBody.innerHTML += row;
//     }

//     let annuityRemainingBalance = principal;
//     let annuityTableBody = document
//       .getElementById("annuity-loan-table")
//       .getElementsByTagName("tbody")[0];
//     annuityTableBody.innerHTML = "";

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString("default", { month: "long" });
//       let interestPayment = annuityRemainingBalance * monthlyRate;
//       let principalPayment = annuityMonthlyPayment - interestPayment;
//       annuityRemainingBalance -= principalPayment;
//       let row = `
//         <tr class="loan-table__name-list">
//           <td class="loan-table__item">${i} (${monthName})</td>
//           <td class="loan-table__item">${annuityMonthlyPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${annuityRemainingBalance.toFixed(
//             2
//           )}</td>
//         </tr>
//       `;
//       annuityTableBody.innerHTML += row;
//     }

//     classicMonthly.innerHTML = `${firstPayment.toFixed(
//       2
//     )} - ${lastPayment.toFixed(2)}`;
//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);
//     classicOverpay.innerHTML = classicOverPayment.toFixed(2);
//     document.getElementById("classicTotalCost").innerHTML =
//       classicTotalCost.toFixed(2);
//     classicEffective.innerHTML = (classicEffectiveRate * 100).toFixed(6);
//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);
//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);
//     annuityOverpay.innerHTML = annuityOverPayment.toFixed(2);
//     document.getElementById("annuityTotalCost").innerHTML =
//       annuityTotalCost.toFixed(2);
//     annuityEffective.innerHTML = (annuityEffectiveRate * 100).toFixed(6);
//   } else {
//     result.innerHTML = "Дані вказані неправильно або відсутні";
//     infoBlock.style.display = "block";
//     infoBlock.innerHTML = "Дані вказані неправильно або відсутні";
//   }
// }

// let classicBtn = document.getElementById("classic__table-btn");

// let annuityBtn = document.getElementById("annuity__table-btn");

// let annuityContainer = document.getElementById("annuity-table-container");

// let classicContainer = document.getElementById("classic-table-container");

// classicBtn.onclick = function () {
//   classicContainer.style.display = "block";
//   annuityContainer.style.display = "none";
// };

// annuityBtn.onclick = function () {
//   annuityContainer.style.display = "block";
//   classicContainer.style.display = "none";
// };

// let clearButton = document.getElementById("btn-clear");
// clearButton.onclick = clearFields;

// function clearFields() {
//   let inputs = document.querySelectorAll("input");
//   inputs.forEach((input) => {
//     input.value = "";
//   });

//   let selects = document.querySelectorAll("select");
//   selects.forEach((select) => {
//     select.value = "";
//   });

//   let result = document.getElementById("result");
//   result.innerHTML = "";

//   let classicMonthly = document.getElementById("classicMonthlyPayment");
//   let classicInterest = document.getElementById("classicInterestExpense");
//   let classicOverpay = document.getElementById("classicOverpayment");
//   let classicEffective = document.getElementById("classicEffectiveRate");
//   let classicTotalCost = document.getElementById("classicTotalCost");

//   let annuityMonthly = document.getElementById("annuityMonthlyPayment");
//   let annuityInterest = document.getElementById("annuityInterestExpense");
//   let annuityOverpay = document.getElementById("annuityOverpayment");
//   let annuityEffective = document.getElementById("annuityEffectiveRate");
//   let annuityTotalCost = document.getElementById("annuityTotalCost");

//   let infoBlock = document.querySelector(".form__result");
//   classicMonthly.innerHTML = "";
//   classicInterest.innerHTML = "";
//   classicOverpay.innerHTML = "";
//   classicEffective.innerHTML = "";
//   classicTotalCost.innerHTML = "";

//   annuityMonthly.innerHTML = "";
//   annuityInterest.innerHTML = "";
//   annuityOverpay.innerHTML = "";
//   annuityEffective.innerHTML = "";
//   annuityTotalCost.innerHTML = "";

//   infoBlock.style.display = "none";
//   infoBlock.innerHTML = "";

//   clearTableRows("classic-loan-table");
//   clearTableRows("annuity-loan-table");
// }

// function clearTableRows(tableId) {
//   let tableBody = document
//     .getElementById(tableId)
//     .getElementsByTagName("tbody")[0];
//   tableBody.innerHTML = "";
// }

// function clearTableRows(tableId) {
//   let tableBody = document
//     .getElementById(tableId)
//     .getElementsByTagName("tbody")[0];
//   tableBody.innerHTML = "";
// }

//readyyyyyy
// let calcButton = document.getElementById('btn-result');

// calcButton.onclick = function() {
//   calculateLoan();
// }

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById('amount').value);
//   let interest = parseFloat(document.getElementById('interest').value);
//   let result = document.getElementById('result');
//   let loanTable = document.getElementById('loan-table')
//   let downpaymentPercent = parseFloat(document.getElementById('downpayment-percent').value);
//   let list = parseFloat(document.getElementById('list').value);
//   let classicMonthly = document.getElementById('classicMonthlyPayment');
//   let classicInterest = document.getElementById('classicInterestExpense');
//   let classicOverpay = document.getElementById('classicOverpayment');
//   let classicEffective = document.getElementById('classicEffectiveRate');
//   let annuityMonthly = document.getElementById('annuityMonthlyPayment');
//   let annuityInterest = document.getElementById('annuityInterestExpense');
//   let annuityOverpay = document.getElementById('annuityOverpayment');
//   let annuityEffective = document.getElementById('annuityEffectiveRate');
//   let infoBlock = document.querySelector('.form__result');
//   let onceCommissionPercent = parseFloat(document.getElementById('once-commission-percent').value) || 0;
//   let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value) || 0;
//   let annualInsuranceAmount = parseFloat(document.getElementById('annual-insurance-amount').value) || 0;
//   let monthlyCommissionPercent = parseFloat(document.getElementById('monthly-commission-percent').value) || 0;
//   let monthlyCommissionAmount = parseFloat(document.getElementById('monthly-commission-amount').value) || 0;
//   let monthlyInsurancePercent = parseFloat(document.getElementById('monthly-insurance-percent').value) || 0;
//   let monthlyInsuranceAmount = parseFloat(document.getElementById('monthly-insurance-amount').value) || 0;

//   let interestValue = interest;
//   let amountValue = amount;
//   let downpaymentPercentValue = downpaymentPercent;
//   let listValue = list;
//   let onceCommissionAbsolute = amount * onceCommissionPercent / 100;
//   let monthlyCommissionAbsolute = amount * monthlyCommissionPercent / 100;
//   let monthlyInsuranceAbsolute = amount * monthlyInsurancePercent / 100;;

//   let principal = amountValue + onceCommissionAbsolute + onceCommissionAmount + monthlyCommissionAmount + monthlyCommissionAbsolute + monthlyInsuranceAmount + monthlyInsuranceAbsolute;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let classicMonthlyPayment = principal / calculatePayments + principal * monthlyRate;
//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, - calculatePayments));
//   // Расчет эффективной ставки через метод "ЧИСТВНДОХ"
//   let classicEffectiveRate = Math.pow(1 + monthlyRate, 12) - 1;
//   let annuityEffectiveRate = Math.pow(1 + monthlyRate, calculatePayments) - 1;

//   if (!isNaN(classicMonthlyPayment) && classicMonthlyPayment !== Infinity && classicMonthlyPayment > 0 &&
//       !isNaN(annuityMonthlyPayment) && annuityMonthlyPayment !== Infinity && annuityMonthlyPayment > 0) {
//     infoBlock.style.display = 'none';
//     let classicInterestExpense = 0;
//     let remainingBalance = principal;

//     for (let i = 0; i < calculatePayments; i++) {
//       let interestPayment = remainingBalance * monthlyRate;
//       classicInterestExpense += interestPayment;
//       remainingBalance -= principal / calculatePayments;
//     }

//     let classicOverPayment = classicInterestExpense;

//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverPayment = annuityInterestExpense;

//     result.innerHTML = `Ежемесячный платёж (классическая схема): ${classicMonthlyPayment.toFixed(2)} грн. <br> Общие процентные расходы по кредиту (классическая схема): ${classicInterestExpense.toFixed(2)} грн. <br> Переплата по кредиту (классическая схема): ${classicOverPayment.toFixed(2)} грн.<br> Эффективная процентная ставка (классическая схема): ${(classicEffectiveRate * 100).toFixed(6)}% <br> <br> Ежемесячный платёж (аннуитетная схема): ${annuityMonthlyPayment.toFixed(2)} грн. <br> Общие процентные расходы по кредиту (аннуитетная схема): ${annuityInterestExpense.toFixed(2)} грн. <br> Переплата по кредиту (аннуитетная схема): ${annuityOverPayment.toFixed(2)} грн.<br> Эффективная процентная ставка (аннуитетная схема): ${(annuityEffectiveRate * 100).toFixed(6)}%`;

//     let remainingBalanceClassic = principal;
//     let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//     classicTableBody.innerHTML = '';
//     let firstPayment = null;
//     let lastPayment = null;

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString('default', { month: 'long' });
//       let interestPayment = remainingBalanceClassic * monthlyRate;
//       let principalPayment = principal / calculatePayments;
//       let commissionPayment = monthlyCommissionAmount / calculatePayments;
//       remainingBalanceClassic -= principal / calculatePayments;

//       if (i === 1) {
//         firstPayment = principalPayment + interestPayment + annualInsuranceAmount + commissionPayment;
//       } else if (i === calculatePayments) {
//         lastPayment = principalPayment + interestPayment + annualInsuranceAmount + commissionPayment;
//       }

//       let row = `
//         <tr class="loan-table__name-list">
//           <td class="loan-table__item">${i} (${monthName})</td>
//           <td class="loan-table__item">${(principalPayment + interestPayment).toFixed(2)}</td>
//           <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${annualInsuranceAmount.toFixed(2)}</td>
//           <td class="loan-table__item">${commissionPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${remainingBalanceClassic.toFixed(2)}</td>
//         </tr>
//       `;
//       classicTableBody.innerHTML += row;
//     }

//     let annuityRemainingBalance = principal;
//     let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//     annuityTableBody.innerHTML = '';

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString('default', { month: 'long' });
//       let interestPayment = annuityRemainingBalance * monthlyRate;
//       let principalPayment = annuityMonthlyPayment - interestPayment;
//       let commissionPayment = monthlyCommissionAmount / calculatePayments;
//       annuityRemainingBalance -= principalPayment;
//       let row = `
//         <tr class="loan-table__name-list">
//           <td class="loan-table__item">${i} (${monthName})</td>
//           <td class="loan-table__item">${annuityMonthlyPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${principalPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${interestPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${annualInsuranceAmount.toFixed(2)}</td>
//           <td class="loan-table__item">${commissionPayment.toFixed(2)}</td>
//           <td class="loan-table__item">${annuityRemainingBalance.toFixed(2)}</td>
//         </tr>
//       `;
//       annuityTableBody.innerHTML += row;
//     }

//     classicMonthly.innerHTML = `${firstPayment.toFixed(2)} - ${lastPayment.toFixed(2)}`;
//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);
//     classicOverpay.innerHTML = classicOverPayment.toFixed(2);
//     classicEffective.innerHTML = (classicEffectiveRate * 100).toFixed(6);
//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);
//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);
//     annuityOverpay.innerHTML = annuityOverPayment.toFixed(2);
//     annuityEffective.innerHTML = (annuityEffectiveRate * 100).toFixed(6);

//   } else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//     infoBlock.style.display = 'block';
//     infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn')

// let annuityBtn = document.getElementById('annuity__table-btn')

// let annuityContainer = document.getElementById('annuity-table-container')

// let classicContainer = document.getElementById('classic-table-container')

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block'
//   annuityContainer.style.display = 'none'
// }

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block'
//   classicContainer.style.display = 'none'
// }

// const translations = {
//        en: {
//          "form_title": "Loan Calculator",
//          "amount_label": "Loan Amount (UAH):",
//          "interest_label": "Annual Interest Rate (%):",
//          "downpayment_label": "Down Payment %:",
//          "term_label": "Loan Term:",
//          "calculate_button": "Calculate",
//          "classic_tab": "Classic",
//          "annuity_tab": "Annuity",
//          "period": "Period (Month)",
//          "monthly_payment": "Monthly Payment",
//          "principal_repayment": "Principal Repayment",
//          "interest_repayment": "Interest Repayment",
//          "commission_repayment": "Commission Repayment",
//          "remaining_balance": "Remaining Balance",
//          "calculation_type": "Calculation Type",
//          "interest_expense": "Interest Expenses",
//          "overpayment": "Overpayment",
//          "effective_rate": "Effective Rate",
//          "once_commission_percent_label": "Once Commission (%):",
//          "once_commission_amount_label": "Once Commission (amount):",
//          "annual_insurance_amount_label": "Annual Insurance (amount):",
//          "monthly_commission_percent_label": "Monthly Commission (% of loan):",
//          "monthly_commission_amount_label": "Monthly Commission (amount):",
//          "monthly_insurance_percent_label": "Monthly Insurance (% of balance):",
//          "monthly_insurance_amount_label": "Monthly Insurance (amount):"
//        },
//        uk: {
//          "form_title": "Калькулятор кредитів",
//          "amount_label": "Сума кредиту (грн):",
//          "interest_label": "Річна процентна ставка (%):",
//          "downpayment_label": "Перший внесок %:",
//          "term_label": "Термін кредиту:",
//          "calculate_button": "Розрахувати",
//          "classic_tab": "Класика",
//          "annuity_tab": "Ануїтет",
//          "period": "Період (Місяць)",
//          "monthly_payment": "Щомісячний платіж",
//          "principal_repayment": "Погашення тіла кредиту",
//          "interest_repayment": "Погашення процентів",
//          "commission_repayment": "Погашення комісій",
//          "remaining_balance": "Залишок боргу",
//          "calculation_type": "Тип розрахунку",
//          "interest_expense": "Витрати на відсотки",
//          "overpayment": "Переплата",
//          "effective_rate": "Ефективна ставка",
//          "once_commission_percent_label": "Разова комісія (%):",
//          "once_commission_amount_label": "Разова комісія (сума):",
//          "annual_insurance_amount_label": "Щорічне страхування (сума):",
//          "monthly_commission_percent_label": "Щомісячна комісія (% від кредиту):",
//          "monthly_commission_amount_label": "Щомісячна комісія (сума):",
//          "monthly_insurance_percent_label": "Щомісячне страхування (% від залишку):",
//          "monthly_insurance_amount_label": "Щомісячне страхування (сума):"
//        },

//        ru: {
//          "form_title": "Кредитный калькулятор",
//          "amount_label": "Сумма кредита (грн):",
//          "interest_label": "Годовая процентная ставка (%):",
//          "downpayment_label": "Сумма аванса %:",
//          "term_label": "Срок кредита:",
//          "calculate_button": "Рассчитать",
//          "classic_tab": "Классика",
//          "annuity_tab": "Аннуитет",
//          "period": "Период (месяц)",
//          "monthly_payment": "Ежемесячный платеж",
//          "principal_repayment": "Погашение тела кредита",
//          "interest_repayment": "Погашение процентов",
//          "commission_repayment": "Погашение комиссий",
//          "remaining_balance": "Остаток задолженности",
//          "calculation_type": "Тип расчёта",
//          "interest_expense": "Процентные расходы по кредиту",
//          "overpayment": "Переплата",
//          "effective_rate": "Эффективная ставка",
//          "once_commission_percent_label": "Разовая комиссия (%):",
//          "once_commission_amount_label": "Разовая комиссия (сумма):",
//          "annual_insurance_amount_label": "Ежегодная страховка (сумма):",
//          "monthly_commission_percent_label": "Ежемесячная комиссия (% от кредита):",
//          "monthly_commission_amount_label": "Ежемесячная комиссия (сумма):",
//          "monthly_insurance_percent_label": "Ежемесячная страховка (% от остатка):",
//          "monthly_insurance_amount_label": "Ежемесячная страховка (сумма):"
//        }
//      };

//      function changeLanguage() {
//       const lang = document.getElementById('languageSelect').value;
//       document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//       document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//       document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//       document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//       document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//       document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//       document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//       document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//       document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//       document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//       document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//       document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//       document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//       document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic_tab'];
//       document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity_tab'];
//       const updateTableHeaders = (tableId, headers) => {
//         const table = document.getElementById(tableId);
//         headers.forEach((header, index) => {
//           table.querySelectorAll('th')[index].textContent = translations[lang][header];
//         });
//       };
//       updateTableHeaders('classic-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//       updateTableHeaders('annuity-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//       document.querySelector('label[for="once-commission-percent"]').textContent = translations[lang]['once_commission_percent_label'];
//       document.querySelector('label[for="once-commission-amount"]').textContent = translations[lang]['once_commission_amount_label'];
//       document.querySelector('label[for="annual-insurance-amount"]').textContent = translations[lang]['annual_insurance_amount_label'];
//       document.querySelector('label[for="monthly-commission-percent"]').textContent = translations[lang]['monthly_commission_percent_label'];
//       document.querySelector('label[for="monthly-commission-amount"]').textContent = translations[lang]['monthly_commission_amount_label'];
//       document.querySelector('label[for="monthly-insurance-percent"]').textContent = translations[lang]['monthly_insurance_percent_label'];
//       document.querySelector('label[for="monthly-insurance-amount"]').textContent = translations[lang]['monthly_insurance_amount_label'];
//     }

// let clearButton = document.getElementById('btn-clear');
// clearButton.onclick = clearFields;

// function clearFields() {
//   let inputs = document.querySelectorAll('input');
//   inputs.forEach(input => {
//     input.value = '';
//   });

//   let selects = document.querySelectorAll('select');
//   selects.forEach(select => {
//     select.value = '';
//   });

//   let result = document.getElementById('result');
//   result.innerHTML = '';

//   clearTableRows('loan-table');
//   clearTableRows('classic-loan-table');
//   clearTableRows('annuity-loan-table');
// }

// function clearTableRows(tableId) {
//   let tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
//   tableBody.innerHTML = '';
// }

//лучший варик из всех
// let calcButton = document.getElementById('btn-result');

// calcButton.onclick = function() {
//   calculateLoan();
// }

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById('amount').value);
//   let interest = parseFloat(document.getElementById('interest').value);
//   let result = document.getElementById('result');
//   let downpaymentPercent = parseFloat(document.getElementById('downpayment-percent').value);
//   let list = parseFloat(document.getElementById('list').value);
//   let classicMonthly = document.getElementById('classicMonthlyPayment');
//   let classicInterest = document.getElementById('classicInterestExpense');
//   let classicOverpay = document.getElementById('classicOverpayment');
//   let classicEffective = document.getElementById('classicEffectiveRate');
//   let annuityMonthly = document.getElementById('annuityMonthlyPayment');
//   let annuityInterest = document.getElementById('annuityInterestExpense');
//   let annuityOverpay = document.getElementById('annuityOverpayment');
//   let annuityEffective = document.getElementById('annuityEffectiveRate');
//   let infoBlock = document.querySelector('.form__result');

//   let onceCommissionPercent = parseFloat(document.getElementById('once-commission-percent').value) || 0;
//   let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value) || 0;
//   let annualInsuranceAmount = parseFloat(document.getElementById('annual-insurance-amount').value) || 0;
//   let monthlyCommissionPercent = parseFloat(document.getElementById('monthly-commission-percent').value) || 0;
//   let monthlyCommissionAmount = parseFloat(document.getElementById('monthly-commission-amount').value) || 0;
//   let monthlyInsurancePercent = parseFloat(document.getElementById('monthly-insurance-percent').value) || 0;
//   let monthlyInsuranceAmount = parseFloat(document.getElementById('monthly-insurance-amount').value) || 0;

//   let interestValue = interest;
//   let amountValue = amount;
//   let downpaymentPercentValue = downpaymentPercent;
//   let listValue = list;
//   let onceCommissionAbsolute = amount * onceCommissionPercent / 100;
//   let monthlyCommissionAbsolute = amount * monthlyCommissionPercent / 100;
//   let monthlyInsuranceAbsolute = amount * monthlyInsurancePercent / 100;

//   let principal = amountValue + onceCommissionAbsolute + onceCommissionAmount + monthlyCommissionAmount + monthlyCommissionAbsolute + monthlyInsuranceAmount + monthlyInsuranceAbsolute;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let x = Math.pow(1 + monthlyRate, calculatePayments);
//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0) {
//     infoBlock.style.display = 'none';
//     let totalPayment = monthly * calculatePayments;
//     let interestExpense = totalPayment - principal;
//     let overPayment = interestExpense;
//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;

//     let remainingBalance = principal;
//     let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//     classicTableBody.innerHTML = '';

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString('default', { month: 'long' });
//       let interestPayment = remainingBalance * monthlyRate;
//       let principalPayment = (principal / calculatePayments) + interestPayment;
//       let commissionPayment = monthlyCommissionAmount / calculatePayments;
//       remainingBalance -= principal / calculatePayments;
//       let row = `
//         <tr>
//           <td>${i} (${monthName})</td>
//           <td>${(principal / calculatePayments + interestPayment).toFixed(2)}</td>
//           <td>${(principal / calculatePayments).toFixed(2)}</td>
//           <td>${interestPayment.toFixed(2)}</td>
//           <td>${annualInsuranceAmount.toFixed(2)}</td>
//           <td>${commissionPayment.toFixed(2)}</td>
//           <td>${remainingBalance.toFixed(2)}</td>
//         </tr>
//       `;
//       classicTableBody.innerHTML += row;
//     }

//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments)) + (monthlyCommissionAmount / calculatePayments);
//     let annuityRemainingBalance = principal;
//     let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//     annuityTableBody.innerHTML = '';

//     for (let i = 1; i <= calculatePayments; i++) {
//       let currentDate = new Date();
//       currentDate.setMonth(currentDate.getMonth() + i - 1);
//       let monthName = currentDate.toLocaleString('default', { month: 'long' });
//       let interestPayment = annuityRemainingBalance * monthlyRate;
//       let principalPayment = annuityMonthlyPayment - interestPayment;
//       let commissionPayment = monthlyCommissionAmount / calculatePayments;
//       annuityRemainingBalance -= principalPayment;
//       let row = `
//         <tr>
//           <td>${i} (${monthName})</td>
//           <td>${annuityMonthlyPayment.toFixed(2)}</td>
//           <td>${principalPayment.toFixed(2)}</td>
//           <td>${interestPayment.toFixed(2)}</td>
//           <td>${annualInsuranceAmount.toFixed(2)}</td>
//           <td>${commissionPayment.toFixed(2)}</td>
//           <td>${annuityRemainingBalance.toFixed(2)}</td>
//         </tr>
//       `;
//       annuityTableBody.innerHTML += row;
//     }

//   } else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//     infoBlock.style.display = 'block';
//     infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn')

// let annuityBtn = document.getElementById('annuity__table-btn')

// let annuityContainer = document.getElementById('annuity-table-container')

// let classicContainer = document.getElementById('classic-table-container')

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block'
//   annuityContainer.style.display = 'none'
// }

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block'
//   classicContainer.style.display = 'none'
// }

// const translations = {
//        en: {
//          "form_title": "Loan Calculator",
//          "amount_label": "Loan Amount (UAH):",
//          "interest_label": "Annual Interest Rate (%):",
//          "downpayment_label": "Down Payment %:",
//          "term_label": "Loan Term:",
//          "calculate_button": "Calculate",
//          "classic_tab": "Classic",
//          "annuity_tab": "Annuity",
//          "period": "Period (Month)",
//          "monthly_payment": "Monthly Payment",
//          "principal_repayment": "Principal Repayment",
//          "interest_repayment": "Interest Repayment",
//          "commission_repayment": "Commission Repayment",
//          "remaining_balance": "Remaining Balance",
//          "calculation_type": "Calculation Type",
//          "interest_expense": "Interest Expenses",
//          "overpayment": "Overpayment",
//          "effective_rate": "Effective Rate",
//          "once_commission_percent_label": "Once Commission (%):",
//          "once_commission_amount_label": "Once Commission (amount):",
//          "annual_insurance_amount_label": "Annual Insurance (amount):",
//          "monthly_commission_percent_label": "Monthly Commission (% of loan):",
//          "monthly_commission_amount_label": "Monthly Commission (amount):",
//          "monthly_insurance_percent_label": "Monthly Insurance (% of balance):",
//          "monthly_insurance_amount_label": "Monthly Insurance (amount):"
//        },
//        uk: {
//          "form_title": "Калькулятор кредитів",
//          "amount_label": "Сума кредиту (грн):",
//          "interest_label": "Річна процентна ставка (%):",
//          "downpayment_label": "Перший внесок %:",
//          "term_label": "Термін кредиту:",
//          "calculate_button": "Розрахувати",
//          "classic_tab": "Класика",
//          "annuity_tab": "Ануїтет",
//          "period": "Період (Місяць)",
//          "monthly_payment": "Щомісячний платіж",
//          "principal_repayment": "Погашення тіла кредиту",
//          "interest_repayment": "Погашення процентів",
//          "commission_repayment": "Погашення комісій",
//          "remaining_balance": "Залишок боргу",
//          "calculation_type": "Тип розрахунку",
//          "interest_expense": "Витрати на відсотки",
//          "overpayment": "Переплата",
//          "effective_rate": "Ефективна ставка",
//          "once_commission_percent_label": "Разова комісія (%):",
//          "once_commission_amount_label": "Разова комісія (сума):",
//          "annual_insurance_amount_label": "Щорічне страхування (сума):",
//          "monthly_commission_percent_label": "Щомісячна комісія (% від кредиту):",
//          "monthly_commission_amount_label": "Щомісячна комісія (сума):",
//          "monthly_insurance_percent_label": "Щомісячне страхування (% від залишку):",
//          "monthly_insurance_amount_label": "Щомісячне страхування (сума):"
//        },

//        ru: {
//          "form_title": "Кредитный калькулятор",
//          "amount_label": "Сумма кредита (грн):",
//          "interest_label": "Годовая процентная ставка (%):",
//          "downpayment_label": "Сумма аванса %:",
//          "term_label": "Срок кредита:",
//          "calculate_button": "Рассчитать",
//          "classic_tab": "Классика",
//          "annuity_tab": "Аннуитет",
//          "period": "Период (месяц)",
//          "monthly_payment": "Ежемесячный платеж",
//          "principal_repayment": "Погашение тела кредита",
//          "interest_repayment": "Погашение процентов",
//          "commission_repayment": "Погашение комиссий",
//          "remaining_balance": "Остаток задолженности",
//          "calculation_type": "Тип расчёта",
//          "interest_expense": "Процентные расходы по кредиту",
//          "overpayment": "Переплата",
//          "effective_rate": "Эффективная ставка",
//          "once_commission_percent_label": "Разовая комиссия (%):",
//          "once_commission_amount_label": "Разовая комиссия (сумма):",
//          "annual_insurance_amount_label": "Ежегодная страховка (сумма):",
//          "monthly_commission_percent_label": "Ежемесячная комиссия (% от кредита):",
//          "monthly_commission_amount_label": "Ежемесячная комиссия (сумма):",
//          "monthly_insurance_percent_label": "Ежемесячная страховка (% от остатка):",
//          "monthly_insurance_amount_label": "Ежемесячная страховка (сумма):"
//        }
//      };

//      function changeLanguage() {
//        const lang = document.getElementById('languageSelect').value;
//        document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//        document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//        document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//        document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//        document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//        document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//        document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//        document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//        document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//        document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//        document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//        document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//        document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//        document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//        document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];
//        const updateTableHeaders = (tableId, headers) => {
//          const table = document.getElementById(tableId);
//          headers.forEach((header, index) => {
//            table.querySelectorAll('th')[index].textContent = translations[lang][header];
//          });
//        };
//        updateTableHeaders('classic-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//        updateTableHeaders('annuity-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//        document.querySelector('label[for="once-commission-percent"]').textContent = translations[lang]['once_commission_percent_label'];
//        document.querySelector('label[for="once-commission-amount"]').textContent = translations[lang]['once_commission_amount_label'];
//        document.querySelector('label[for="annual-insurance-amount"]').textContent = translations[lang]['annual_insurance_amount_label'];
//        document.querySelector('label[for="monthly-commission-percent"]').textContent = translations[lang]['monthly_commission_percent_label'];
//        document.querySelector('label[for="monthly-commission-amount"]').textContent = translations[lang]['monthly_commission_amount_label'];
//        document.querySelector('label[for="monthly-insurance-percent"]').textContent = translations[lang]['monthly_insurance_percent_label'];
//        document.querySelector('label[for="monthly-insurance-amount"]').textContent = translations[lang]['monthly_insurance_amount_label'];
//      }

//вариант с коммсиией самый нормальный
// let calcButton = document.getElementById('btn-result');

// calcButton.onclick = function() {
//   calculateLoan();
// }

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById('amount').value);
//   let interest = parseFloat(document.getElementById('interest').value);
//   let result = document.getElementById('result');
//   let downpaymentPercent = parseFloat(document.getElementById('downpayment-percent').value);
//   let list = parseFloat(document.getElementById('list').value);
//   let classicMonthly = document.getElementById('classicMonthlyPayment');
//   let classicInterest = document.getElementById('classicInterestExpense');
//   let classicOverpay = document.getElementById('classicOverpayment');
//   let classicEffective = document.getElementById('classicEffectiveRate');
//   let annuityMonthly = document.getElementById('annuityMonthlyPayment');
//   let annuityInterest = document.getElementById('annuityInterestExpense');
//   let annuityOverpay = document.getElementById('annuityOverpayment');
//   let annuityEffective = document.getElementById('annuityEffectiveRate');
//   let infoBlock = document.querySelector('.form__result');

//   let onceCommissionPercent = parseFloat(document.getElementById('once-commission-percent').value);
//   let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value);
//   let annualInsuranceAmount = parseFloat(document.getElementById('annual-insurance-amount').value);
//   let monthlyCommissionPercent = parseFloat(document.getElementById('monthly-commission-percent').value);
//   let monthlyCommissionAmount = parseFloat(document.getElementById('monthly-commission-amount').value);
//   let monthlyInsurancePercent = parseFloat(document.getElementById('monthly-insurance-percent').value);
//   let monthlyInsuranceAmount = parseFloat(document.getElementById('monthly-insurance-amount').value);

//   let interestValue = interest;
//   let amountValue = amount;
//   let downpaymentPercentValue = downpaymentPercent;
//   let listValue = list;
//   let onceCommissionAbsolute = amount * onceCommissionPercent / 100;
//   let monthlyCommissionAbsolute = amount * monthlyCommissionPercent / 100;
//   let monthlyInsuranceAbsolute = amount * monthlyInsurancePercent / 100;

//   let principal = amountValue + onceCommissionAmount + onceCommissionAbsolute + annualInsuranceAmount + monthlyCommissionAmount + monthlyCommissionAbsolute + monthlyInsuranceAmount + monthlyInsuranceAbsolute + onceCommissionAmount + annualInsuranceAmount + monthlyCommissionAmount + monthlyInsuranceAmount;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let x = Math.pow(1 + monthlyRate, calculatePayments);
//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0) {
//     infoBlock.style.display = 'none';
//     let totalPayment = monthly * calculatePayments;
//     let interestExpense = totalPayment - principal;
//     let overPayment = interestExpense;
//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;
//     let classicOverpayment = classicInterestExpense;
//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverpayment = annuityInterestExpense;
//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     classicMonthly.innerHTML = classicMonthlyPayment.toFixed(2);
//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);
//     classicOverpay.innerHTML = classicOverpayment.toFixed(2);
//     classicEffective.innerHTML = classicEffectiveRate.toFixed(2);

//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);
//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);
//     annuityOverpay.innerHTML = annuityOverpayment.toFixed(2);
//     annuityEffective.innerHTML = annuityEffectiveRate.toFixed(2);
//   } else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//     infoBlock.style.display = 'block';
//     infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }

//   let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//   let remainingBalance = principal;
//   let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//   classicTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = remainingBalance * monthlyRate;
//     let principalPayment = classicMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     remainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${classicMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${remainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     classicTableBody.innerHTML += row;
//   }

//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//   let annuityRemainingBalance = principal;
//   let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//   annuityTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     annuityRemainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${annuityMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${annuityRemainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     annuityTableBody.innerHTML += row;
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn')

// let annuityBtn = document.getElementById('annuity__table-btn')

// let annuityContainer = document.getElementById('annuity-table-container')

// let classicContainer = document.getElementById('classic-table-container')

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block'
//   annuityContainer.style.display = 'none'
// }

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block'
//   classicContainer.style.display = 'none'
// }

// const translations = {
//        en: {
//          "form_title": "Loan Calculator",
//          "amount_label": "Loan Amount (UAH):",
//          "interest_label": "Annual Interest Rate (%):",
//          "downpayment_label": "Down Payment %:",
//          "term_label": "Loan Term:",
//          "calculate_button": "Calculate",
//          "classic_tab": "Classic",
//          "annuity_tab": "Annuity",
//          "period": "Period (Month)",
//          "monthly_payment": "Monthly Payment",
//          "principal_repayment": "Principal Repayment",
//          "interest_repayment": "Interest Repayment",
//          "commission_repayment": "Commission Repayment",
//          "remaining_balance": "Remaining Balance",
//          "calculation_type": "Calculation Type",
//          "interest_expense": "Interest Expenses",
//          "overpayment": "Overpayment",
//          "effective_rate": "Effective Rate",
//          "once_commission_percent_label": "Once Commission (%):",
//          "once_commission_amount_label": "Once Commission (amount):",
//          "annual_insurance_amount_label": "Annual Insurance (amount):",
//          "monthly_commission_percent_label": "Monthly Commission (% of loan):",
//          "monthly_commission_amount_label": "Monthly Commission (amount):",
//          "monthly_insurance_percent_label": "Monthly Insurance (% of balance):",
//          "monthly_insurance_amount_label": "Monthly Insurance (amount):"
//        },
//        uk: {
//          "form_title": "Калькулятор кредитів",
//          "amount_label": "Сума кредиту (грн):",
//          "interest_label": "Річна процентна ставка (%):",
//          "downpayment_label": "Перший внесок %:",
//          "term_label": "Термін кредиту:",
//          "calculate_button": "Розрахувати",
//          "classic_tab": "Класика",
//          "annuity_tab": "Ануїтет",
//          "period": "Період (Місяць)",
//          "monthly_payment": "Щомісячний платіж",
//          "principal_repayment": "Погашення тіла кредиту",
//          "interest_repayment": "Погашення процентів",
//          "commission_repayment": "Погашення комісій",
//          "remaining_balance": "Залишок боргу",
//          "calculation_type": "Тип розрахунку",
//          "interest_expense": "Витрати на відсотки",
//          "overpayment": "Переплата",
//          "effective_rate": "Ефективна ставка",
//          "once_commission_percent_label": "Разова комісія (%):",
//          "once_commission_amount_label": "Разова комісія (сума):",
//          "annual_insurance_amount_label": "Щорічне страхування (сума):",
//          "monthly_commission_percent_label": "Щомісячна комісія (% від кредиту):",
//          "monthly_commission_amount_label": "Щомісячна комісія (сума):",
//          "monthly_insurance_percent_label": "Щомісячне страхування (% від залишку):",
//          "monthly_insurance_amount_label": "Щомісячне страхування (сума):"
//        },
//        ru: {
//          "form_title": "Кредитный калькулятор",
//          "amount_label": "Сумма кредита (грн):",
//          "interest_label": "Годовая процентная ставка (%):",
//          "downpayment_label": "Сумма аванса %:",
//          "term_label": "Срок кредита:",
//          "calculate_button": "Рассчитать",
//          "classic_tab": "Классика",
//          "annuity_tab": "Аннуитет",
//          "period": "Период (месяц)",
//          "monthly_payment": "Ежемесячный платеж",
//          "principal_repayment": "Погашение тела кредита",
//          "interest_repayment": "Погашение процентов",
//          "commission_repayment": "Погашение комиссий",
//          "remaining_balance": "Остаток задолженности",
//          "calculation_type": "Тип расчёта",
//          "interest_expense": "Процентные расходы по кредиту",
//          "overpayment": "Переплата",
//          "effective_rate": "Эффективная ставка",
//          "once_commission_percent_label": "Разовая комиссия (%):",
//          "once_commission_amount_label": "Разовая комиссия (сумма):",
//          "annual_insurance_amount_label": "Ежегодная страховка (сумма):",
//          "monthly_commission_percent_label": "Ежемесячная комиссия (% от кредита):",
//          "monthly_commission_amount_label": "Ежемесячная комиссия (сумма):",
//          "monthly_insurance_percent_label": "Ежемесячная страховка (% от остатка):",
//          "monthly_insurance_amount_label": "Ежемесячная страховка (сумма):"
//        }
//      };

//      function changeLanguage() {
//        const lang = document.getElementById('languageSelect').value;
//        document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//        document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//        document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//        document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//        document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//        document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//        document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//        document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//        document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//        document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//        document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//        document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//        document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//        document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//        document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];
//        const updateTableHeaders = (tableId, headers) => {
//          const table = document.getElementById(tableId);
//          headers.forEach((header, index) => {
//            table.querySelectorAll('th')[index].textContent = translations[lang][header];
//          });
//        };
//        updateTableHeaders('classic-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//        updateTableHeaders('annuity-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//        document.querySelector('label[for="once-commission-percent"]').textContent = translations[lang]['once_commission_percent_label'];
//        document.querySelector('label[for="once-commission-amount"]').textContent = translations[lang]['once_commission_amount_label'];
//        document.querySelector('label[for="annual-insurance-amount"]').textContent = translations[lang]['annual_insurance_amount_label'];
//        document.querySelector('label[for="monthly-commission-percent"]').textContent = translations[lang]['monthly_commission_percent_label'];
//        document.querySelector('label[for="monthly-commission-amount"]').textContent = translations[lang]['monthly_commission_amount_label'];
//        document.querySelector('label[for="monthly-insurance-percent"]').textContent = translations[lang]['monthly_insurance_percent_label'];
//        document.querySelector('label[for="monthly-insurance-amount"]').textContent = translations[lang]['monthly_insurance_amount_label'];
//      }

//не правильно
// let calcButton = document.getElementById('btn-result');
// let clearButton = document.getElementById('btn-clear');

// calcButton.onclick = function() {
//     calculateLoan();
// };

// clearButton.onclick = function() {
//     clearAllFields();
// };

// function calculateNPV(principal, monthlyRate, calculatePayments, targetNPV) {
//     let npv = 0;
//     for (let i = 1; i <= calculatePayments; i++) {
//         npv += principal / Math.pow(1 + monthlyRate, i);
//     }
//     npv -= targetNPV;
//     return npv;
// }

// function calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon) {
//     let maxIterations = 1000;
//     let newRate = guessRate;

//     for (let i = 0; i < maxIterations; i++) {
//         let npv = calculateNPV(principal, newRate / 12, calculatePayments, targetNPV);

//         if (Math.abs(npv) < epsilon) {
//             return newRate * 100;
//         }

//         let derivative = (calculateNPV(principal, (newRate + epsilon) / 12, calculatePayments, targetNPV) - calculateNPV(principal, newRate / 12, calculatePayments, targetNPV)) / epsilon;
//         newRate = newRate - npv / derivative;
//     }

//     return null;
// }

// function calculateLoan() {
//     let amount = parseFloat(document.getElementById('amount').value);
//     let interest = parseFloat(document.getElementById('interest').value);
//     let downpaymentPercent = parseFloat(document.getElementById('downpayment-percent').value);
//     let list = parseFloat(document.getElementById('list').value);
//     let result = document.getElementById('result');
//     let infoBlock = document.querySelector('.form__result');
//     let onceCommissionPercent = parseFloat(document.getElementById('once-commission-percent').value);
//     let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value);
//     let annualInsurance = parseFloat(document.getElementById('annual-insurance-amount').value);
//     let monthlyCommissionPercent = parseFloat(document.getElementById('monthly-commission-percent').value);
//     let monthlyCommissionAmount = parseFloat(document.getElementById('monthly-commission-amount').value);
//     let monthlyInsurancePercent = parseFloat(document.getElementById('monthly-insurance-percent').value);
//     let monthlyInsuranceAmount = parseFloat(document.getElementById('monthly-insurance-amount').value);

//     let principal = amount * (1 - downpaymentPercent / 100);
//     let onceCommission = onceCommissionAmount;
//     let nominalRate = interest / 100;
//     let monthlyRate = nominalRate / 12;
//     let calculatePayments = list;
//     let targetNPV = 0;
//     let epsilon = 0.0001;
//     let guessRate = 0.01;

//     let classicEffectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);
//     let annuityEffectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//     if (!isNaN(classicMonthlyPayment) && classicMonthlyPayment !== Infinity && classicMonthlyPayment > 0 && !isNaN(classicEffectiveRate) && !isNaN(annuityMonthlyPayment) && annuityMonthlyPayment !== Infinity && annuityMonthlyPayment > 0 && !isNaN(annuityEffectiveRate)) {
//         let classicTotalPayment = classicMonthlyPayment * calculatePayments;
//         let classicInterestExpense = classicTotalPayment - principal;
//         let classicOverpayment = classicInterestExpense;
//         let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//         let annuityInterestExpense = annuityTotalPayment - principal;
//         let annuityOverpayment = annuityInterestExpense;

//         let classicMinMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//         let classicMaxMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate * list);

//         updateTablesAndCharts(amount, interest, downpaymentPercent, list, onceCommissionAmount, annualInsurance, monthlyCommissionPercent, monthlyCommissionAmount, monthlyInsurancePercent, monthlyInsuranceAmount, classicMinMonthlyPayment, classicMaxMonthlyPayment);

//         infoBlock.style.display = 'none';
//         result.innerHTML = `Ежемесячный платёж: от ${classicMinMonthlyPayment.toFixed(2)} до ${classicMaxMonthlyPayment.toFixed(2)} грн.<br> Общие процентные расходы по кредиту: ${classicInterestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${classicOverpayment.toFixed(2)} грн.<br> Эффективная процентная ставка (Классический): ${classicEffectiveRate.toFixed(2)}%<br> Эффективная процентная ставка (Аннуитетный): ${annuityEffectiveRate.toFixed(2)}%`;
//     } else {
//         result.innerHTML = 'Данные указаны неверно или отсутствуют';

//         infoBlock.style.display = 'block';

//         infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//     }
// }

// function updateTablesAndCharts(amount, interest, downpaymentPercent, list, onceCommission, annualInsurance, monthlyCommissionPercent, monthlyCommissionAmount, monthlyInsurancePercent, monthlyInsuranceAmount, classicMinMonthlyPayment, classicMaxMonthlyPayment) {
//     let principal = amount * (1 - downpaymentPercent / 100);
//     let nominalRate = interest / 100;
//     let monthlyRate = nominalRate / 12;
//     let calculatePayments = list;
//     let targetNPV = 0;
//     let epsilon = 0.0001;
//     let guessRate = 0.01;

//     let classicEffectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);
//     let annuityEffectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//     if (!isNaN(classicMonthlyPayment) && classicMonthlyPayment !== Infinity && classicMonthlyPayment > 0 && !isNaN(classicEffectiveRate) && !isNaN(annuityMonthlyPayment) && annuityMonthlyPayment !== Infinity && annuityMonthlyPayment > 0 && !isNaN(annuityEffectiveRate)) {
//         let classicTotalPayment = classicMonthlyPayment * calculatePayments;
//         let classicInterestExpense = classicTotalPayment - principal;
//         let classicOverpayment = classicInterestExpense;
//         let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//         let annuityInterestExpense = annuityTotalPayment - principal;
//         let annuityOverpayment = annuityInterestExpense;

//         updateClassicLoanTable(principal, calculatePayments, monthlyRate, classicMonthlyPayment, onceCommission);

//         updateAnnuityLoanTable(principal, calculatePayments, monthlyRate, annuityMonthlyPayment, onceCommission);

//         updateLoanTable(classicMonthlyPayment, classicInterestExpense, classicOverpayment, classicEffectiveRate, annuityMonthlyPayment, annuityInterestExpense, annuityOverpayment, annuityEffectiveRate, classicMinMonthlyPayment, classicMaxMonthlyPayment);
//     }
// }

// function updateClassicLoanTable(principal, calculatePayments, monthlyRate, classicMonthlyPayment, onceCommission) {
//     let remainingBalance = principal;
//     let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//     classicTableBody.innerHTML = '';

//     for (let i = 1; i <= calculatePayments; i++) {
//         let currentDate = new Date();
//         currentDate.setMonth(currentDate.getMonth() + i - 1);
//         let monthName = currentDate.toLocaleString('default', { month: 'long' });
//         let interestPayment = remainingBalance * monthlyRate;
//         let principalPayment = classicMonthlyPayment - interestPayment;
//         remainingBalance -= principalPayment;
//         let row = `
//             <tr>
//                 <td>${i} (${monthName})</td>
//                 <td>${classicMonthlyPayment.toFixed(2)}</td>
//                 <td>${principalPayment.toFixed(2)}</td>
//                 <td>${interestPayment.toFixed(2)}</td>
//                 <td>${onceCommission.toFixed(2)}</td>
//                 <td>${remainingBalance.toFixed(2)}</td>
//             </tr>
//         `;
//         classicTableBody.innerHTML += row;
//     }
// }

// function updateAnnuityLoanTable(principal, calculatePayments, monthlyRate, annuityMonthlyPayment, onceCommission) {
//     let annuityRemainingBalance = principal;
//     let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//     annuityTableBody.innerHTML = '';

//     for (let i = 1; i <= calculatePayments; i++) {
//         let currentDate = new Date();
//         currentDate.setMonth(currentDate.getMonth() + i - 1);
//         let monthName = currentDate.toLocaleString('default', { month: 'long' });
//         let interestPayment = annuityRemainingBalance * monthlyRate;
//         let principalPayment = annuityMonthlyPayment - interestPayment;
//         annuityRemainingBalance -= principalPayment;
//         let row = `
//             <tr>
//                 <td>${i} (${monthName})</td>
//                 <td>${annuityMonthlyPayment.toFixed(2)}</td>
//                 <td>${principalPayment.toFixed(2)}</td>
//                 <td>${interestPayment.toFixed(2)}</td>
//                 <td>${onceCommission.toFixed(2)}</td>
//                 <td>${annuityRemainingBalance.toFixed(2)}</td>
//             </tr>
//         `;
//         annuityTableBody.innerHTML += row;
//     }
// }

// function updateLoanTable(classicMonthlyPayment, classicInterestExpense, classicOverpayment, classicEffectiveRate, annuityMonthlyPayment, annuityInterestExpense, annuityOverpayment, annuityEffectiveRate, classicMinMonthlyPayment, classicMaxMonthlyPayment) {
//     let loanTable = document.getElementById('loan-table').getElementsByTagName('tbody')[0];
//     loanTable.innerHTML = '';

//     let classicRow = `
//         <tr>
//             <td>Классический</td>
//             <td>От ${classicMinMonthlyPayment.toFixed(2)} до ${classicMaxMonthlyPayment.toFixed(2)}</td>
//             <td>${classicInterestExpense.toFixed(2)}</td>
//             <td>${classicOverpayment.toFixed(2)}</td>
//             <td>${classicEffectiveRate.toFixed(2)}</td>
//         </tr>
//     `;
//     loanTable.innerHTML += classicRow;

//     let annuityRow = `
//         <tr>
//             <td>Аннуитетный</td>
//             <td>${annuityMonthlyPayment.toFixed(2)}</td>
//             <td>${annuityInterestExpense.toFixed(2)}</td>
//             <td>${annuityOverpayment.toFixed(2)}</td>
//             <td>${annuityEffectiveRate.toFixed(2)}</td>
//         </tr>
//     `;
//     loanTable.innerHTML += annuityRow;
// }

// function clearAllFields() {
//     let inputFields = document.querySelectorAll('input[type=text]');
//     inputFields.forEach(function(input) {
//         input.value = '';
//     });

//     let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//     classicTableBody.innerHTML = '';

//     let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//     annuityTableBody.innerHTML = '';

//     let loanTable = document.getElementById('loan-table').getElementsByTagName('tbody')[0];
//     loanTable.innerHTML = '';

//     let result = document.getElementById('result');
//     result.innerHTML = '';

//     let infoBlock = document.querySelector('.form__result');
//     infoBlock.style.display = 'none';
// }

// let classicBtn = document.getElementById('classic__table-btn');
// let annuityBtn = document.getElementById('annuity__table-btn');
// let annuityContainer = document.getElementById('annuity-table-container');
// let classicContainer = document.getElementById('classic-table-container');

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block';
//   annuityContainer.style.display = 'none';
// };

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block';
//   classicContainer.style.display = 'none';
// };

// const translations = {
//   en: {
//     "form_title": "Loan Calculator",
//     "amount_label": "Loan Amount (UAH):",
//     "interest_label": "Annual Interest Rate (%):",
//     "downpayment_label": "Down Payment %:",
//     "term_label": "Loan Term:",
//     "calculate_button": "Calculate",
//     "classic_tab": "Classic",
//     "annuity_tab": "Annuity",
//     "period": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance",
//     "calculation_type": "Calculation Type",
//     "interest_expense": "Interest Expenses",
//     "overpayment": "Overpayment",
//     "effective_rate": "Effective Rate",
//     "once_commission_percent_label": "Once Commission (%):",
//     "once_commission_amount_label": "Once Commission (amount):",
//     "annual_insurance_amount_label": "Annual Insurance (amount):",
//     "monthly_commission_percent_label": "Monthly Commission (% of loan):",
//     "monthly_commission_amount_label": "Monthly Commission (amount):",
//     "monthly_insurance_percent_label": "Monthly Insurance (% of balance):",
//     "monthly_insurance_amount_label": "Monthly Insurance (amount):"
//   },
//   uk: {
//     "form_title": "Калькулятор кредитів",
//     "amount_label": "Сума кредиту (грн):",
//     "interest_label": "Річна процентна ставка (%):",
//     "downpayment_label": "Перший внесок %:",
//     "term_label": "Термін кредиту:",
//     "calculate_button": "Розрахувати",
//     "classic_tab": "Класика",
//     "annuity_tab": "Ануїтет",
//     "period": "Період (Місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення процентів",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу",
//     "calculation_type": "Тип розрахунку",
//     "interest_expense": "Витрати на відсотки",
//     "overpayment": "Переплата",
//     "effective_rate": "Ефективна ставка",
//     "once_commission_percent_label": "Разова комісія (%):",
//     "once_commission_amount_label": "Разова комісія (сума):",
//     "annual_insurance_amount_label": "Щорічне страхування (сума):",
//     "monthly_commission_percent_label": "Щомісячна комісія (% від кредиту):",
//     "monthly_commission_amount_label": "Щомісячна комісія (сума):",
//     "monthly_insurance_percent_label": "Щомісячне страхування (% від залишку):",
//     "monthly_insurance_amount_label": "Щомісячне страхування (сума):"
//   },
//   ru: {
//     "form_title": "Кредитный калькулятор",
//     "amount_label": "Сумма кредита (грн):",
//     "interest_label": "Годовая процентная ставка (%):",
//     "downpayment_label": "Сумма аванса %:",
//     "term_label": "Срок кредита:",
//     "calculate_button": "Рассчитать",
//     "classic_tab": "Классика",
//     "annuity_tab": "Аннуитет",
//     "period": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности",
//     "calculation_type": "Тип расчёта",
//     "interest_expense": "Процентные расходы по кредиту",
//     "overpayment": "Переплата",
//     "effective_rate": "Эффективная ставка",
//     "once_commission_percent_label": "Разовая комиссия (%):",
//     "once_commission_amount_label": "Разовая комиссия (сумма):",
//     "annual_insurance_amount_label": "Ежегодная страховка (сумма):",
//     "monthly_commission_percent_label": "Ежемесячная комиссия (% от кредита):",
//     "monthly_commission_amount_label": "Ежемесячная комиссия (сумма):",
//     "monthly_insurance_percent_label": "Ежемесячная страховка (% от остатка):",
//     "monthly_insurance_amount_label": "Ежемесячная страховка (сумма):"
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelect').value;
//   document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//   document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//   document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//   document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//   document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//   document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//   document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//   document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//   document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//   document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//   document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//   document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//   document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//   document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//   document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];

//   const updateTableHeaders = (tableId, headers) => {
//     const table = document.getElementById(tableId);
//     headers.forEach((header, index) => {
//       table.querySelectorAll('th')[index].textContent = translations[lang][header];
//     });
//   };

//   updateTableHeaders('classic-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//   updateTableHeaders('annuity-loan-table', ['period', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);

//   document.querySelector('label[for="once-commission-percent"]').textContent = translations[lang]['once_commission_percent_label'];
//   document.querySelector('label[for="once-commission-amount"]').textContent = translations[lang]['once_commission_amount_label'];
//   document.querySelector('label[for="annual-insurance-amount"]').textContent = translations[lang]['annual_insurance_amount_label'];
//   document.querySelector('label[for="monthly-commission-percent"]').textContent = translations[lang]['monthly_commission_percent_label'];
//   document.querySelector('label[for="monthly-commission-amount"]').textContent = translations[lang]['monthly_commission_amount_label'];
//   document.querySelector('label[for="monthly-insurance-percent"]').textContent = translations[lang]['monthly_insurance_percent_label'];
//   document.querySelector('label[for="monthly-insurance-amount"]').textContent = translations[lang]['monthly_insurance_amount_label'];
// }

// //почти правильно с комиссией
// let calcButton = document.getElementById('btn-result');

// calcButton.onclick = function() {
//   calculateLoan();
// };

// function calculateNPV(principal, monthlyRate, calculatePayments, targetNPV) {
//   let npv = 0;
//   for (let i = 1; i <= calculatePayments; i++) {
//     npv += principal / Math.pow(1 + monthlyRate, i);
//   }
//   npv -= targetNPV;
//   return npv;
// }

// function calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon) {
//   let maxIterations = 1000;
//   let npv = 1;
//   let newRate = guessRate;

//   for (let i = 0; i < maxIterations; i++) {
//     npv = calculateNPV(principal, newRate / 12, calculatePayments, targetNPV);

//     if (Math.abs(npv) < epsilon) {
//       return newRate * 100;
//     }

//     newRate = newRate - (npv) / (calculateNPV(principal, (newRate + epsilon) / 12, calculatePayments, targetNPV) - calculateNPV(principal, newRate / 12, calculatePayments, targetNPV));
//   }

//   return null;
// }

// function calculateLoan() {
//   let amount = document.getElementById('amount');
//   let interest = document.getElementById('interest');
//   let result = document.getElementById('result');
//   let downpaymentPercent = document.getElementById('downpayment-percent');
//   let list = document.getElementById('list');
//   let infoBlock = document.querySelector('.form__result');
//   let onceCommissionPercent = parseFloat(document.getElementById('once-commission-percent').value);
//   let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value);
//   let annualInsurance = parseFloat(document.getElementById('annual-insurance-amount').value);
//   let monthlyCommissionPercent = parseFloat(document.getElementById('monthly-commission-percent').value);
//   let monthlyInsurancePercent = parseFloat(document.getElementById('monthly-insurance-percent').value);

//   let interestValue = parseFloat(interest.value);
//   let amountValue = parseFloat(amount.value);
//   let downpaymentPercentValue = parseFloat(downpaymentPercent.value);
//   let listValue = parseFloat(list.value);
//   let principal = amountValue;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let targetNPV = 0;
//   let epsilon = 0.0001;
//   let guessRate = 0.01;

//   let effectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);
//   let x = Math.pow(1 + monthlyRate, calculatePayments);
//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0 && !isNaN(effectiveRate)) {
//     let totalPayment = monthly * calculatePayments;
//     let interestExpense = totalPayment - principal;
//     let overPayment = interestExpense;
//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate) + ((monthlyCommissionPercent / 100) * principal) + onceCommissionAmount;
//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;
//     let classicOverpayment = classicInterestExpense + onceCommissionAmount;
//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments)) + ((monthlyInsurancePercent / 100) * principal);
//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverpayment = annuityInterestExpense + onceCommissionAmount;
//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     document.getElementById('once-commission-amount').value = onceCommissionPercent * principal / 100;
//     document.getElementById('annual-insurance-amount').value = annualInsurance;
//     document.getElementById('monthly-commission-percent').value = monthlyCommissionPercent;
//     document.getElementById('monthly-insurance-percent').value = monthlyInsurancePercent;

//     updateTablesAndCharts(amountValue, interestValue, downpaymentPercentValue, listValue, onceCommissionAmount, annualInsurance, monthlyCommissionPercent, monthlyInsurancePercent);

//     infoBlock.style.display = 'none';
//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;
//   }

//   else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//     infoBlock.style.display = 'block';
//     infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }
// }

// function updateTablesAndCharts(amount, interest, downpaymentPercent, list, onceCommission, annualInsurance, monthlyCommission, monthlyInsurance) {
//   let principal = amount;
//   let downpayment = (downpaymentPercent / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interest / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = list;
//   let targetNPV = 0;
//   let epsilon = 0.0001;
//   let guessRate = 0.01;

//   let effectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);
//   let x = Math.pow(1 + monthlyRate, calculatePayments);
//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0 && !isNaN(effectiveRate)) {
//     let totalPayment = monthly * calculatePayments;
//     let interestExpense = totalPayment - principal;
//     let overPayment = interestExpense;
//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate) + monthlyCommission;
//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;
//     let classicOverpayment = classicInterestExpense + onceCommission;
//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments)) + monthlyInsurance;
//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverpayment = annuityInterestExpense + onceCommission;
//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     updateClassicLoanTable(principal, calculatePayments, monthlyRate, classicMonthlyPayment, onceCommission);

//     updateAnnuityLoanTable(principal, calculatePayments, monthlyRate, annuityMonthlyPayment, onceCommission);

//     updateLoanTable(classicMonthlyPayment, classicInterestExpense, classicOverpayment, classicEffectiveRate, annuityMonthlyPayment, annuityInterestExpense, annuityOverpayment, annuityEffectiveRate);
//   }
// }

// function updateClassicLoanTable(principal, calculatePayments, monthlyRate, classicMonthlyPayment, onceCommission) {
//   let remainingBalance = principal;
//   let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//   classicTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = remainingBalance * monthlyRate;
//     let principalPayment = classicMonthlyPayment - interestPayment;
//     remainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${classicMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${onceCommission.toFixed(2)}</td>
//         <td>${remainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     classicTableBody.innerHTML += row;
//   }
// }

// function updateAnnuityLoanTable(principal, calculatePayments, monthlyRate, annuityMonthlyPayment, onceCommission) {
//   let annuityRemainingBalance = principal;
//   let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//   annuityTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     annuityRemainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${annuityMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${onceCommission.toFixed(2)}</td>
//         <td>${annuityRemainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     annuityTableBody.innerHTML += row;
//   }
// }

// function updateLoanTable(classicMonthlyPayment, classicInterestExpense, classicOverpayment, classicEffectiveRate, annuityMonthlyPayment, annuityInterestExpense, annuityOverpayment, annuityEffectiveRate) {
//   let loanTable = document.getElementById('loan-table').getElementsByTagName('tbody')[0];
//   loanTable.innerHTML = '';

//   let classicRow = `
//     <tr>
//       <td>Классический</td>
//       <td>${classicMonthlyPayment.toFixed(2)}</td>
//       <td>${classicInterestExpense.toFixed(2)}</td>
//       <td>${classicOverpayment.toFixed(2)}</td>
//       <td>${classicEffectiveRate.toFixed(2)}</td>
//     </tr>
//   `;
//   loanTable.innerHTML += classicRow;

//   let annuityRow = `
//     <tr>
//       <td>Аннуитетный</td>
//       <td>${annuityMonthlyPayment.toFixed(2)}</td>
//       <td>${annuityInterestExpense.toFixed(2)}</td>
//       <td>${annuityOverpayment.toFixed(2)}</td>
//       <td>${annuityEffectiveRate.toFixed(2)}</td>
//     </tr>
//   `;
//   loanTable.innerHTML += annuityRow;
// }

// let classicBtn = document.getElementById('classic__table-btn');
// let annuityBtn = document.getElementById('annuity__table-btn');
// let annuityContainer = document.getElementById('annuity-table-container');
// let classicContainer = document.getElementById('classic-table-container');

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block';
//   annuityContainer.style.display = 'none';
// };

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block';
//   classicContainer.style.display = 'none';
// };

// const translations = {
//   en: {
//     "form_title": "Loan Calculator",
//     "amount_label": "Loan Amount (UAH):",
//     "interest_label": "Annual Interest Rate (%):",
//     "downpayment_label": "Down Payment %:",
//     "term_label": "Loan Term:",
//     "calculate_button": "Calculate",
//     "classic_tab": "Classic",
//     "annuity_tab": "Annuity",
//     "period": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance",
//     "calculation_type": "Calculation Type",
//     "monthly_payment": "Monthly Payment",
//     "interest_expense": "Interest Expenses",
//     "overpayment": "Overpayment",
//     "effective_rate": "Effective Rate",
//     "classic": "Classic",
//     "annuity": "Annuity",
//     "period_month": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance"
//   },

//   uk: {
//     "form_title": "Калькулятор кредитів",
//     "amount_label": "Сума кредиту (грн):",
//     "interest_label": "Річна процентна ставка (%):",
//     "downpayment_label": "Перший внесок %:",
//     "term_label": "Термін кредиту:",
//     "calculate_button": "Розрахувати",
//     "classic_tab": "Класика",
//     "annuity_tab": "Ануїтет",
//     "period": "Період (Місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення процентів",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу",
//     "calculation_type": "Тип розрахунку",
//     "monthly_payment": "Щомісячний платіж",
//     "interest_expense": "Витрати на відсотки",
//     "overpayment": "Переплата",
//     "effective_rate": "Ефективна ставка",
//     "classic": "Класика",
//     "annuity": "Ануїтет",
//     "period_month": "Період (місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення відсотків",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу"
//   },

//   ru: {
//     "form_title": "Кредитный калькулятор",
//     "amount_label": "Сумма кредита (грн):",
//     "interest_label": "Годовая процентная ставка (%):",
//     "downpayment_label": "Сумма аванса %:",
//     "term_label": "Срок кредита:",
//     "calculate_button": "Рассчитать",
//     "classic_tab": "Классика",
//     "annuity_tab": "Аннуитет",
//     "period": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности",
//     "calculation_type": "Тип расчёта",
//     "monthly_payment": "Ежемесячный платеж",
//     "interest_expense": "Процентные расходы по кредиту",
//     "overpayment": "Переплата",
//     "effective_rate": "Эффективная ставка",
//     "classic": "Классический",
//     "annuity": "Аннуитетный",
//     "period_month": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности"
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelect').value;
//   document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//   document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//   document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//   document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//   document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//   document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//   document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//   document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//   document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//   document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//   document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//   document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//   document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//   document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//   document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];

//   const updateTableHeaders = (tableId, headers) => {
//     const table = document.getElementById(tableId);
//     headers.forEach((header, index) => {
//       table.querySelectorAll('th')[index].textContent = translations[lang][header];
//     });
//   };

//   updateTableHeaders('classic-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//   updateTableHeaders('annuity-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
// }

// document.getElementById('languageSelect').addEventListener('change', changeLanguage);
// changeLanguage(); // Set initial language

// full
// let calcButton = document.getElementById('btn-result');

// calcButton.onclick = function() {
//   calculateLoan();
// };

// function calculateNPV(principal, monthlyRate, calculatePayments, targetNPV) {
//   let npv = 0;
//   for (let i = 1; i <= calculatePayments; i++) {
//     npv += principal / Math.pow(1 + monthlyRate, i);
//   }
//   npv -= targetNPV;
//   return npv;
// }

// function calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon) {
//   let maxIterations = 1000;
//   let npv = 1;
//   let newRate = guessRate;

//   for (let i = 0; i < maxIterations; i++) {
//     npv = calculateNPV(principal, newRate / 12, calculatePayments, targetNPV);

//     if (Math.abs(npv) < epsilon) {
//       return newRate * 100;
//     }

//     newRate = newRate - (npv) / (calculateNPV(principal, (newRate + epsilon) / 12, calculatePayments, targetNPV) - calculateNPV(principal, newRate / 12, calculatePayments, targetNPV));
//   }

//   return null;
// }

// function calculateLoan() {
//   let amount = document.getElementById('amount');
//   let interest = document.getElementById('interest');
//   let result = document.getElementById('result');
//   let downpaymentPercent = document.getElementById('downpayment-percent');
//   let list = document.getElementById('list');
//   let classicMonthly = document.getElementById('classicMonthlyPayment');
//   let classicInterest = document.getElementById('classicInterestExpense');
//   let classicOverpay =  document.getElementById('classicOverpayment');
//   let classicEffective =  document.getElementById('classicEffectiveRate');
//   let annuityMonthly = document.getElementById('annuityMonthlyPayment');
//   let annuityInterest = document.getElementById('annuityInterestExpense');
//   let annuityOverpay = document.getElementById('annuityOverpayment');
//   let annuityEffective = document.getElementById('annuityEffectiveRate');
//   let infoBlock = document.querySelector('.form__result');

//   let interestValue = parseFloat(interest.value);
//   let amountValue = parseFloat(amount.value);
//   let downpaymentPercentValue = parseFloat(downpaymentPercent.value);
//   let listValue = parseFloat(list.value);
//   let principal = amountValue;
//   let downpayment = (downpaymentPercentValue / 100) * principal;
//   principal -= downpayment;
//   let nominalRate = interestValue / 100;
//   let monthlyRate = nominalRate / 12;
//   let calculatePayments = listValue;
//   let targetNPV = 0;
//   let epsilon = 0.0001;
//   let guessRate = 0.01;

//   let effectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);
//   let x = Math.pow(1 + monthlyRate, calculatePayments);
//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0 && !isNaN(effectiveRate)) {
//     let totalPayment = monthly * calculatePayments;
//     let interestExpense = totalPayment - principal;
//     let overPayment = interestExpense;
//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;
//     let classicOverpayment = classicInterestExpense;
//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;
//     let annuityInterestExpense = annuityTotalPayment - principal;
//     let annuityOverpayment = annuityInterestExpense;
//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     classicMonthly.innerHTML = classicMonthlyPayment.toFixed(2);
//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);
//     classicOverpay.innerHTML = classicOverpayment.toFixed(2);
//     classicEffective.innerHTML = classicEffectiveRate.toFixed(2);
//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);
//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);
//     annuityOverpay.innerHTML = annuityOverpayment.toFixed(2);
//     annuityEffective.innerHTML = annuityEffectiveRate.toFixed(2);
//     infoBlock.style.display = 'none';
//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;
//   }

//   else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//     infoBlock.style.display = 'block';
//     infoBlock.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }

//   let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);
//   let remainingBalance = principal;
//   let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//   classicTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = remainingBalance * monthlyRate;
//     let principalPayment = classicMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     remainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${classicMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${remainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     classicTableBody.innerHTML += row;
//   }

//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//   let annuityRemainingBalance = principal;
//   let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//   annuityTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {
//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });
//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     annuityRemainingBalance -= principalPayment;
//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${annuityMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${annuityRemainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     annuityTableBody.innerHTML += row;
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn');
// let annuityBtn = document.getElementById('annuity__table-btn');
// let annuityContainer = document.getElementById('annuity-table-container');
// let classicContainer = document.getElementById('classic-table-container');

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block';
//   annuityContainer.style.display = 'none';
// };

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block';
//   classicContainer.style.display = 'none';
// };

// const translations = {
//   en: {
//     "form_title": "Loan Calculator",
//     "amount_label": "Loan Amount (UAH):",
//     "interest_label": "Annual Interest Rate (%):",
//     "downpayment_label": "Down Payment %:",
//     "term_label": "Loan Term:",
//     "calculate_button": "Calculate",
//     "classic_tab": "Classic",
//     "annuity_tab": "Annuity",
//     "period": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance",
//     "calculation_type": "Calculation Type",
//     "monthly_payment": "Monthly Payment",
//     "interest_expense": "Interest Expenses",
//     "overpayment": "Overpayment",
//     "effective_rate": "Effective Rate",
//     "classic": "Classic",
//     "annuity": "Annuity",
//     "period_month": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance"
//   },

//   uk: {
//     "form_title": "Калькулятор кредитів",
//     "amount_label": "Сума кредиту (грн):",
//     "interest_label": "Річна процентна ставка (%):",
//     "downpayment_label": "Перший внесок %:",
//     "term_label": "Термін кредиту:",
//     "calculate_button": "Розрахувати",
//     "classic_tab": "Класика",
//     "annuity_tab": "Ануїтет",
//     "period": "Період (Місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення процентів",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу",
//     "calculation_type": "Тип розрахунку",
//     "monthly_payment": "Щомісячний платіж",
//     "interest_expense": "Витрати на відсотки",
//     "overpayment": "Переплата",
//     "effective_rate": "Ефективна ставка",
//     "classic": "Класика",
//     "annuity": "Ануїтет",
//     "period_month": "Період (місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення відсотків",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу"
//   },

//   ru: {
//     "form_title": "Кредитный калькулятор",
//     "amount_label": "Сумма кредита (грн):",
//     "interest_label": "Годовая процентная ставка (%):",
//     "downpayment_label": "Сумма аванса %:",
//     "term_label": "Срок кредита:",
//     "calculate_button": "Рассчитать",
//     "classic_tab": "Классика",
//     "annuity_tab": "Аннуитет",
//     "period": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности",
//     "calculation_type": "Тип расчёта",
//     "monthly_payment": "Ежемесячный платеж",
//     "interest_expense": "Процентные расходы по кредиту",
//     "overpayment": "Переплата",
//     "effective_rate": "Эффективная ставка",
//     "classic": "Классический",
//     "annuity": "Аннуитетный",
//     "period_month": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности"
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelect').value;
//   document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//   document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//   document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//   document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//   document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//   document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//   document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//   document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//   document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//   document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//   document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//   document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//   document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//   document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//   document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];

//   const updateTableHeaders = (tableId, headers) => {
//     const table = document.getElementById(tableId);
//     headers.forEach((header, index) => {
//       table.querySelectorAll('th')[index].textContent = translations[lang][header];
//     });
//   };

//   updateTableHeaders('classic-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//   updateTableHeaders('annuity-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
// }

// // // c EPS
// let calcButton = document.getElementById('btn-result')

// calcButton.onclick = function() {

//   calculateLoan()

// }

// function calculateNPV(principal, monthlyRate, calculatePayments, targetNPV) {
//   let npv = 0;
//   for (let i = 1; i <= calculatePayments; i++) {
//     npv += principal / Math.pow(1 + monthlyRate, i);
//   }
//   npv -= targetNPV;
//   return npv;
// }

// function calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon) {
//   let maxIterations = 1000;
//   let npv = 1;
//   let newRate = guessRate;

//   for (let i = 0; i < maxIterations; i++) {
//     npv = calculateNPV(principal, newRate / 12, calculatePayments, targetNPV);

//     if (Math.abs(npv) < epsilon) {
//       return newRate * 100;
//     }

//     newRate = newRate - (npv) / (calculateNPV(principal, (newRate + epsilon) / 12, calculatePayments, targetNPV) - calculateNPV(principal, newRate / 12, calculatePayments, targetNPV));
//   }

//   return null;
// }

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let result = document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let list = document.getElementById('list');

//   let classicMonthly = document.getElementById('classicMonthlyPayment')

//   let classicInterest = document.getElementById('classicInterestExpense')

//   let classicOverpay =  document.getElementById('classicOverpayment')

//   let classicEffective =  document.getElementById('classicEffectiveRate')

//   let annuityMonthly = document.getElementById('annuityMonthlyPayment')

//   let annuityInterest = document.getElementById('annuityInterestExpense')

//   let annuityOverpay = document.getElementById('annuityOverpayment')

//   let annuityEffective = document.getElementById('annuityEffectiveRate')

//   let onceCommissionAmount = parseFloat(document.getElementById('once-commission-amount').value);

//   let onceCommissionPercentValue = parseFloat(document.getElementById('once-commission-percent').value);

//   let interestValue = parseFloat(interest.value);

//   let amountValue = parseFloat(amount.value);

//   let downpaymentPercentValue = parseFloat(downpaymentPercent.value);

//   let listValue = parseFloat(list.value);

//   let principal = amountValue;

//   let downpayment = (downpaymentPercentValue / 100) * principal;

//   principal -= downpayment;

//   let nominalRate = interestValue / 100;

//   let monthlyRate = nominalRate / 12;

//   let calculatePayments = listValue;

//   let targetNPV = 0;

//   let epsilon = 0.0001;

//   let guessRate = 0.01;

//   let effectiveRate = calculateIRR(guessRate, principal, calculatePayments, targetNPV, epsilon);

//   let x = Math.pow(1 + monthlyRate, calculatePayments);

//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0 && !isNaN(effectiveRate) ) {

//     let totalPayment = monthly * calculatePayments;

//     let interestExpense = totalPayment - principal;

//     let overPayment = interestExpense;

//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;

//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;

//     let annuityInterestExpense = annuityTotalPayment - principal;

//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let onceCommissionAmount = onceCommissionPercentValue / 100 * principal;

//     let classicOverpayment = classicInterestExpense + onceCommissionAmount;

//     let annuityOverpayment = annuityInterestExpense + onceCommissionAmount;

//     classicMonthly.innerHTML = classicMonthlyPayment.toFixed(2);

//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);

//     classicOverpay.innerHTML = classicOverpayment.toFixed(2);

//     classicEffective.innerHTML = classicEffectiveRate.toFixed(2);

//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);

//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);

//     annuityOverpay.innerHTML = annuityOverpayment.toFixed(2);

//     annuityEffective.innerHTML = annuityEffectiveRate.toFixed(2);

//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`
//   }

//   else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }

//   let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//   let remainingBalance = principal;

//   let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//   classicTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {

//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });

//     let interestPayment = remainingBalance * monthlyRate;
//     let principalPayment = classicMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     remainingBalance -= principalPayment;

//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${classicMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${remainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     classicTableBody.innerHTML += row;
//   }

//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//   let annuityRemainingBalance = principal;

//   let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//   annuityTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {

//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });

//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     annuityRemainingBalance -= principalPayment;

//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${annuityMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${annuityRemainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     annuityTableBody.innerHTML += row;
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn')

// let annuityBtn = document.getElementById('annuity__table-btn')

// let annuityContainer = document.getElementById('annuity-table-container')

// let classicContainer = document.getElementById('classic-table-container')

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block'
//   annuityContainer.style.display = 'none'
// }

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block'
//   classicContainer.style.display = 'none'
// }

// const translations = {
//   en: {
//     "form_title": "Loan Calculator",
//     "amount_label": "Loan Amount (UAH):",
//     "interest_label": "Annual Interest Rate (%):",
//     "downpayment_label": "Down Payment %:",
//     "term_label": "Loan Term:",
//     "calculate_button": "Calculate",
//     "classic_tab": "Classic",
//     "annuity_tab": "Annuity",
//     "period": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance",
//     "calculation_type": "Calculation Type",
//     "monthly_payment": "Monthly Payment",
//     "interest_expense": "Interest Expenses",
//     "overpayment": "Overpayment",
//     "effective_rate": "Effective Rate",
//     "classic": "Classic",
//     "annuity": "Annuity",
//     "period_month": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance"
//   },

//   uk: {
//     "form_title": "Калькулятор кредитів",
//     "amount_label": "Сума кредиту (грн):",
//     "interest_label": "Річна процентна ставка (%):",
//     "downpayment_label": "Перший внесок %:",
//     "term_label": "Термін кредиту:",
//     "calculate_button": "Розрахувати",
//     "classic_tab": "Класика",
//     "annuity_tab": "Ануїтет",
//     "period": "Період (Місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення процентів",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу",
//     "calculation_type": "Тип розрахунку",
//     "monthly_payment": "Щомісячний платіж",
//     "interest_expense": "Витрати на відсотки",
//     "overpayment": "Переплата",
//     "effective_rate": "Ефективна ставка",
//     "classic": "Класика",
//     "annuity": "Ануїтет",
//     "period_month": "Період (місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення відсотків",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу"
//   },

//   ru: {
//     "form_title": "Кредитный калькулятор",
//     "amount_label": "Сумма кредита (грн):",
//     "interest_label": "Годовая процентная ставка (%):",
//     "downpayment_label": "Сумма аванса %:",
//     "term_label": "Срок кредита:",
//     "calculate_button": "Рассчитать",
//     "classic_tab": "Классика",
//     "annuity_tab": "Аннуитет",
//     "period": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности",
//     "calculation_type": "Тип расчёта",
//     "monthly_payment": "Ежемесячный платеж",
//     "interest_expense": "Процентные расходы по кредиту",
//     "overpayment": "Переплата",
//     "effective_rate": "Эффективная ставка",
//     "classic": "Классический",
//     "annuity": "Аннуитетный",
//     "period_month": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности"
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelect').value;
//   document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//   document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//   document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//   document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//   document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//   document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//   document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//   document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//   document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//   document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//   document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//   document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//   document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//   document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//   document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];

//   const updateTableHeaders = (tableId, headers) => {
//     const table = document.getElementById(tableId);
//     headers.forEach((header, index) => {
//       table.querySelectorAll('th')[index].textContent = translations[lang][header];
//     });
//   };

//   updateTableHeaders('classic-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//   updateTableHeaders('annuity-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
// }

// без Рассчитывания ЭПС
// let calcButton = document.getElementById('btn-result')

// calcButton.onclick = function() {

//   calculateLoan()

// }

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let result = document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let list = document.getElementById('list');

//   let classicMonthly = document.getElementById('classicMonthlyPayment')

//   let classicInterest = document.getElementById('classicInterestExpense')

//   let classicOverpay =  document.getElementById('classicOverpayment')

//   let classicEffective =  document.getElementById('classicEffectiveRate')

//   let annuityMonthly = document.getElementById('annuityMonthlyPayment')

//   let annuityInterest = document.getElementById('annuityInterestExpense')

//   let annuityOverpay = document.getElementById('annuityOverpayment')

//   let annuityEffective = document.getElementById('annuityEffectiveRate')

//   let interestValue = parseFloat(interest.value);

//   let amountValue = parseFloat(amount.value);

//   let downpaymentPercentValue = parseFloat(downpaymentPercent.value);

//   let listValue = parseFloat(list.value);

//   let principal = amountValue;

//   let downpayment = (downpaymentPercentValue / 100) * principal;

//   principal -= downpayment;

//   let nominalRate = interestValue / 100;

//   let monthlyRate = nominalRate / 12;

//   let calculatePayments = listValue;

//   let x = Math.pow(1 + monthlyRate, calculatePayments);

//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0) {

//     let totalPayment = monthly * calculatePayments;

//     let interestExpense = totalPayment - principal;

//     let overPayment = interestExpense;

//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;

//     let classicOverpayment = classicInterestExpense;

//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;

//     let annuityInterestExpense = annuityTotalPayment - principal;

//     let annuityOverpayment = annuityInterestExpense;

//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     classicMonthly.innerHTML = classicMonthlyPayment.toFixed(2);

//     classicInterest.innerHTML = classicInterestExpense.toFixed(2);

//     classicOverpay.innerHTML = classicOverpayment.toFixed(2);

//     classicEffective.innerHTML = classicEffectiveRate.toFixed(2);

//     annuityMonthly.innerHTML = annuityMonthlyPayment.toFixed(2);

//     annuityInterest.innerHTML = annuityInterestExpense.toFixed(2);

//     annuityOverpay.innerHTML = annuityOverpayment.toFixed(2);

//     annuityEffective.innerHTML = annuityEffectiveRate.toFixed(2);
//   }

//   else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }

//   let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//   let remainingBalance = principal;

//   let classicTableBody = document.getElementById('classic-loan-table').getElementsByTagName('tbody')[0];
//   classicTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {

//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });

//     let interestPayment = remainingBalance * monthlyRate;
//     let principalPayment = classicMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     remainingBalance -= principalPayment;

//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${classicMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${remainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     classicTableBody.innerHTML += row;
//   }

//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));
//   let annuityRemainingBalance = principal;

//   let annuityTableBody = document.getElementById('annuity-loan-table').getElementsByTagName('tbody')[0];
//   annuityTableBody.innerHTML = '';

//   for (let i = 1; i <= calculatePayments; i++) {

//     let currentDate = new Date();
//     currentDate.setMonth(currentDate.getMonth() + i - 1);
//     let monthName = currentDate.toLocaleString('default', { month: 'long' });

//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     let commissionPayment = 0;
//     annuityRemainingBalance -= principalPayment;

//     let row = `
//       <tr>
//         <td>${i} (${monthName})</td>
//         <td>${annuityMonthlyPayment.toFixed(2)}</td>
//         <td>${principalPayment.toFixed(2)}</td>
//         <td>${interestPayment.toFixed(2)}</td>
//         <td>${commissionPayment.toFixed(2)}</td>
//         <td>${annuityRemainingBalance.toFixed(2)}</td>
//       </tr>
//     `;
//     annuityTableBody.innerHTML += row;
//   }
// }

// let classicBtn = document.getElementById('classic__table-btn')

// let annuityBtn = document.getElementById('annuity__table-btn')

// let annuityContainer = document.getElementById('annuity-table-container')

// let classicContainer = document.getElementById('classic-table-container')

// classicBtn.onclick = function() {
//   classicContainer.style.display = 'block'
//   annuityContainer.style.display = 'none'
// }

// annuityBtn.onclick = function() {
//   annuityContainer.style.display = 'block'
//   classicContainer.style.display = 'none'
// }

// const translations = {
//   en: {
//     "form_title": "Loan Calculator",
//     "amount_label": "Loan Amount (UAH):",
//     "interest_label": "Annual Interest Rate (%):",
//     "downpayment_label": "Down Payment %:",
//     "term_label": "Loan Term:",
//     "calculate_button": "Calculate",
//     "classic_tab": "Classic",
//     "annuity_tab": "Annuity",
//     "period": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance",
//     "calculation_type": "Calculation Type",
//     "monthly_payment": "Monthly Payment",
//     "interest_expense": "Interest Expenses",
//     "overpayment": "Overpayment",
//     "effective_rate": "Effective Rate",
//     "classic": "Classic",
//     "annuity": "Annuity",
//     "period_month": "Period (Month)",
//     "monthly_payment": "Monthly Payment",
//     "principal_repayment": "Principal Repayment",
//     "interest_repayment": "Interest Repayment",
//     "commission_repayment": "Commission Repayment",
//     "remaining_balance": "Remaining Balance"
//   },

//   uk: {
//     "form_title": "Калькулятор кредитів",
//     "amount_label": "Сума кредиту (грн):",
//     "interest_label": "Річна процентна ставка (%):",
//     "downpayment_label": "Перший внесок %:",
//     "term_label": "Термін кредиту:",
//     "calculate_button": "Розрахувати",
//     "classic_tab": "Класика",
//     "annuity_tab": "Ануїтет",
//     "period": "Період (Місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення процентів",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу",
//     "calculation_type": "Тип розрахунку",
//     "monthly_payment": "Щомісячний платіж",
//     "interest_expense": "Витрати на відсотки",
//     "overpayment": "Переплата",
//     "effective_rate": "Ефективна ставка",
//     "classic": "Класика",
//     "annuity": "Ануїтет",
//     "period_month": "Період (місяць)",
//     "monthly_payment": "Щомісячний платіж",
//     "principal_repayment": "Погашення тіла кредиту",
//     "interest_repayment": "Погашення відсотків",
//     "commission_repayment": "Погашення комісій",
//     "remaining_balance": "Залишок боргу"
//   },

//   ru: {
//     "form_title": "Кредитный калькулятор",
//     "amount_label": "Сумма кредита (грн):",
//     "interest_label": "Годовая процентная ставка (%):",
//     "downpayment_label": "Сумма аванса %:",
//     "term_label": "Срок кредита:",
//     "calculate_button": "Рассчитать",
//     "classic_tab": "Классика",
//     "annuity_tab": "Аннуитет",
//     "period": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности",
//     "calculation_type": "Тип расчёта",
//     "monthly_payment": "Ежемесячный платеж",
//     "interest_expense": "Процентные расходы по кредиту",
//     "overpayment": "Переплата",
//     "effective_rate": "Эффективная ставка",
//     "classic": "Классический",
//     "annuity": "Аннуитетный",
//     "period_month": "Период (месяц)",
//     "monthly_payment": "Ежемесячный платеж",
//     "principal_repayment": "Погашение тела кредита",
//     "interest_repayment": "Погашение процентов",
//     "commission_repayment": "Погашение комиссий",
//     "remaining_balance": "Остаток задолженности"
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelect').value;
//   document.querySelector('.form__title').textContent = translations[lang]['form_title'];
//   document.querySelector('label[for="amount"]').textContent = translations[lang]['amount_label'];
//   document.querySelector('label[for="interest"]').textContent = translations[lang]['interest_label'];
//   document.querySelector('label[for="downpayment-percent"]').textContent = translations[lang]['downpayment_label'];
//   document.querySelector('label[for="list"]').textContent = translations[lang]['term_label'];
//   document.getElementById('btn-result').textContent = translations[lang]['calculate_button'];
//   document.getElementById('classic__table-btn').textContent = translations[lang]['classic_tab'];
//   document.getElementById('annuity__table-btn').textContent = translations[lang]['annuity_tab'];
//   document.querySelectorAll('#loan-table th')[0].textContent = translations[lang]['calculation_type'];
//   document.querySelectorAll('#loan-table th')[1].textContent = translations[lang]['monthly_payment'];
//   document.querySelectorAll('#loan-table th')[2].textContent = translations[lang]['interest_expense'];
//   document.querySelectorAll('#loan-table th')[3].textContent = translations[lang]['overpayment'];
//   document.querySelectorAll('#loan-table th')[4].textContent = translations[lang]['effective_rate'];
//   document.querySelectorAll('#loan-table tbody tr')[0].cells[0].textContent = translations[lang]['classic'];
//   document.querySelectorAll('#loan-table tbody tr')[1].cells[0].textContent = translations[lang]['annuity'];

//   const updateTableHeaders = (tableId, headers) => {
//     const table = document.getElementById(tableId);
//     headers.forEach((header, index) => {
//       table.querySelectorAll('th')[index].textContent = translations[lang][header];
//     });
//   };

//   updateTableHeaders('classic-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
//   updateTableHeaders('annuity-loan-table', ['period_month', 'monthly_payment', 'principal_repayment', 'interest_repayment', 'commission_repayment', 'remaining_balance']);
// }

//  let calcButton = document.getElementById('btn-result');

//  calcButton.onclick = function() {
//      calculateLoan();
//  };

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let result = document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let list = document.getElementById('list');

//   let tableContainer = document.getElementById('table-container')

//   let interestValue = parseFloat(interest.value);

//   let amountValue = parseFloat(amount.value);

//   let downpaymentPercentValue = parseFloat(downpaymentPercent.value);

//   let listValue = parseFloat(list.value);

//   let principal = amountValue;

//   let downpayment = (downpaymentPercentValue / 100) * principal;

//   principal -= downpayment;

//   let nominalRate = interestValue / 100;

//   let monthlyRate = nominalRate / 12;

//   let calculatePayments = listValue;

//   let x = Math.pow(1 + monthlyRate, calculatePayments);

//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   if (!isNaN(monthly) && monthly !== Infinity && monthly > 0) {

//     let totalPayment = monthly * calculatePayments;

//     let interestExpense = totalPayment - principal;

//     let overPayment = interestExpense;

//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;

//     let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//     let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;

//     let classicOverpayment = classicInterestExpense;

//     let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//     let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;

//     let annuityInterestExpense = annuityTotalPayment - principal;

//     let annuityOverpayment = annuityInterestExpense;

//     let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     let table = `
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Тип расчёта</th>
//             <th>Ежемесячный платеж</th>
//             <th>Процентные расходы по кредиту</th>
//             <th>Переплата по кредиту</th>
//             <th>Эффективная ставка</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Классический</td>
//             <td>${classicMonthlyPayment.toFixed(2)}</td>
//             <td>${classicInterestExpense.toFixed(2)}</td>
//             <td>${classicOverpayment.toFixed(2)}</td>
//             <td>${classicEffectiveRate.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <td>Аннуитетный</td>
//             <td>${annuityMonthlyPayment.toFixed(2)}</td>
//             <td>${annuityInterestExpense.toFixed(2)}</td>
//             <td>${annuityOverpayment.toFixed(2)}</td>
//             <td>${annuityEffectiveRate.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//     `;

//     tableContainer.innerHTML = table;
//   } else {
//     result.innerHTML = 'Данные указаны неверно или отсутствуют';
//   }
// }

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let result =  document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let list = document.getElementById('list');

//   let interestValue = interest.value

//   let amountValue = amount.value

//   let downpaymentPercentValue = downpaymentPercent.value

//   let listValue = list.value;

//   let principal = parseFloat(amountValue);

//   let downpayment = (parseFloat(downpaymentPercentValue) / 100) * principal;

//   principal -= downpayment;

//   let nominalRate = parseFloat(interestValue) / 100;

//   let monthlyRate = nominalRate / 12;

//   let calculatePayments = parseFloat(listValue);

//   let x = Math.pow(1 + monthlyRate, calculatePayments);

//   let monthly = (principal * x * monthlyRate) / (x - 1);

//   var annualInterestRate = parseFloat(interest) / 100;
//   var monthlyInterestRate = annualInterestRate / 12;

//   if (!isNaN(monthly) && (monthly != Infinity) && (monthly > 0)) {

//     let totalPayment = monthly * calculatePayments;

//     let interestExpense = totalPayment - principal;

//     let overPayment = interestExpense;

//     let effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту: ${overPayment.toFixed(2)} грн.<br> Эффективная процентная ставка: ${effectiveRate.toFixed(2)}%`;

//   } else {

//     result.innerHTML = 'Данные указаны неверно или отсутствуют';

//   }

//   let classicMonthlyPayment = (principal / calculatePayments) + (principal * monthlyRate);

//   let classicInterestExpense = classicMonthlyPayment * calculatePayments - principal;

//   let classicOverpayment = classicInterestExpense;

//   let classicEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//   let annuityMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -calculatePayments));

//   let annuityTotalPayment = annuityMonthlyPayment * calculatePayments;

//   let annuityInterestExpense = annuityTotalPayment - principal;

//   let annuityOverpayment = annuityInterestExpense;

//   let annuityEffectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

//   let table = `
//     <table border="1">
//       <thead>
//         <tr>
//           <th>Тип расчёта</th>
//           <th>Ежемесячный платеж</th>
//           <th>Процентные расходы по кредиту</th>
//           <th>Переплата по кредиту</th>
//           <th>Эффективная ставка</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>Классический</td>
//           <td>${classicMonthlyPayment.toFixed(2)}</td>
//           <td>${classicInterestExpense.toFixed(2)}</td>
//           <td>${classicOverpayment.toFixed(2)}</td>
//           <td>${classicEffectiveRate.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td>Аннуитетный</td>
//           <td>${annuityMonthlyPayment.toFixed(2)}</td>
//           <td>${annuityInterestExpense.toFixed(2)}</td>
//           <td>${annuityOverpayment.toFixed(2)}</td>
//           <td>${annuityEffectiveRate.toFixed(2)}</td>
//         </tr>
//       </tbody>
//     </table>
//   `;

//     result.innerHTML += table;

//    }

// let calculateButton = document.getElementById('calculateButton')

// calculateButton.onclick = function() {
//   calculateLoan()
// }

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let result =  document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let list = document.getElementById('list');

//   let interestValue = interest.value

//   let amountValue = amount.value

//   let downpaymentPercentValue = downpaymentPercent.value

//   let listValue = list.value;

//   let principal = parseFloat(amountValue);

//   let downpayment = (parseFloat(downpaymentPercentValue) / 100) * principal;

//   principal -= downpayment;

//   let calculateInterest = parseFloat(interestValue) / 100 / 12;

//   let calculatePayments = parseFloat(listValue);

//   let x = Math.pow(1 + calculateInterest, calculatePayments);

//   let monthly = (principal * x * calculateInterest) / (x - 1);

//   if (!isNaN(monthly) && (monthly != Infinity) && (monthly > 0)) {

//     let totalPayment = monthly * calculatePayments;

//     let interestExpense = totalPayment - principal;

//     let overPayment = interestExpense;

//     result.innerHTML = `Ежемесячный платёж составит: ${monthly.toFixed(2)} грн. <br> Общие процентные расходы по кредиту составят: ${interestExpense.toFixed(2)} грн. <br> Переплата по кредиту  ${overPayment.toFixed(2)} грн.`;

//   } else {

//     result.innerHTML = 'Данные указаны неверно или отсутствуют';

//   }
// }

// let calculateButton = document.getElementById('calculateButton')

// calculateButton.onclick = function() {
//   calculateLoan()
// }

// function calculateLoan() {

//   let amount = document.getElementById('amount');

//   let interest = document.getElementById('interest');

//   let years = document.getElementById('years');

//   let result =  document.getElementById('result');

//   let downpaymentPercent = document.getElementById('downpayment-percent');

//   let yearsValue = years.value

//   let interestValue = interest.value

//   let amountValue = amount.value

//   let downpaymentPercentValue = downpaymentPercent.value

//   let principal = parseFloat(amountValue);

//   let downpayment = (parseFloat(downpaymentPercentValue) / 100) * principal;

//   principal -= downpayment;

//   let calculateInterest = parseFloat(interestValue) / 100 / 12;

//   let calculatePayments = parseFloat(yearsValue) * 12;

//   let x = Math.pow(1 + calculateInterest, calculatePayments);

//   let monthly = (principal * x * calculateInterest) / (x - 1);

//   if (!isNaN(monthly) && (monthly != Infinity) && (monthly > 0)) {

//     result.innerHTML = `Ежемесячный платёж: ${monthly.toFixed(2)} грн.`;

//   } else {

//     result.innerHTML = 'Данные отсутствуют';

//   }
// }
