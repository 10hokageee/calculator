// let calcButton = document.getElementById("btn-result");
// let classicBtn = document.getElementById("classic__table-btn");
// let annuityBtn = document.getElementById("annuity__table-btn");
// let annuityContainer = document.getElementById("annuity-table-container");
// let classicContainer = document.getElementById("classic-table-container");
// let clearButton = document.getElementById("btn-clear");

// calcButton.onclick = function (event) {
//   event.preventDefault();
//   const results = calculateLoan();
//   if (results) {
//     document.getElementById("btn-download").onclick = () =>
//       exportFullReport(results);
//   }
// };

// classicBtn.onclick = function () {
//   classicContainer.style.display = "block";
//   annuityContainer.style.display = "none";
// };

// annuityBtn.onclick = function () {
//   annuityContainer.style.display = "block";
//   classicContainer.style.display = "none";
// };

// clearButton.onclick = clearFields;

// function calculateIRR(cashFlows) {
//   const MAX_ITER = 100;
//   const PRECISION = 1e-7;
//   let guess = 0.05;

//   for (let iter = 0; iter < MAX_ITER; iter++) {
//     let npv = 0;
//     let dnpv = 0;
//     for (let t = 0; t < cashFlows.length; t++) {
//       const denom = Math.pow(1 + guess, t);
//       npv += cashFlows[t] / denom;
//       dnpv -= (t * cashFlows[t]) / (denom * (1 + guess));
//     }
//     if (Math.abs(npv) < PRECISION) return guess;
//     if (dnpv === 0) break;
//     guess -= npv / dnpv;
//   }
//   return NaN;
// }

// function makeMonthLabels(n) {
//   const start = new Date();
//   const startNormalized = new Date(start.getFullYear(), start.getMonth(), 1);

//   const labels = [];
//   for (let i = 0; i < n; i++) {
//     const d = new Date(startNormalized);
//     d.setMonth(startNormalized.getMonth() + i);
//     const monthName = d.toLocaleString("uk-UA", { month: "long" });
//     const year = d.getFullYear();
//     labels.push({ date: d, label: `${monthName} ${year}` });
//   }
//   return labels;
// }

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById("amount").value);
//   let interest = parseFloat(document.getElementById("interest").value) || 0;
//   let downpaymentPercent =
//     parseFloat(document.getElementById("downpayment-percent").value) || 0;
//   let list = parseFloat(document.getElementById("list").value);
//   let notaryFee = parseFloat(document.getElementById("notary").value) || 0;
//   let insuranceFee =
//     parseFloat(document.getElementById("insurance").value) || 0;
//   let commissionFee =
//     parseFloat(document.getElementById("commission").value) || 0;
//   let totalOneTimeFees = notaryFee + insuranceFee + commissionFee;

//   let result = document.getElementById("result");
//   let infoBlock = document.querySelector(".form__result");

//   if (isNaN(amount) || amount <= 0 || isNaN(list) || list <= 0) {
//     infoBlock.style.display = "block";
//     infoBlock.innerHTML = "Дані вказані неправильно або відсутні";
//     return;
//   }
//   infoBlock.style.display = "none";

//   let principal = amount;
//   let downpayment = (downpaymentPercent / 100) * principal;
//   principal -= downpayment;

//   let monthlyRate = interest / 100 / 12;

//   let classicInterestExpense = 0;
//   let remainingBalanceClassic = principal;
//   let classicPayments = [];
//   let firstClassicPayment = 0;
//   let lastClassicPayment = 0;

//   for (let i = 0; i < list; i++) {
//     let interestPayment = remainingBalanceClassic * monthlyRate;
//     let principalPayment = principal / list;
//     let monthlyPayment = principalPayment + interestPayment;

//     classicPayments.push({
//       payment: monthlyPayment,
//       principal: principalPayment,
//       interest: interestPayment,
//       remaining: Math.max(remainingBalanceClassic - principalPayment, 0),
//     });

//     classicInterestExpense += interestPayment;
//     remainingBalanceClassic -= principalPayment;
//     if (i === 0) firstClassicPayment = monthlyPayment;
//     if (i === list - 1) lastClassicPayment = monthlyPayment;
//   }

//   let classicOverPayment = classicInterestExpense + totalOneTimeFees;
//   let classicTotalCost = principal + classicInterestExpense + totalOneTimeFees;

//   let netProceeds = principal - totalOneTimeFees;
//   let classicCashFlows = [
//     netProceeds,
//     ...classicPayments.map((p) => -p.payment),
//   ];
//   let classicMonthlyIRR = calculateIRR(classicCashFlows);
//   let classicEffectiveRateVal = isNaN(classicMonthlyIRR)
//     ? 0
//     : Math.pow(1 + classicMonthlyIRR, 12) - 1;

//   let annuityMonthlyPayment =
//     monthlyRate === 0
//       ? principal / list
//       : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -list));

//   let annuityTotalPayment = annuityMonthlyPayment * list;
//   let annuityInterestExpense = annuityTotalPayment - principal;
//   let annuityOverPayment = annuityInterestExpense + totalOneTimeFees;
//   let annuityTotalCost = annuityTotalPayment + totalOneTimeFees;

//   let annuityPayments = [];
//   let annuityRemainingBalance = principal;
//   for (let i = 0; i < list; i++) {
//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     annuityRemainingBalance -= principalPayment;
//     annuityPayments.push({
//       payment: annuityMonthlyPayment,
//       principal: principalPayment,
//       interest: interestPayment,
//       remaining: Math.max(annuityRemainingBalance, 0),
//     });
//   }

//   let annuityCashFlows = [
//     netProceeds,
//     ...annuityPayments.map((p) => -p.payment),
//   ];
//   let annuityMonthlyIRR = calculateIRR(annuityCashFlows);
//   let annuityEffectiveRateVal = isNaN(annuityMonthlyIRR)
//     ? 0
//     : Math.pow(1 + annuityMonthlyIRR, 12) - 1;

//   result.innerHTML =
//     `Щомісячний платіж (класика): ${firstClassicPayment.toFixed(2)} грн.` +
//     `<br>Процентні витрати (класика): ${classicInterestExpense.toFixed(
//       2
//     )} грн.` +
//     `<br>Загальні витрати (класика): ${classicOverPayment.toFixed(2)} грн.` +
//     `<br>Реальна річна ставка (класика): ${(
//       classicEffectiveRateVal * 100
//     ).toFixed(6)}%` +
//     `<br><br>` +
//     `Щомісячний платіж (аннуїтет): ${annuityMonthlyPayment.toFixed(2)} грн.` +
//     `<br>Процентні витрати (аннуїтет): ${annuityInterestExpense.toFixed(
//       2
//     )} грн.` +
//     `<br>Загальні витрати (аннуїтет): ${annuityOverPayment.toFixed(2)} грн.` +
//     `<br>Реальна річна ставка (аннуїтет): ${(
//       annuityEffectiveRateVal * 100
//     ).toFixed(6)}%`;

