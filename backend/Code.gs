/****************************************************
 * KASHOMBA ELECTRICAL
 * GOOGLE APPS SCRIPT BACKEND
 *
 * DATABASE:
 * Google Sheets
 *
 * Spreadsheet ID:
 * 13at8psutVuT42-scoA-6m0wtf0YO37zxcHWrFuk92YQ
 ****************************************************/


/* ==================================================
   CONFIGURATION
================================================== */

const CONFIG = {

  SPREADSHEET_ID:
    "13at8psutVuT42-scoA-6m0wtf0YO37zxcHWrFuk92YQ",

  SHEETS: {

    CUSTOMERS: "Customers",

    ITEMS: "Items",

    INVOICES: "Invoices",

    PAYMENTS: "Payments",

    STAFF: "Staff",

    EXPENSES: "Expenses"

  }

};


/* ==================================================
   WEB APP
================================================== */

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("KASHOMBA ELECTRICAL")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


/* ==================================================
   DATABASE CONNECTION
================================================== */

function getDatabase() {

  return SpreadsheetApp.openById(
    CONFIG.SPREADSHEET_ID
  );

}


/* ==================================================
   INITIALIZE DATABASE
================================================== */

function setupDatabase() {

  const ss =
    getDatabase();


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.CUSTOMERS,
    [
      "Customer ID",
      "Jina",
      "Simu",
      "Anwani",
      "P.O. Box",
      "Email",
      "Tarehe"
    ]
  );


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.ITEMS,
    [
      "Item ID",
      "Jina",
      "Kiasi",
      "Bei",
      "Tarehe"
    ]
  );


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.INVOICES,
    [
      "Invoice No",
      "Mteja",
      "Tarehe",
      "Vifaa",
      "Labour",
      "Discount",
      "Subtotal",
      "Total Charges",
      "Paid",
      "Balance",
      "Hali"
    ]
  );


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.PAYMENTS,
    [
      "Payment ID",
      "Invoice No",
      "Kiasi",
      "Tarehe",
      "Njia"
    ]
  );


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.STAFF,
    [
      "Staff ID",
      "Jina",
      "Simu",
      "Kiwango Kwa Siku",
      "Tarehe"
    ]
  );


  createSheetIfMissing(
    ss,
    CONFIG.SHEETS.EXPENSES,
    [
      "Expense ID",
      "Project",
      "Aina",
      "Fundi",
      "Sehemu",
      "Siku",
      "Malazi",
      "Usafiri",
      "Chakula",
      "Vifaa",
      "Mengine",
      "Invoice No",
      "Budget",
      "Labour Charge",
      "Gharama Zote-auto",
      "Faida",
      "Tarehe"
    ]
  );


  return {
    success: true,
    message: "Database imeandaliwa vizuri."
  };

}


/* ==================================================
   CREATE SHEET
================================================== */

function createSheetIfMissing(
  ss,
  sheetName,
  headers
) {

  let sheet =
    ss.getSheetByName(
      sheetName
    );


  if (!sheet) {

    sheet =
      ss.insertSheet(
        sheetName
      );

  }


  if (
    sheet.getLastRow() === 0
  ) {

    sheet
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setValues([
        headers
      ]);


    sheet
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setFontWeight(
        "bold"
      );


    sheet
      .setFrozenRows(
        1
      );

  }

}


/* ==================================================
   GENERIC SHEET READER
================================================== */

function getSheetData(
  sheetName
) {

  const ss =
    getDatabase();


  const sheet =
    ss.getSheetByName(
      sheetName
    );


  if (!sheet) {

    throw new Error(
      `Sheet "${sheetName}" haipo. Run setupDatabase() kwanza.`
    );

  }


  const values =
    sheet.getDataRange()
      .getValues();


  if (
    values.length <= 1
  ) {

    return [];

  }


  const headers =
    values[0];


  return values
    .slice(1)
    .filter(
      row =>
        row.some(
          value =>
            value !== ""
        )
    )
    .map(
      row => {

        const object = {};

        headers.forEach(
          (
            header,
            index
          ) => {

            object[header] =
              row[index];

          }
        );

        return object;

      }
    );

}


/* ==================================================
   GENERIC APPEND
================================================== */

function appendRow(
  sheetName,
  data
) {

  const ss =
    getDatabase();


  const sheet =
    ss.getSheetByName(
      sheetName
    );


  if (!sheet) {

    throw new Error(
      `Sheet "${sheetName}" haipo.`
    );

  }


  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];


  const row =
    headers.map(
      header =>
        data[header] !== undefined
          ? data[header]
          : ""
    );


  sheet.appendRow(
    row
  );

}