//   document.getElementById(
//     "classicMonthlyPayment"
//   ).innerHTML = `${firstClassicPayment.toFixed(
//     2
//   )} - ${lastClassicPayment.toFixed(2)}`;
//   document.getElementById("classicInterestExpense").innerHTML =
//     classicInterestExpense.toFixed(2);
//   document.getElementById("classicOverpayment").innerHTML =
//     classicOverPayment.toFixed(2);
//   document.getElementById("classicTotalCost").innerHTML =
//     classicTotalCost.toFixed(2);
//   document.getElementById("classicEffectiveRate").innerHTML = (
//     classicEffectiveRateVal * 100
//   ).toFixed(6);

//   document.getElementById("annuityMonthlyPayment").innerHTML =
//     annuityMonthlyPayment.toFixed(2);
//   document.getElementById("annuityInterestExpense").innerHTML =
//     annuityInterestExpense.toFixed(2);
//   document.getElementById("annuityOverpayment").innerHTML =
//     annuityOverPayment.toFixed(2);
//   document.getElementById("annuityTotalCost").innerHTML =
//     annuityTotalCost.toFixed(2);
//   document.getElementById("annuityEffectiveRate").innerHTML = (
//     annuityEffectiveRateVal * 100
//   ).toFixed(6);

//   const monthLabels = makeMonthLabels(list);
//   buildAmortizationTable("classic-loan-table", classicPayments, monthLabels);
//   buildAmortizationTable("annuity-loan-table", annuityPayments, monthLabels);

//   return {
//     amount,
//     downpayment,
//     principal,
//     list,
//     notaryFee,
//     insuranceFee,
//     commissionFee,
//     classicPayments,
//     classicTotalInterest: classicInterestExpense,
//     classicOverPayment,
//     classicTotalCost,
//     classicEffectiveRate: classicEffectiveRateVal,
//     annuityPayments,
//     annuityTotalInterest: annuityInterestExpense,
//     annuityOverPayment,
//     annuityTotalCost,
//     annuityEffectiveRate: annuityEffectiveRateVal,
//     monthLabels,
//   };
// }

// function buildAmortizationTable(tableId, payments, monthLabels) {
//   const tableBody = document
//     .getElementById(tableId)
//     .getElementsByTagName("tbody")[0];
//   tableBody.innerHTML = "";

//   let totalPrincipal = 0;
//   let totalInterest = 0;

//   payments.forEach((p, i) => {
//     totalPrincipal += p.principal;
//     totalInterest += p.interest;

//     const row = `<tr class="loan-table__name-list">
//         <td class="loan-table__item">${i + 1} (${monthLabels[i].label})</td>
//         <td class="loan-table__item">${p.payment.toFixed(2)}</td>
//         <td class="loan-table__item">${p.principal.toFixed(2)}</td>
//         <td class="loan-table__item">${p.interest.toFixed(2)}</td>
//         <td class="loan-table__item">${p.remaining.toFixed(2)}</td>
//       </tr>`;
//     tableBody.insertAdjacentHTML("beforeend", row);
//   });

//   const totalRow = `<tr class="loan-table__totals">
//       <td class="loan-table__item"><strong>СУМА:</strong></td>
//       <td class="loan-table__item"></td>
//       <td class="loan-table__item"><strong>${totalPrincipal.toFixed(
//         2
//       )}</strong></td>
//       <td class="loan-table__item"><strong>${totalInterest.toFixed(
//         2
//       )}</strong></td>
//       <td class="loan-table__item"></td>
//     </tr>`;
//   tableBody.insertAdjacentHTML("beforeend", totalRow);
// }

// function clearFields() {
//   document.querySelectorAll("input").forEach((input) => (input.value = ""));
//   document.getElementById("list").value = "12";
//   document.getElementById("result").innerHTML = "";

//   [
//     "classicMonthlyPayment",
//     "classicInterestExpense",
//     "classicOverpayment",
//     "classicEffectiveRate",
//     "classicTotalCost",
//     "annuityMonthlyPayment",
//     "annuityInterestExpense",
//     "annuityOverpayment",
//     "annuityEffectiveRate",
//     "annuityTotalCost",
//   ].forEach((id) => (document.getElementById(id).innerHTML = ""));

//   let infoBlock = document.querySelector(".form__result");
//   infoBlock.style.display = "none";
//   infoBlock.innerHTML = "";

//   clearTableRows("classic-loan-table");
//   clearTableRows("annuity-loan-table");
// }

// function clearTableRows(tableId) {
//   document.getElementById(tableId).getElementsByTagName("tbody")[0].innerHTML =
//     "";
// }

// function exportFullReport(data) {
//   let wb = XLSX.utils.book_new();

//   function setCellStyle(ws, cellRef, style) {
//     if (!ws[cellRef]) ws[cellRef] = {};
//     if (!ws[cellRef].s) ws[cellRef].s = {};
//     Object.assign(ws[cellRef].s, style);
//   }

//   const BOLD_STYLE = { font: { bold: true } };
//   const BORDER_STYLE = {
//     top: { style: "thin" },
//     bottom: { style: "thin" },
//     left: { style: "thin" },
//     right: { style: "thin" },
//   };

//   const HEADER_STYLE = {
//     font: { bold: true },
//     alignment: { horizontal: "center", vertical: "center", wrapText: true },
//     border: BORDER_STYLE,
//   };

//   const TOTAL_STYLE = { font: { bold: true }, border: BORDER_STYLE };
//   const DATA_STYLE = { border: BORDER_STYLE };

//   const scheduleDates = data.monthLabels.map((m) => m.date);

//   let classicRows = [];
//   classicRows.push([
//     "",
//     "Таблиця обчислення загальної вартості кредиту для споживача",
//   ]);
//   classicRows.push([
//     "№ з/п",
//     "Кількість днів у розрахунковому періоді",
//     "Сума видачі кредиту / розрахункова дата платежу",
//     "Чиста сума кредиту / загальний кредит",
//     "Сума платежу за період, грн",
//     "Проценти",
//     "Види платежів за додаткові та супутні послуги",
//     "Реальна річна ставка, %",
//     "Загальна вартість кредиту, грн",
//   ]);
//   classicRows.push([
//     "",
//     "",
//     "",
//     "",
//     "",
//     "Сума за користування кредитом",
//     "Сума за обслуговування заборгованості",
//     "Кредитодавця",
//     "",
//     "Кредитного посередника",
//     "",
//     "Третіх осіб",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);
//   classicRows.push([
//     "№",
//     "К-ть днів",
//     "Дата платежу",
//     "Сума кредиту",
//     "Сума платежу",
//     "Проценти",
//     "",
//     "За обслуговування",
//     "Комісія",
//     "Інші послуги",
//     "Комісія",
//     "Інший збір",
//     "Нотаріус",
//     "Страхування",
//     "Оцінювач",
//     "Інші",
//     "Реальна річна ставка",
//     "Загальна вартість",
//   ]);

//   classicRows.push([
//     1,
//     "",
//     new Date(),
//     data.principal,
//     "",
//     "",
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     data.classicEffectiveRate * 100,
//     data.classicTotalCost,
//   ]);

//   data.classicPayments.forEach((p, i) => {
//     const paymentDate = scheduleDates[i];
//     classicRows.push([
//       i + 2,
//       "",
//       paymentDate,
//       p.remaining,
//       p.payment,
//       p.interest,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ]);
//   });

//   classicRows.push([
//     "СУМА",
//     "",
//     "",
//     data.principal,
//     "",
//     data.classicTotalInterest,
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     "",
//     data.classicTotalCost,
//   ]);

//   let wsClassic = XLSX.utils.aoa_to_sheet(classicRows);

//   const headerRows = [0, 1, 2, 3];
//   headerRows.forEach((R) => {
//     const range = XLSX.utils.decode_range(wsClassic["!ref"]);
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//       setCellStyle(wsClassic, cellRef, HEADER_STYLE);
//     }
//   });

//   const dataStartRow = 4;
//   const totalRowClassic = classicRows.length - 1;
//   {
//     const range = XLSX.utils.decode_range(wsClassic["!ref"]);
//     for (let R = dataStartRow; R < classicRows.length; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//         if (wsClassic[cellRef]) {
//           setCellStyle(
//             wsClassic,
//             cellRef,
//             R === totalRowClassic ? TOTAL_STYLE : DATA_STYLE
//           );
//         }
//       }
//     }

//     for (let R = dataStartRow; R < totalRowClassic; ++R) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: 2 });
//       if (wsClassic[cellRef]) {
//         wsClassic[cellRef].t = "n";
//         wsClassic[cellRef].z = "yyyy-mm-dd";
//       }
//     }
//   }

//   wsClassic["!merges"] = [
//     { s: { r: 0, c: 1 }, e: { r: 0, c: 17 } },
//     { s: { r: 1, c: 5 }, e: { r: 1, c: 6 } },
//     { s: { r: 1, c: 7 }, e: { r: 1, c: 15 } },
//     { s: { r: 1, c: 16 }, e: { r: 2, c: 16 } },
//     { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
//     { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
//     { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
//     { s: { r: 2, c: 12 }, e: { r: 2, c: 15 } },
//   ];
//   XLSX.utils.book_append_sheet(wb, wsClassic, "Класика");

//   let annuityRows = [];
//   annuityRows.push([
//     "",
//     "Таблиця обчислення загальної вартості кредиту для споживача",
//   ]);
//   annuityRows.push([
//     "№ з/п",
//     "Кількість днів у розрахунковому періоді",
//     "Сума видачі кредиту / розрахункова дата платежу",
//     "Чиста сума кредиту / загальний кредит",
//     "Сума платежу за період, грн",
//     "Проценти",
//     "Види платежів за додаткові та супутні послуги",
//     "Реальна річна ставка, %",
//     "Загальна вартість кредиту, грн",
//   ]);
//   annuityRows.push([
//     "",
//     "",
//     "",
//     "",
//     "",
//     "Сума за користування кредитом",
//     "Сума за обслуговування заборгованості",
//     "Кредитодавця",
//     "",
//     "Кредитного посередника",
//     "",
//     "Третіх осіб",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);
//   annuityRows.push([
//     "№",
//     "К-ть днів",
//     "Дата платежу",
//     "Сума кредиту",
//     "Сума платежу",
//     "Проценти",
//     "",
//     "За обслуговування",
//     "Комісія",
//     "Інші послуги",
//     "Комісія",
//     "Інший збір",
//     "Нотаріус",
//     "Страхування",
//     "Оцінювач",
//     "Інші",
//     "Реальна річна ставка",
//     "Загальна вартість",
//   ]);

//   annuityRows.push([
//     1,
//     "",
//     new Date(),
//     data.principal,
//     "",
//     "",
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     data.annuityEffectiveRate * 100,
//     data.annuityTotalCost,
//   ]);

//   data.annuityPayments.forEach((p, i) => {
//     const paymentDate = scheduleDates[i];
//     annuityRows.push([
//       i + 2,
//       "",
//       paymentDate,
//       p.remaining,
//       p.payment,
//       p.interest,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ]);
//   });

//   annuityRows.push([
//     "СУМА",
//     "",
//     "",
//     data.principal,
//     "",
//     data.annuityTotalInterest,
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     "",
//     data.annuityTotalCost,
//   ]);

//   let wsAnnuity = XLSX.utils.aoa_to_sheet(annuityRows);

//   [0, 1, 2, 3].forEach((R) => {
//     const range = XLSX.utils.decode_range(wsAnnuity["!ref"]);
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//       setCellStyle(wsAnnuity, cellRef, HEADER_STYLE);
//     }
//   });

//   {
//     const range = XLSX.utils.decode_range(wsAnnuity["!ref"]);
//     const dataStartRowA = 4;
//     const totalRowA = annuityRows.length - 1;

//     for (let R = dataStartRowA; R < annuityRows.length; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//         if (wsAnnuity[cellRef]) {
//           setCellStyle(
//             wsAnnuity,
//             cellRef,
//             R === totalRowA ? TOTAL_STYLE : DATA_STYLE
//           );
//         }
//       }
//     }
//     for (let R = dataStartRowA; R < totalRowA; ++R) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: 2 });
//       if (wsAnnuity[cellRef]) {
//         wsAnnuity[cellRef].t = "n";
//         wsAnnuity[cellRef].z = "yyyy-mm-dd";
//       }
//     }
//   }

//   wsAnnuity["!merges"] = [
//     { s: { r: 0, c: 1 }, e: { r: 0, c: 17 } },
//     { s: { r: 1, c: 5 }, e: { r: 1, c: 6 } },
//     { s: { r: 1, c: 7 }, e: { r: 1, c: 15 } },
//     { s: { r: 1, c: 16 }, e: { r: 2, c: 16 } },
//     { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
//     { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
//     { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
//     { s: { r: 2, c: 12 }, e: { r: 2, c: 15 } },
//   ];

//   XLSX.utils.book_append_sheet(wb, wsAnnuity, "Ануїтет");

//   XLSX.writeFile(wb, "Приклад обчислення загальної вартості кредиту для споживача та реальної річної процентної ставки за договором про споживчий кредит.xlsx");
// }

//work version with current date 