/* ==================================================
   ID GENERATOR
================================================== */

function generateId(
  prefix
) {

  const timestamp =
    new Date()
      .getTime()
      .toString()
      .slice(-8);


  const random =
    Math.floor(
      100 +
      Math.random() * 900
    );


  return (
    prefix +
    "-" +
    timestamp +
    random
  );

}


/* ==================================================
   CUSTOMER ID
================================================== */

function generateCustomerId() {

  return generateId(
    "CUS"
  );

}


/* ==================================================
   ITEM ID
================================================== */

function generateItemId() {

  return generateId(
    "ITM"
  );

}


/* ==================================================
   STAFF ID
================================================== */

function generateStaffId() {

  return generateId(
    "STF"
  );

}


/* ==================================================
   PAYMENT ID
================================================== */

function generatePaymentId() {

  return generateId(
    "PAY"
  );

}


/* ==================================================
   EXPENSE ID
================================================== */

function generateExpenseId() {

  return generateId(
    "EXP"
  );

}


/* ==================================================
   INVOICE NUMBER
================================================== */

function generateInvoiceNumber() {

  const sheet =
    getDatabase()
      .getSheetByName(
        CONFIG.SHEETS.INVOICES
      );


  const year =
    new Date()
      .getFullYear();


  const rows =
    sheet.getLastRow();


  const number =
    Math.max(
      0,
      rows - 1
    ) + 1;


  return (
    "INV-" +
    year +
    "-" +
    String(number)
      .padStart(
        4,
        "0"
      )
  );

}


/* ==================================================
   CUSTOMERS
================================================== */

function getCustomers() {

  return getSheetData(
    CONFIG.SHEETS.CUSTOMERS
  );

}


function addCustomer(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za mteja hazijatumwa."
    );

  }


  if (!data.jina) {

    throw new Error(
      "Jina la mteja linahitajika."
    );

  }


  if (!data.simu) {

    throw new Error(
      "Namba ya simu inahitajika."
    );

  }


  const customerId =
    generateCustomerId();


  appendRow(
    CONFIG.SHEETS.CUSTOMERS,
    {

      "Customer ID":
        customerId,

      "Jina":
        data.jina,

      "Simu":
        data.simu,

      "Anwani":
        data.anwani || "",

      "P.O. Box":
        data.pobox || "",

      "Email":
        data.email || "",

      "Tarehe":
        new Date()

    }
  );


  return {

    success: true,

    message:
      "Mteja ameongezwa.",

    customerId

  };

}


/* ==================================================
   ITEMS
================================================== */

function getItems() {

  return getSheetData(
    CONFIG.SHEETS.ITEMS
  );

}


function addItem(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za kifaa hazijatumwa."
    );

  }


  if (!data.jina) {

    throw new Error(
      "Jina la kifaa linahitajika."
    );

  }


  const itemId =
    generateItemId();


  appendRow(
    CONFIG.SHEETS.ITEMS,
    {

      "Item ID":
        itemId,

      "Jina":
        data.jina,

      "Kiasi":
        Number(data.kiasi) || 0,

      "Bei":
        Number(data.bei) || 0,

      "Tarehe":
        new Date()

    }
  );


  return {

    success: true,

    message:
      "Kifaa kimeongezwa.",

    itemId

  };

}


/* ==================================================
   INVOICES
================================================== */

function getInvoices() {

  return getSheetData(
    CONFIG.SHEETS.INVOICES
  );

}


function createInvoice(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za invoice hazijatumwa."
    );

  }


  if (!data.mteja) {

    throw new Error(
      "Jina la mteja linahitajika."
    );

  }


  if (
    !data.vifaa ||
    !Array.isArray(
      data.vifaa
    ) ||
    data.vifaa.length === 0
  ) {

    throw new Error(
      "Angalau kifaa kimoja kinahitajika."
    );

  }


  let subtotal = 0;


  const vifaa =
    data.vifaa.map(
      item => {

        const qty =
          Number(
            item.qty
          ) || 0;


        const price =
          Number(
            item.price
          ) || 0;


        const total =
          qty * price;


        subtotal +=
          total;


        return {

          jina:
            item.jina,

          qty,

          price,

          total

        };

      }
    );


  const labour =
    Number(
      data.labour
    ) || 0;


  const discount =
    Number(
      data.discount
    ) || 0;


  const totalCharges =
    Math.max(
      0,
      subtotal +
      labour -
      discount
    );


  const invoiceNo =
    generateInvoiceNumber();


  appendRow(
    CONFIG.SHEETS.INVOICES,
    {

      "Invoice No":
        invoiceNo,

      "Mteja":
        data.mteja,

      "Tarehe":
        new Date(),

      "Vifaa":
        JSON.stringify(
          vifaa
        ),

      "Labour":
        labour,

      "Discount":
        discount,

      "Subtotal":
        subtotal,

      "Total Charges":
        totalCharges,

      "Paid":
        0,

      "Balance":
        totalCharges,

      "Hali":
        "UNPAID"

    }
  );


  return {

    success: true,

    message:
      "Invoice imetengenezwa.",

    invoiceNo,

    total:
      totalCharges

  };

}