// let calcButton = document.getElementById("btn-result");
// let classicBtn = document.getElementById("classic__table-btn");
// let annuityBtn = document.getElementById("annuity__table-btn");
// let annuityContainer = document.getElementById("annuity-table-container");
// let classicContainer = document.getElementById("classic-table-container");
// let clearButton = document.getElementById("btn-clear");

// calcButton.onclick = function (event) {
//   event.preventDefault();
//   const results = calculateLoan();
//   if (results) {
//     document.getElementById("btn-download").onclick = () =>
//       exportFullReport(results);
//   }
// };

// classicBtn.onclick = function () {
//   classicContainer.style.display = "block";
//   annuityContainer.style.display = "none";
// };

// annuityBtn.onclick = function () {
//   annuityContainer.style.display = "block";
//   classicContainer.style.display = "none";
// };

// clearButton.onclick = clearFields;

// function calculateIRR(cashFlows) {
//   const MAX_ITER = 100;
//   const PRECISION = 1e-7;
//   let guess = 0.05;

//   for (let iter = 0; iter < MAX_ITER; iter++) {
//     let npv = 0;
//     let dnpv = 0;
//     for (let t = 0; t < cashFlows.length; t++) {
//       const denom = Math.pow(1 + guess, t);
//       npv += cashFlows[t] / denom;
//       dnpv -= (t * cashFlows[t]) / (denom * (1 + guess));
//     }
//     if (Math.abs(npv) < PRECISION) return guess;
//     if (dnpv === 0) break;
//     guess -= npv / dnpv;
//   }
//   return NaN;
// }

// function makeMonthLabels(n) {
//   const start = new Date();
//   const labels = [];

//   for (let i = 0; i < n; i++) {
//     const d = new Date(start);
//     d.setMonth(start.getMonth() + i);

//     if (d.getDate() !== start.getDate()) {
//       d.setDate(0);
//     }

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     labels.push({
//       date: d,
//       label: `${day}.${month}.${year}`
//     });
//   }
//   return labels;
// }

// function calculateLoan() {
//   let amount = parseFloat(document.getElementById("amount").value);
//   let interest = parseFloat(document.getElementById("interest").value) || 0;
//   let downpaymentPercent =
//     parseFloat(document.getElementById("downpayment-percent").value) || 0;
//   let list = parseFloat(document.getElementById("list").value);
//   let notaryFee = parseFloat(document.getElementById("notary").value) || 0;
//   let insuranceFee =
//     parseFloat(document.getElementById("insurance").value) || 0;
//   let commissionFee =
//     parseFloat(document.getElementById("commission").value) || 0;
//   let totalOneTimeFees = notaryFee + insuranceFee + commissionFee;

//   let result = document.getElementById("result");
//   let infoBlock = document.querySelector(".form__result");

//   if (isNaN(amount) || amount <= 0 || isNaN(list) || list <= 0) {
//     infoBlock.style.display = "block";
//     infoBlock.innerHTML = "Дані вказані неправильно або відсутні";
//     return;
//   }
//   infoBlock.style.display = "none";

//   let principal = amount;
//   let downpayment = (downpaymentPercent / 100) * principal;
//   principal -= downpayment;

//   let monthlyRate = interest / 100 / 12;

//   let classicInterestExpense = 0;
//   let remainingBalanceClassic = principal;
//   let classicPayments = [];
//   let firstClassicPayment = 0;
//   let lastClassicPayment = 0;

//   for (let i = 0; i < list; i++) {
//     let interestPayment = remainingBalanceClassic * monthlyRate;
//     let principalPayment = principal / list;
//     let monthlyPayment = principalPayment + interestPayment;

//     classicPayments.push({
//       payment: monthlyPayment,
//       principal: principalPayment,
//       interest: interestPayment,
//       remaining: Math.max(remainingBalanceClassic - principalPayment, 0),
//     });

//     classicInterestExpense += interestPayment;
//     remainingBalanceClassic -= principalPayment;
//     if (i === 0) firstClassicPayment = monthlyPayment;
//     if (i === list - 1) lastClassicPayment = monthlyPayment;
//   }

//   let classicOverPayment = classicInterestExpense + totalOneTimeFees;
//   let classicTotalCost = principal + classicInterestExpense + totalOneTimeFees;

//   let netProceeds = principal - totalOneTimeFees;
//   let classicCashFlows = [
//     netProceeds,
//     ...classicPayments.map((p) => -p.payment),
//   ];
  
//   let classicMonthlyIRR = calculateIRR(classicCashFlows);
//   let classicEffectiveRateVal = isNaN(classicMonthlyIRR)
//     ? 0
//     : Math.pow(1 + classicMonthlyIRR, 12) - 1;

//   let annuityMonthlyPayment =
//     monthlyRate === 0
//       ? principal / list
//       : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -list));

//   let annuityTotalPayment = annuityMonthlyPayment * list;
//   let annuityInterestExpense = annuityTotalPayment - principal;
//   let annuityOverPayment = annuityInterestExpense + totalOneTimeFees;
//   let annuityTotalCost = annuityTotalPayment + totalOneTimeFees;

//   let annuityPayments = [];
//   let annuityRemainingBalance = principal;
//   for (let i = 0; i < list; i++) {
//     let interestPayment = annuityRemainingBalance * monthlyRate;
//     let principalPayment = annuityMonthlyPayment - interestPayment;
//     annuityRemainingBalance -= principalPayment;
//     annuityPayments.push({
//       payment: annuityMonthlyPayment,
//       principal: principalPayment,
//       interest: interestPayment,
//       remaining: Math.max(annuityRemainingBalance, 0),
//     });
//   }

//   let annuityCashFlows = [
//     netProceeds,
//     ...annuityPayments.map((p) => -p.payment),
//   ];
//   let annuityMonthlyIRR = calculateIRR(annuityCashFlows);
//   let annuityEffectiveRateVal = isNaN(annuityMonthlyIRR)
//     ? 0
//     : Math.pow(1 + annuityMonthlyIRR, 12) - 1;

//   result.innerHTML =
//     `Щомісячний платіж (класика): ${firstClassicPayment.toFixed(2)} грн.` +
//     `<br>Процентні витрати (класика): ${classicInterestExpense.toFixed(
//       2
//     )} грн.` +
//     `<br>Загальні витрати (класика): ${classicOverPayment.toFixed(2)} грн.` +
//     `<br>Реальна річна ставка (класика): ${(
//       classicEffectiveRateVal * 100
//     ).toFixed(6)}%` +
//     `<br><br>` +
//     `Щомісячний платіж (аннуїтет): ${annuityMonthlyPayment.toFixed(2)} грн.` +
//     `<br>Процентні витрати (аннуїтет): ${annuityInterestExpense.toFixed(
//       2
//     )} грн.` +
//     `<br>Загальні витрати (аннуїтет): ${annuityOverPayment.toFixed(2)} грн.` +
//     `<br>Реальна річна ставка (аннуїтет): ${(
//       annuityEffectiveRateVal * 100
//     ).toFixed(6)}%`;

//   document.getElementById(
//     "classicMonthlyPayment"
//   ).innerHTML = `${firstClassicPayment.toFixed(
//     2
//   )} - ${lastClassicPayment.toFixed(2)}`;
//   document.getElementById("classicInterestExpense").innerHTML =
//     classicInterestExpense.toFixed(2);
//   document.getElementById("classicOverpayment").innerHTML =
//     classicOverPayment.toFixed(2);
//   document.getElementById("classicTotalCost").innerHTML =
//     classicTotalCost.toFixed(2);
//   document.getElementById("classicEffectiveRate").innerHTML = (
//     classicEffectiveRateVal * 100
//   ).toFixed(6);

//   document.getElementById("annuityMonthlyPayment").innerHTML =
//     annuityMonthlyPayment.toFixed(2);
//   document.getElementById("annuityInterestExpense").innerHTML =
//     annuityInterestExpense.toFixed(2);
//   document.getElementById("annuityOverpayment").innerHTML =
//     annuityOverPayment.toFixed(2);
//   document.getElementById("annuityTotalCost").innerHTML =
//     annuityTotalCost.toFixed(2);
//   document.getElementById("annuityEffectiveRate").innerHTML = (
//     annuityEffectiveRateVal * 100
//   ).toFixed(6);

//   const monthLabels = makeMonthLabels(list);
//   buildAmortizationTable("classic-loan-table", classicPayments, monthLabels);
//   buildAmortizationTable("annuity-loan-table", annuityPayments, monthLabels);

//   return {
//     amount,
//     downpayment,
//     principal,
//     list,
//     notaryFee,
//     insuranceFee,
//     commissionFee,
//     classicPayments,
//     classicTotalInterest: classicInterestExpense,
//     classicOverPayment,
//     classicTotalCost,
//     classicEffectiveRate: classicEffectiveRateVal,
//     annuityPayments,
//     annuityTotalInterest: annuityInterestExpense,
//     annuityOverPayment,
//     annuityTotalCost,
//     annuityEffectiveRate: annuityEffectiveRateVal,
//     monthLabels,
//   };
// }

// function buildAmortizationTable(tableId, payments, monthLabels) {
//   const tableBody = document
//     .getElementById(tableId)
//     .getElementsByTagName("tbody")[0];
//   tableBody.innerHTML = "";

//   let totalPrincipal = 0;
//   let totalInterest = 0;

//   payments.forEach((p, i) => {
//     totalPrincipal += p.principal;
//     totalInterest += p.interest;

//     const row = `<tr class="loan-table__name-list">
//         <td class="loan-table__item">${i + 1} (${monthLabels[i].label})</td>
//         <td class="loan-table__item">${p.payment.toFixed(2)}</td>
//         <td class="loan-table__item">${p.principal.toFixed(2)}</td>
//         <td class="loan-table__item">${p.interest.toFixed(2)}</td>
//         <td class="loan-table__item">${p.remaining.toFixed(2)}</td>
//       </tr>`;
//     tableBody.insertAdjacentHTML("beforeend", row);
//   });

//   const totalRow = `<tr class="loan-table__totals">
//       <td class="loan-table__item"><strong>СУМА:</strong></td>
//       <td class="loan-table__item"></td>
//       <td class="loan-table__item"><strong>${totalPrincipal.toFixed(
//         2
//       )}</strong></td>
//       <td class="loan-table__item"><strong>${totalInterest.toFixed(
//         2
//       )}</strong></td>
//       <td class="loan-table__item"></td>
//     </tr>`;
//   tableBody.insertAdjacentHTML("beforeend", totalRow);
// }

// function clearFields() {
//   document.querySelectorAll("input").forEach((input) => (input.value = ""));
//   document.getElementById("list").value = "12";
//   document.getElementById("result").innerHTML = "";

//   [
//     "classicMonthlyPayment",
//     "classicInterestExpense",
//     "classicOverpayment",
//     "classicEffectiveRate",
//     "classicTotalCost",
//     "annuityMonthlyPayment",
//     "annuityInterestExpense",
//     "annuityOverpayment",
//     "annuityEffectiveRate",
//     "annuityTotalCost",
//   ].forEach((id) => (document.getElementById(id).innerHTML = ""));

//   let infoBlock = document.querySelector(".form__result");
//   infoBlock.style.display = "none";
//   infoBlock.innerHTML = "";

//   clearTableRows("classic-loan-table");
//   clearTableRows("annuity-loan-table");
// }

// function clearTableRows(tableId) {
//   document.getElementById(tableId).getElementsByTagName("tbody")[0].innerHTML =
//     "";
// }

// function exportFullReport(data) {
//   let wb = XLSX.utils.book_new();

//   function setCellStyle(ws, cellRef, style) {
//     if (!ws[cellRef]) ws[cellRef] = {};
//     if (!ws[cellRef].s) ws[cellRef].s = {};
//     Object.assign(ws[cellRef].s, style);
//   }

//   const BOLD_STYLE = { font: { bold: true } };
//   const BORDER_STYLE = {
//     top: { style: "thin" },
//     bottom: { style: "thin" },
//     left: { style: "thin" },
//     right: { style: "thin" },
//   };
//   const HEADER_STYLE = {
//     font: { bold: true },
//     alignment: { horizontal: "center", vertical: "center", wrapText: true },
//     border: BORDER_STYLE,
//   };
//   const TOTAL_STYLE = { font: { bold: true }, border: BORDER_STYLE };
//   const DATA_STYLE = { border: BORDER_STYLE };

//   const scheduleDates = data.monthLabels.map((m) => m.date);

//   let classicRows = [];
//   classicRows.push([
//     "",
//     "Таблиця обчислення загальної вартості кредиту для споживача",
//   ]);
//   classicRows.push([
//     "№ з/п",
//     "Кількість днів у розрахунковому періоді",
//     "Сума видачі кредиту / розрахункова дата платежу",
//     "Чиста сума кредиту / загальний кредит",
//     "Сума платежу за період, грн",
//     "Проценти",
//     "Види платежів за додаткові та супутні послуги",
//     "Реальна річна ставка, %",
//     "Загальна вартість кредиту, грн",
//   ]);
//   classicRows.push([
//     "",
//     "",
//     "",
//     "",
//     "",
//     "Сума за користування кредитом",
//     "Сума за обслуговування заборгованості",
//     "Кредитодавця",
//     "",
//     "Кредитного посередника",
//     "",
//     "Третіх осіб",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);
//   classicRows.push([
//     "№",
//     "К-ть днів",
//     "Дата платежу",
//     "Сума кредиту",
//     "Сума платежу",
//     "Проценти",
//     "",
//     "За обслуговування",
//     "Комісія",
//     "Інші послуги",
//     "Комісія",
//     "Інший збір",
//     "Нотаріус",
//     "Страхування",
//     "Оцінювач",
//     "Інші",
//     "Реальна річна ставка",
//     "Загальна вартість",
//   ]);

//   classicRows.push([
//     1,
//     "",
//     new Date(),
//     data.principal,
//     "",
//     "",
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     data.classicEffectiveRate * 100,
//     data.classicTotalCost,
//   ]);

//   data.classicPayments.forEach((p, i) => {
//     const paymentDate = scheduleDates[i];
//     classicRows.push([
//       i + 2,
//       "",
//       paymentDate,
//       p.remaining,
//       p.payment,
//       p.interest,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ]);
//   });

//   classicRows.push([
//     "СУМА",
//     "",
//     "",
//     data.principal,
//     "",
//     data.classicTotalInterest,
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     "",
//     data.classicTotalCost,
//   ]);

//   let wsClassic = XLSX.utils.aoa_to_sheet(classicRows);

//   const headerRows = [0, 1, 2, 3];
//   headerRows.forEach((R) => {
//     const range = XLSX.utils.decode_range(wsClassic["!ref"]);
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//       setCellStyle(wsClassic, cellRef, HEADER_STYLE);
//     }
//   });

//   const dataStartRow = 4;
//   const totalRowClassic = classicRows.length - 1;
//   {
//     const range = XLSX.utils.decode_range(wsClassic["!ref"]);
//     for (let R = dataStartRow; R < classicRows.length; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//         if (wsClassic[cellRef]) {
//           setCellStyle(
//             wsClassic,
//             cellRef,
//             R === totalRowClassic ? TOTAL_STYLE : DATA_STYLE
//           );
//         }
//       }
//     }

//     for (let R = dataStartRow; R < totalRowClassic; ++R) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: 2 });
//       if (wsClassic[cellRef]) {
//         wsClassic[cellRef].t = "n";
//         wsClassic[cellRef].z = "yyyy-mm-dd";
//       }
//     }
//   }

//   wsClassic["!merges"] = [
//     { s: { r: 0, c: 1 }, e: { r: 0, c: 17 } },
//     { s: { r: 1, c: 5 }, e: { r: 1, c: 6 } },
//     { s: { r: 1, c: 7 }, e: { r: 1, c: 15 } },
//     { s: { r: 1, c: 16 }, e: { r: 2, c: 16 } },
//     { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
//     { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
//     { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
//     { s: { r: 2, c: 12 }, e: { r: 2, c: 15 } },
//   ];
//   XLSX.utils.book_append_sheet(wb, wsClassic, "Класика");

//   let annuityRows = [];
//   annuityRows.push([
//     "",
//     "Таблиця обчислення загальної вартості кредиту для споживача",
//   ]);
//   annuityRows.push([
//     "№ з/п",
//     "Кількість днів у розрахунковому періоді",
//     "Сума видачі кредиту / розрахункова дата платежу",
//     "Чиста сума кредиту / загальний кредит",
//     "Сума платежу за період, грн",
//     "Проценти",
//     "Види платежів за додаткові та супутні послуги",
//     "Реальна річна ставка, %",
//     "Загальна вартість кредиту, грн",
//   ]);
//   annuityRows.push([
//     "",
//     "",
//     "",
//     "",
//     "",
//     "Сума за користування кредитом",
//     "Сума за обслуговування заборгованості",
//     "Кредитодавця",
//     "",
//     "Кредитного посередника",
//     "",
//     "Третіх осіб",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);
//   annuityRows.push([
//     "№",
//     "К-ть днів",
//     "Дата платежу",
//     "Сума кредиту",
//     "Сума платежу",
//     "Проценти",
//     "",
//     "За обслуговування",
//     "Комісія",
//     "Інші послуги",
//     "Комісія",
//     "Інший збір",
//     "Нотаріус",
//     "Страхування",
//     "Оцінювач",
//     "Інші",
//     "Реальна річна ставка",
//     "Загальна вартість",
//   ]);

//   annuityRows.push([
//     1,
//     "",
//     new Date(),
//     data.principal,
//     "",
//     "",
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     data.annuityEffectiveRate * 100,
//     data.annuityTotalCost,
//   ]);

//   data.annuityPayments.forEach((p, i) => {
//     const paymentDate = scheduleDates[i];
//     annuityRows.push([
//       i + 2,
//       "",
//       paymentDate,
//       p.remaining,
//       p.payment,
//       p.interest,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ]);
//   });

//   annuityRows.push([
//     "СУМА",
//     "",
//     "",
//     data.principal,
//     "",
//     data.annuityTotalInterest,
//     "",
//     0,
//     data.commissionFee,
//     0,
//     0,
//     0,
//     data.notaryFee,
//     data.insuranceFee,
//     0,
//     0,
//     "",
//     data.annuityTotalCost,
//   ]);

//   let wsAnnuity = XLSX.utils.aoa_to_sheet(annuityRows);

//   [0, 1, 2, 3].forEach((R) => {
//     const range = XLSX.utils.decode_range(wsAnnuity["!ref"]);
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//       setCellStyle(wsAnnuity, cellRef, HEADER_STYLE);
//     }
//   });

//   {
//     const range = XLSX.utils.decode_range(wsAnnuity["!ref"]);
//     const dataStartRowA = 4;
//     const totalRowA = annuityRows.length - 1;

//     for (let R = dataStartRowA; R < annuityRows.length; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//         if (wsAnnuity[cellRef]) {
//           setCellStyle(
//             wsAnnuity,
//             cellRef,
//             R === totalRowA ? TOTAL_STYLE : DATA_STYLE
//           );
//         }
//       }
//     }
//     for (let R = dataStartRowA; R < totalRowA; ++R) {
//       const cellRef = XLSX.utils.encode_cell({ r: R, c: 2 });
//       if (wsAnnuity[cellRef]) {
//         wsAnnuity[cellRef].t = "n";
//         wsAnnuity[cellRef].z = "yyyy-mm-dd";
//       }
//     }
//   }

//   wsAnnuity["!merges"] = [
//     { s: { r: 0, c: 1 }, e: { r: 0, c: 17 } },
//     { s: { r: 1, c: 5 }, e: { r: 1, c: 6 } },
//     { s: { r: 1, c: 7 }, e: { r: 1, c: 15 } },
//     { s: { r: 1, c: 16 }, e: { r: 2, c: 16 } },
//     { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
//     { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
//     { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
//     { s: { r: 2, c: 12 }, e: { r: 2, c: 15 } },
//   ];
  
//   XLSX.utils.book_append_sheet(wb, wsAnnuity, "Ануїтет");

//   XLSX.writeFile(wb, "Приклад обчислення загальної вартості кредиту для споживача та реальної річної процентної ставки за договором про споживчий кредит.xlsx");
// }


// //full version
let calcButton = document.getElementById("btn-result");
let classicBtn = document.getElementById("classic__table-btn");
let annuityBtn = document.getElementById("annuity__table-btn");
let annuityContainer = document.getElementById("annuity-table-container");
let classicContainer = document.getElementById("classic-table-container");
let clearButton = document.getElementById("btn-clear");
let resultParagraph = document.getElementById("result");
let resultsCache = null;

calcButton.onclick = function (event) {
  event.preventDefault();
  resultsCache = calculateLoan();
  if (resultsCache) {
    document.getElementById("btn-download").onclick = () =>
      exportFullReport(resultsCache);
  }
};

classicBtn.onclick = function () {
  classicContainer.style.display = "block";
  annuityContainer.style.display = "none";
};

annuityBtn.onclick = function () {
  annuityContainer.style.display = "block";
  classicContainer.style.display = "none";
};

clearButton.onclick = clearFields;

function getPaymentDates(n) {
  const dates = [];
  const today = new Date();
  const startMonth = today.getMonth();
  const startYear = today.getFullYear();

  for (let i = 0; i < n; i++) {
    let nextDate = new Date(startYear, startMonth + i + 1, 0);
    dates.push(nextDate);
  }
  return dates;
}


function calculateXIRR(cashFlows, dates) {
  if (cashFlows.length !== dates.length || dates.length < 2) {
    return NaN;
  }

  const MAX_ITER = 100;
  const PRECISION = 1e-7;
  let rate = 0.1; 
  const firstDate = dates[0];
  const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < MAX_ITER; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let j = 0; j < cashFlows.length; j++) {
      const days = (dates[j] - firstDate) / millisecondsInYear;
      const term = Math.pow(1 + rate, days);
      npv += cashFlows[j] / term;
      dnpv -= (days * cashFlows[j]) / (term * (1 + rate));
    }

    if (Math.abs(npv) < PRECISION) {
      return rate;
    }
    if (dnpv === 0) {
      return NaN;
    }
    rate -= npv / dnpv;
  }
  return NaN;
}