/* ==================================================
   PAYMENTS
================================================== */

function getPayments() {

  return getSheetData(
    CONFIG.SHEETS.PAYMENTS
  );

}


function recordPayment(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za malipo hazijatumwa."
    );

  }


  if (!data.invoiceNo) {

    throw new Error(
      "Invoice No inahitajika."
    );

  }


  const amount =
    Number(
      data.kiasi
    );


  if (
    !amount ||
    amount <= 0
  ) {

    throw new Error(
      "Kiasi cha malipo si sahihi."
    );

  }


  if (!data.njia) {

    throw new Error(
      "Njia ya malipo inahitajika."
    );

  }


  const ss =
    getDatabase();


  const sheet =
    ss.getSheetByName(
      CONFIG.SHEETS.INVOICES
    );


  const values =
    sheet.getDataRange()
      .getValues();


  const headers =
    values[0];


  const invoiceColumn =
    headers.indexOf(
      "Invoice No"
    );


  let foundRow =
    -1;


  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    if (
      String(
        values[i][invoiceColumn]
      ).trim()
      ===
      String(
        data.invoiceNo
      ).trim()
    ) {

      foundRow =
        i + 1;

      break;

    }

  }


  if (
    foundRow === -1
  ) {

    throw new Error(
      "Invoice haijapatikana."
    );

  }


  const paidColumn =
    headers.indexOf(
      "Paid"
    ) + 1;


  const balanceColumn =
    headers.indexOf(
      "Balance"
    ) + 1;


  const totalColumn =
    headers.indexOf(
      "Total Charges"
    ) + 1;


  const statusColumn =
    headers.indexOf(
      "Hali"
    ) + 1;


  const total =
    Number(
      sheet.getRange(
        foundRow,
        totalColumn
      ).getValue()
    ) || 0;


  const previousPaid =
    Number(
      sheet.getRange(
        foundRow,
        paidColumn
      ).getValue()
    ) || 0;


  const newPaid =
    previousPaid +
    amount;


  if (
    newPaid > total
  ) {

    throw new Error(
      "Malipo hayawezi kuzidi kiasi cha invoice."
    );

  }


  const balance =
    Math.max(
      0,
      total -
      newPaid
    );


  let status =
    "PARTIAL";


  if (
    balance === 0
  ) {

    status =
      "PAID";

  }


  sheet
    .getRange(
      foundRow,
      paidColumn
    )
    .setValue(
      newPaid
    );


  sheet
    .getRange(
      foundRow,
      balanceColumn
    )
    .setValue(
      balance
    );


  sheet
    .getRange(
      foundRow,
      statusColumn
    )
    .setValue(
      status
    );


  const paymentId =
    generatePaymentId();


  appendRow(
    CONFIG.SHEETS.PAYMENTS,
    {

      "Payment ID":
        paymentId,

      "Invoice No":
        data.invoiceNo,

      "Kiasi":
        amount,

      "Tarehe":
        new Date(),

      "Njia":
        String(
          data.njia
        ).toUpperCase()

    }
  );


  return {

    success: true,

    message:
      "Malipo yamehifadhiwa.",

    paymentId,

    paid:
      newPaid,

    balance,

    status

  };

}


/* ==================================================
   STAFF
================================================== */

function getStaff() {

  return getSheetData(
    CONFIG.SHEETS.STAFF
  );

}


function addStaff(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za fundi hazijatumwa."
    );

  }


  if (!data.jina) {

    throw new Error(
      "Jina la fundi linahitajika."
    );

  }


  const staffId =
    generateStaffId();


  appendRow(
    CONFIG.SHEETS.STAFF,
    {

      "Staff ID":
        staffId,

      "Jina":
        data.jina,

      "Simu":
        data.simu || "",

      "Kiwango Kwa Siku":
        Number(
          data.kiasi
        ) || 0,

      "Tarehe":
        new Date()

    }
  );


  return {

    success: true,

    message:
      "Fundi ameongezwa.",

    staffId

  };

}