function calculateLoan() {
  let amount = parseFloat(document.getElementById("amount").value);
  let interest = parseFloat(document.getElementById("interest").value) || 0;
  let downpaymentPercent =
    parseFloat(document.getElementById("downpayment-percent").value) || 0;
  let list = parseFloat(document.getElementById("list").value);
  let notaryFee = parseFloat(document.getElementById("notary").value) || 0;
  let insuranceFee =
    parseFloat(document.getElementById("insurance").value) || 0;
  let commissionFee =
    parseFloat(document.getElementById("commission").value) || 0;

  let totalOneTimeFees = notaryFee + insuranceFee + commissionFee;

  if (isNaN(amount) || amount <= 0 || isNaN(list) || list <= 0) {
    resultParagraph.classList.remove("hidden");
    resultParagraph.innerHTML = "Дані вказані неправильно або відсутні";
    return null;
  }
  resultParagraph.classList.add("hidden");

  let principal = amount;
  let downpayment = (downpaymentPercent / 100) * principal;
  principal -= downpayment;

  let monthlyRate = interest / 100 / 12;

  let classicInterestExpense = 0;
  let remainingBalanceClassic = principal;
  let classicPayments = [];
  let firstClassicPayment = 0;
  let lastClassicPayment = 0;

  for (let i = 0; i < list; i++) {
    let interestPayment = remainingBalanceClassic * monthlyRate;
    let principalPayment = principal / list;
    let monthlyPayment = principalPayment + interestPayment;

    classicPayments.push({
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remaining: Math.max(remainingBalanceClassic - principalPayment, 0),
    });

    classicInterestExpense += interestPayment;
    remainingBalanceClassic -= principalPayment;
    if (i === 0) firstClassicPayment = monthlyPayment;
    if (i === list - 1) lastClassicPayment = monthlyPayment;
  }

  let classicOverPayment = classicInterestExpense + totalOneTimeFees;
  let classicTotalCost = principal + classicInterestExpense + totalOneTimeFees;

  let netProceeds = principal - totalOneTimeFees;
  const loanDates = getPaymentDates(list);
  const today = new Date();
  const initialLoanDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const allLoanDates = [initialLoanDate, ...loanDates];
  const classicCashFlows = [
    netProceeds,
    ...classicPayments.map((p) => -p.payment),
  ];

  let classicEffectiveRateVal = calculateXIRR(classicCashFlows, allLoanDates);

  let annuityMonthlyPayment =
    monthlyRate === 0
      ? principal / list
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -list));

  let annuityTotalPayment = annuityMonthlyPayment * list;
  let annuityInterestExpense = annuityTotalPayment - principal;
  let annuityOverPayment = annuityInterestExpense + totalOneTimeFees;
  let annuityTotalCost = annuityTotalPayment + totalOneTimeFees;

  let annuityPayments = [];
  let annuityRemainingBalance = principal;
  for (let i = 0; i < list; i++) {
    let interestPayment = annuityRemainingBalance * monthlyRate;
    let principalPayment = annuityMonthlyPayment - interestPayment;
    annuityRemainingBalance -= principalPayment;
    annuityPayments.push({
      payment: annuityMonthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remaining: Math.max(annuityRemainingBalance, 0),
    });
  }

  const annuityCashFlows = [
    netProceeds,
    ...annuityPayments.map((p) => -p.payment),
  ];
  let annuityEffectiveRateVal = calculateXIRR(annuityCashFlows, allLoanDates);

  document.getElementById(
    "classicMonthlyPayment"
  ).innerHTML = `${firstClassicPayment.toFixed(
    2
  )} - ${lastClassicPayment.toFixed(2)}`;
  document.getElementById("classicInterestExpense").innerHTML =
    classicInterestExpense.toFixed(2);
  document.getElementById("classicOverpayment").innerHTML =
    classicOverPayment.toFixed(2);
  document.getElementById("classicTotalCost").innerHTML =
    classicTotalCost.toFixed(2);
  document.getElementById("classicEffectiveRate").innerHTML =
    (classicEffectiveRateVal * 100).toFixed(6) + "%";

  document.getElementById("annuityMonthlyPayment").innerHTML =
    annuityMonthlyPayment.toFixed(2);
  document.getElementById("annuityInterestExpense").innerHTML =
    annuityInterestExpense.toFixed(2);
  document.getElementById("annuityOverpayment").innerHTML =
    annuityOverPayment.toFixed(2);
  document.getElementById("annuityTotalCost").innerHTML =
    annuityTotalCost.toFixed(2);
  document.getElementById("annuityEffectiveRate").innerHTML =
    (annuityEffectiveRateVal * 100).toFixed(6) + "%";

  buildAmortizationTable("classic-loan-table", classicPayments, loanDates);
  buildAmortizationTable("annuity-loan-table", annuityPayments, loanDates);

  return {
    amount,
    downpayment,
    principal,
    list,
    notaryFee,
    insuranceFee,
    commissionFee,
    classicPayments,
    classicTotalInterest: classicInterestExpense,
    classicOverPayment,
    classicTotalCost,
    classicEffectiveRate: classicEffectiveRateVal,
    annuityPayments,
    annuityTotalInterest: annuityInterestExpense,
    annuityOverPayment,
    annuityTotalCost,
    annuityEffectiveRate: annuityEffectiveRateVal,
    loanDates: allLoanDates,
  };
}


function buildAmortizationTable(tableId, payments, paymentDates) {
  const tableBody = document
    .getElementById(tableId)
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  let totalPrincipal = 0;
  let totalInterest = 0;

  payments.forEach((p, i) => {
    totalPrincipal += p.principal;
    totalInterest += p.interest;
    const dateString = paymentDates[i].toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const row = `<tr>
            <td>${i + 1}</td>
            <td>${dateString}</td>
            <td>${p.payment.toFixed(2)}</td>
            <td>${p.principal.toFixed(2)}</td>
            <td>${p.interest.toFixed(2)}</td>
            <td>${p.remaining.toFixed(2)}</td>
          </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  const totalRow = `<tr class="bg-gray-200 font-bold">
            <td>СУМА:</td>
            <td></td>
            <td></td>
            <td>${totalPrincipal.toFixed(2)}</td>
            <td>${totalInterest.toFixed(2)}</td>
            <td></td>
          </tr>`;
  tableBody.insertAdjacentHTML("beforeend", totalRow);
}

function clearFields() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  document.getElementById("list").value = "12";
  resultParagraph.classList.add("hidden");
  resultParagraph.innerHTML = "";

  [
    "classicMonthlyPayment",
    "classicInterestExpense",
    "classicOverpayment",
    "classicEffectiveRate",
    "classicTotalCost",
    "annuityMonthlyPayment",
    "annuityInterestExpense",
    "annuityOverpayment",
    "annuityEffectiveRate",
    "annuityTotalCost",
  ].forEach((id) => (document.getElementById(id).innerHTML = ""));

  clearTableRows("classic-loan-table");
  clearTableRows("annuity-loan-table");
}


function clearTableRows(tableId) {
  document.getElementById(tableId).getElementsByTagName("tbody")[0].innerHTML =
    "";
}

function exportFullReport(data) {
  let wb = XLSX.utils.book_new();

  const BORDER_STYLE = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  const setCellStyle = (ws, cellRef, style) => {
    if (!ws[cellRef]) ws[cellRef] = {};
    if (!ws[cellRef].s) ws[cellRef].s = {};
    Object.assign(ws[cellRef].s, style);
  };

  const classicHeaders = [
    ["", "Таблиця обчислення загальної вартості кредиту для споживача"],
    [
      "№ з/п",
      "Кількість днів у розрахунковому періоді",
      "Сума видачі кредиту / розрахункова дата платежу",
      "Чиста сума кредиту / загальний кредит",
      "Сума платежу за період, грн",
      "Проценти",
      "Види платежів за додаткові та супутні послуги",
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "Сума за користування кредитом",
      "Сума за обслуговування заборгованості",
      "Кредитодавця",
      "",
      "Кредитного посередника",
      "",
      "Третіх осіб",
      "",
      "",
      "",
      "",
      "Реальна річна ставка, %",
      "Загальна вартість кредиту, грн",
    ],
    [
      "№",
      "К-ть днів",
      "Дата платежу",
      "Сума кредиту",
      "Сума платежу",
      "Проценти",
      "",
      "За обслуговування",
      "Комісія",
      "Інші послуги",
      "Комісія",
      "Інший збір",
      "Нотаріус",
      "Страхування",
      "Оцінювач",
      "Інші",
      "",
      "",
    ],
  ];

  const generateTableData = (
    payments,
    totalInterest,
    totalCost,
    effectiveRate,
    loanDates
  ) => {
    const rows = [];
    const loanAmount = data.amount - data.downpayment;
    const initialDate = loanDates[0].toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    rows.push([
      1,
      "",
      initialDate,
      loanAmount,
      "",
      "",
      "",
      0,
      data.commissionFee,
      0,
      0,
      0,
      data.notaryFee,
      data.insuranceFee,
      0,
      0,
      effectiveRate * 100,
      totalCost,
    ]);

    payments.forEach((p, i) => {
      const dateString = loanDates[i + 1].toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      rows.push([
        i + 2,
        "",
        dateString,
        "",
        p.payment,
        p.interest,
        "",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "",
        "",
      ]);
    });

    rows.push([
      "СУМА",
      "",
      "",
      loanAmount,
      "",
      totalInterest,
      "",
      0,
      data.commissionFee,
      0,
      0,
      0,
      data.notaryFee,
      data.insuranceFee,
      0,
      0,
      "",
      totalCost,
    ]);
    return rows;
  };

  const createSheet = (
    title,
    payments,
    totalInterest,
    totalCost,
    effectiveRate,
    loanDates
  ) => {
    let ws = XLSX.utils.aoa_to_sheet([
      ...classicHeaders,
      ...generateTableData(
        payments,
        totalInterest,
        totalCost,
        effectiveRate,
        loanDates
      ),
    ]);

    ws["!merges"] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 17 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 6 } },
      { s: { r: 1, c: 7 }, e: { r: 1, c: 15 } },
      { s: { r: 1, c: 16 }, e: { r: 2, c: 16 } },
      { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },
      { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
      { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
      { s: { r: 2, c: 12 }, e: { r: 2, c: 15 } },
    ];

    const applyStyles = (sheet, isTotalRow) => {
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          setCellStyle(
            sheet,
            cellRef,
            isTotalRow(R)
              ? { font: { bold: true }, border: BORDER_STYLE }
              : { border: BORDER_STYLE }
          );
        }
      }
    };

    applyStyles(ws, (R) => R === classicHeaders.length + payments.length + 1);

    XLSX.utils.book_append_sheet(wb, ws, title);
  };

  createSheet(
    "Класика",
    data.classicPayments,
    data.classicTotalInterest,
    data.classicTotalCost,
    data.classicEffectiveRate,
    data.loanDates
  );
  createSheet(
    "Ануїтет",
    data.annuityPayments,
    data.annuityTotalInterest,
    data.annuityTotalCost,
    data.annuityEffectiveRate,
    data.loanDates
  );

  XLSX.writeFile(wb, "Приклад обчислення загальної вартості кредиту для споживача та реальної річної процентної ставки за договором про споживчий кредит.xlsx");
}