/* ==================================================
   EXPENSES
================================================== */

function getExpenses() {

  return getSheetData(
    CONFIG.SHEETS.EXPENSES
  );

}


function addExpense(
  data
) {

  if (!data) {

    throw new Error(
      "Taarifa za matumizi hazijatumwa."
    );

  }


  if (!data.project) {

    throw new Error(
      "Project inahitajika."
    );

  }


  const siku =
    Number(
      data.siku
    ) || 0;


  const malazi =
    Number(
      data.malazi
    ) || 0;


  const usafiri =
    Number(
      data.usafiri
    ) || 0;


  const chakula =
    Number(
      data.chakula
    ) || 0;


  const vifaa =
    Number(
      data.vifaa
    ) || 0;


  const mengine =
    Number(
      data.mengine
    ) || 0;


  const budget =
    Number(
      data.budget
    ) || 0;


  const labourCharge =
    Number(
      data.labourCharge
    ) || 0;


  /*
   * Total cost
   *
   * Hapa tunajumlisha:
   *
   * Malazi
   * Usafiri
   * Chakula
   * Vifaa
   * Mengine
   */

  const totalCost =
    malazi +
    usafiri +
    chakula +
    vifaa +
    mengine;


  /*
   * Profit
   *
   * Budget ndiyo amount
   * iliyotengwa/kutozwa kwa project.
   *
   * Kama budget haipo,
   * tunatumia labour charge.
   */

  const revenue =
    budget > 0
      ? budget
      : labourCharge;


  const profit =
    revenue -
    totalCost;


  const expenseId =
    generateExpenseId();


  appendRow(
    CONFIG.SHEETS.EXPENSES,
    {

      "Expense ID":
        expenseId,

      "Project":
        data.project,

      "Aina":
        data.aina || "",

      "Fundi":
        data.fundi || "",

      "Sehemu":
        data.sehemu || "",

      "Siku":
        siku,

      "Malazi":
        malazi,

      "Usafiri":
        usafiri,

      "Chakula":
        chakula,

      "Vifaa":
        vifaa,

      "Mengine":
        mengine,

      "Invoice No":
        data.invoiceNo || "",

      "Budget":
        budget,

      "Labour Charge":
        labourCharge,

      "Gharama Zote-auto":
        totalCost,

      "Faida":
        profit,

      "Tarehe":
        new Date()

    }
  );


  return {

    success: true,

    message:
      "Matumizi yamehifadhiwa.",

    expenseId,

    totalCost,

    profit

  };

}


/* ==================================================
   DASHBOARD
================================================== */

function getDashboardStats() {

  const customers =
    getCustomers();


  const invoices =
    getInvoices();


  const payments =
    getPayments();


  const expenses =
    getExpenses();


  let totalPayments =
    0;


  payments.forEach(
    payment => {

      totalPayments +=
        Number(
          payment["Kiasi"]
        ) || 0;

    }
  );


  let totalProfit =
    0;


  expenses.forEach(
    expense => {

      totalProfit +=
        Number(
          expense["Faida"]
        ) || 0;

    }
  );


  return {

    customers:
      customers.length,

    invoices:
      invoices.length,

    payments:
      totalPayments,

    profit:
      totalProfit

  };

}


/* ==================================================
   REPORTS
================================================== */

function getReports() {

  const dashboard =
    getDashboardStats();


  const customers =
    getCustomers();


  const items =
    getItems();


  const invoices =
    getInvoices();


  const payments =
    getPayments();


  const staff =
    getStaff();


  const expenses =
    getExpenses();


  return {

    dashboard,

    customers,

    items,

    invoices,

    payments,

    staff,

    expenses

  };

}


/* ==================================================
   UTILITY
================================================== */

function getSheet(
  sheetName
) {

  const sheet =
    getDatabase()
      .getSheetByName(
        sheetName
      );


  if (!sheet) {

    throw new Error(
      `Sheet "${sheetName}" haipo.`
    );

  }


  return sheet;

}


/* ==================================================
   TEST CONNECTION
================================================== */

function testConnection() {

  const ss =
    getDatabase();


  return {

    success: true,

    spreadsheet:
      ss.getName(),

    url:
      ss.getUrl(),

    message:
      "Google Sheets connection iko sawa."

  };

}