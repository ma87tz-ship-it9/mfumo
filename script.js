/****************************************************
 * KASHOMBA ELECTRICAL MANAGEMENT SYSTEM
 * FRONTEND
 ****************************************************/


/* ==================================================
   API CONFIG
================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxnQPhZInsoWH3SZ655ko4PCCe8eTu9JbFy3bQYCkTZ38Nt3l3MuWMoPIM1eeS4jKZK/exec";


/* ==================================================
   GLOBAL DATA
================================================== */

let customersData = [];
let itemsData = [];
let invoicesData = [];
let paymentsData = [];
let staffData = [];
let expensesData = [];


/* ==================================================
   API
================================================== */

async function api(
    action,
    data = {}
) {

    try {

        console.log(
            "API REQUEST:",
            action,
            data
        );


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            action:
                                action,

                            data:
                                data

                        })

                }
            );


        const text =
            await response.text();


        console.log(
            "API RAW RESPONSE:",
            text
        );


        let result;


        try {

            result =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                text
            );

            throw new Error(
                "Backend imerudisha response isiyo sahihi."
            );

        }


        if (
            !result.success
        ) {

            throw new Error(
                result.message ||
                "API request imeshindwa."
            );

        }


        return result.data;


    } catch (error) {

        console.error(
            "API ERROR:",
            action,
            error
        );

        throw error;

    }

}


/* ==================================================
   DOM READY
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


/* ==================================================
   INITIALIZE
================================================== */

async function initializeApp() {

    console.log(
        "Kashomba Electrical starting..."
    );


    updateCurrentDate();


    setupNavigation();


    setupForms();


    setupSearch();


    await checkBackend();


    await loadAllData();

}


/* ==================================================
   BACKEND TEST
================================================== */

async function checkBackend() {

    try {

        const result =
            await api(
                "testConnection"
            );


        console.log(
            "BACKEND CONNECTED:",
            result
        );


        showToast(
            "System imeunganishwa vizuri.",
            "success"
        );


        return true;


    } catch (error) {

        console.error(
            "BACKEND CONNECTION ERROR:",
            error
        );


        showToast(
            "Backend haijaunganishwa: " +
            error.message,
            "error"
        );


        return false;

    }

}


/* ==================================================
   LOAD ALL DATA
================================================== */

async function loadAllData() {

    try {

        await Promise.all([

            loadCustomers(),

            loadItems(),

            loadInvoices(),

            loadPayments(),

            loadStaff(),

            loadExpenses(),

            loadDashboard(),

            loadReports()

        ]);


        console.log(
            "All data loaded."
        );


    } catch (error) {

        console.error(
            "LOAD DATA ERROR:",
            error
        );

    }

}


/* ==================================================
   DASHBOARD
================================================== */

async function loadDashboard() {

    try {

        const stats =
            await api(
                "getDashboardStats"
            );


        document.getElementById(
            "dashboardCustomers"
        ).textContent =
            stats.customers || 0;


        document.getElementById(
            "dashboardInvoices"
        ).textContent =
            stats.invoices || 0;


        document.getElementById(
            "dashboardPayments"
        ).textContent =
            formatMoney(
                stats.payments
            );


        document.getElementById(
            "dashboardProfit"
        ).textContent =
            formatMoney(
                stats.profit
            );


        await renderDashboardInvoices();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


/* ==================================================
   DASHBOARD RECENT INVOICES
================================================== */

async function renderDashboardInvoices() {

    const tbody =
        document.getElementById(
            "dashboardInvoicesTable"
        );


    if (!tbody) {
        return;
    }


    const recent =
        invoicesData
            .slice()
            .reverse()
            .slice(
                0,
                5
            );


    if (
        recent.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >

                    Hakuna invoice kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        recent.map(
            invoice => {

                const status =
                    invoice["Hali"] ||
                    "UNPAID";


                return `

                    <tr>

                        <td>
                            ${escapeHTML(
                                invoice["Invoice No"]
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                invoice["Mteja"]
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                invoice["Tarehe"]
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                invoice["Total Charges"]
                            )}
                        </td>

                        <td>
                            <span class="status-badge">
                                ${escapeHTML(
                                    status
                                )}
                            </span>
                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


/* ==================================================
   CUSTOMERS
================================================== */

async function loadCustomers() {

    try {

        customersData =
            await api(
                "getCustomers"
            );


        renderCustomers(
            customersData
        );


        populateCustomerSelect();


    } catch (error) {

        console.error(
            "Customers error:",
            error
        );

    }

}


function renderCustomers(
    customers
) {

    const tbody =
        document.getElementById(
            "customersTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !customers ||
        customers.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >

                    Hakuna wateja kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        customers.map(
            customer => `

                <tr>

                    <td>
                        ${escapeHTML(
                            customer["Customer ID"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer["Jina"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer["Simu"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer["Anwani"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer["P.O. Box"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            customer["Email"]
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            customer["Tarehe"]
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   ITEMS
================================================== */

async function loadItems() {

    try {

        itemsData =
            await api(
                "getItems"
            );


        renderItems(
            itemsData
        );


    } catch (error) {

        console.error(
            "Items error:",
            error
        );

    }

}


function renderItems(
    items
) {

    const tbody =
        document.getElementById(
            "itemsTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !items ||
        items.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >

                    Hakuna vifaa kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        items.map(
            item => `

                <tr>

                    <td>
                        ${escapeHTML(
                            item["Item ID"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item["Jina"]
                        )}
                    </td>

                    <td>
                        ${Number(
                            item["Kiasi"] || 0
                        ).toLocaleString()}
                    </td>

                    <td>
                        ${formatMoney(
                            item["Bei"]
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   INVOICES
================================================== */

async function loadInvoices() {

    try {

        invoicesData =
            await api(
                "getInvoices"
            );


        renderInvoices(
            invoicesData
        );


        populateInvoiceSelects();


        renderInvoiceItems();


    } catch (error) {

        console.error(
            "Invoices error:",
            error
        );

    }

}


function renderInvoices(
    invoices
) {

    const tbody =
        document.getElementById(
            "invoicesTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !invoices ||
        invoices.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-state"
                >

                    Hakuna invoice kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        invoices.map(
            invoice => `

                <tr>

                    <td>
                        ${escapeHTML(
                            invoice["Invoice No"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            invoice["Mteja"]
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            invoice["Tarehe"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            invoice["Subtotal"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            invoice["Labour"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            invoice["Discount"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            invoice["Total Charges"]
                        )}
                    </td>

                    <td>
                        <span class="status-badge">
                            ${escapeHTML(
                                invoice["Hali"]
                            )}
                        </span>
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   PAYMENTS
================================================== */

async function loadPayments() {

    try {

        paymentsData =
            await api(
                "getPayments"
            );


        renderPayments(
            paymentsData
        );


        populateInvoiceSelects();


    } catch (error) {

        console.error(
            "Payments error:",
            error
        );

    }

}


function renderPayments(
    payments
) {

    const tbody =
        document.getElementById(
            "paymentsTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !payments ||
        payments.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >

                    Hakuna malipo kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        payments.map(
            payment => `

                <tr>

                    <td>
                        ${escapeHTML(
                            payment["Payment ID"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment["Invoice No"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            payment["Kiasi"]
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            payment["Tarehe"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            payment["Njia"]
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   STAFF
================================================== */

async function loadStaff() {

    try {

        staffData =
            await api(
                "getStaff"
            );


        renderStaff(
            staffData
        );


        populateStaffSelect();


    } catch (error) {

        console.error(
            "Staff error:",
            error
        );

    }

}


function renderStaff(
    staff
) {

    const tbody =
        document.getElementById(
            "staffTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !staff ||
        staff.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >

                    Hakuna wafanyakazi kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        staff.map(
            member => `

                <tr>

                    <td>
                        ${escapeHTML(
                            member["Staff ID"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member["Jina"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member["Simu"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            member["Kiwango Kwa Siku"]
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   EXPENSES
================================================== */

async function loadExpenses() {

    try {

        expensesData =
            await api(
                "getExpenses"
            );


        renderExpenses(
            expensesData
        );


    } catch (error) {

        console.error(
            "Expenses error:",
            error
        );

    }

}


function renderExpenses(
    expenses
) {

    const tbody =
        document.getElementById(
            "expensesTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !expenses ||
        expenses.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-state"
                >

                    Hakuna matumizi kwa sasa.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        expenses.map(
            expense => `

                <tr>

                    <td>
                        ${escapeHTML(
                            expense["Expense ID"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            expense["Project"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            expense["Aina"]
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            expense["Fundi"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            expense["Labour Charge"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            expense["Gharama Zote-auto"]
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            expense["Faida"]
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            expense["Tarehe"]
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


/* ==================================================
   REPORTS
================================================== */

async function loadReports() {

    try {

        const reports =
            await api(
                "getReports"
            );


        if (
            !reports
        ) {
            return;
        }


        const dashboard =
            reports.dashboard ||
            {};


        const sales =
            invoicesData.reduce(
                (
                    total,
                    invoice
                ) =>
                    total +
                    Number(
                        invoice["Total Charges"]
                    ) || 0,
                0
            );


        const expenses =
            reports.expenses ||
            [];


        const expenseTotal =
            expenses.reduce(
                (
                    total,
                    expense
                ) =>
                    total +
                    Number(
                        expense["Gharama Zote-auto"]
                    ) || 0,
                0
            );


        const reportSales =
            document.getElementById(
                "reportSales"
            );


        const reportPayments =
            document.getElementById(
                "reportPayments"
            );


        const reportExpenses =
            document.getElementById(
                "reportExpenses"
            );


        const reportProfit =
            document.getElementById(
                "reportProfit"
            );


        if (reportSales) {

            reportSales.textContent =
                formatMoney(
                    sales
                );

        }


        if (reportPayments) {

            reportPayments.textContent =
                formatMoney(
                    dashboard.payments
                );

        }


        if (reportExpenses) {

            reportExpenses.textContent =
                formatMoney(
                    expenseTotal
                );

        }


        if (reportProfit) {

            reportProfit.textContent =
                formatMoney(
                    dashboard.profit
                );

        }


    } catch (error) {

        console.error(
            "Reports error:",
            error
        );

    }

}


/* ==================================================
   NAVIGATION
================================================== */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const page =
                        link.dataset.page;


                    navigateToPage(
                        page
                    );

                }
            );

        }
    );


    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(
            button => {

                if (
                    button.classList.contains(
                        "nav-link"
                    )
                ) {
                    return;
                }


                button.addEventListener(
                    "click",
                    () => {

                        navigateToPage(
                            button.dataset.page
                        );

                    }
                );

            }
        );


    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebarClose =
        document.getElementById(
            "sidebarClose"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


function navigateToPage(
    page
) {

    if (!page) {
        return;
    }


    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active-page"
                );

            }
        );


    const target =
        document.getElementById(
            "page-" + page
        );


    if (target) {

        target.classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link => {

                link.classList.toggle(
                    "active",
                    link.dataset.page === page
                );

            }
        );


    updatePageHeading(
        page
    );


    closeSidebar();


    if (page === "dashboard") {

        loadDashboard();

    }

}


function updatePageHeading(
    page
) {

    const title =
        document.getElementById(
            "pageTitle"
        );


    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const pages = {

        dashboard: [
            "Dashboard",
            "Muhtasari wa shughuli za ofisi"
        ],

        customers: [
            "Wateja",
            "Simamia taarifa za wateja"
        ],

        items: [
            "Vifaa",
            "Catalog ya vifaa na bei"
        ],

        invoices: [
            "Invoice",
            "Tengeneza na simamia invoices"
        ],

        payments: [
            "Malipo",
            "Rekodi na fuatilia malipo"
        ],

        staff: [
            "Wafanyakazi",
            "Simamia mafundi na viwango vyao"
        ],

        expenses: [
            "Matumizi",
            "Simamia gharama za projects"
        ],

        reports: [
            "Ripoti",
            "Ripoti za biashara na fedha"
        ]

    };


    const info =
        pages[page] ||
        pages.dashboard;


    if (title) {

        title.textContent =
            info[0];

    }


    if (subtitle) {

        subtitle.textContent =
            info[1];

    }

}


/* ==================================================
   SIDEBAR
================================================== */

function openSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (sidebar) {

        sidebar.classList.add(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }

}


function closeSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

}


/* ==================================================
   FORMS
================================================== */

function setupForms() {

    setupCustomerForm();

    setupItemForm();

    setupInvoiceForm();

    setupPaymentForm();

    setupStaffForm();

    setupExpenseForm();

}


/* ==================================================
   CUSTOMER FORM
================================================== */

function setupCustomerForm() {

    const addButton =
        document.getElementById(
            "addCustomerButton"
        );


    const card =
        document.getElementById(
            "customerFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelCustomerButton"
        );


    const form =
        document.getElementById(
            "customerForm"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const data = {

                    jina:
                        document.getElementById(
                            "customerName"
                        ).value.trim(),

                    simu:
                        document.getElementById(
                            "customerPhone"
                        ).value.trim(),

                    anwani:
                        document.getElementById(
                            "customerAddress"
                        ).value.trim(),

                    pobox:
                        document.getElementById(
                            "customerPobox"
                        ).value.trim(),

                    email:
                        document.getElementById(
                            "customerEmail"
                        ).value.trim()

                };


                try {

                    await api(
                        "addCustomer",
                        data
                    );


                    showToast(
                        "Mteja ameongezwa.",
                        "success"
                    );


                    form.reset();


                    card.style.display =
                        "none";


                    await loadCustomers();

                    await loadDashboard();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   ITEM FORM
================================================== */

function setupItemForm() {

    const addButton =
        document.getElementById(
            "addItemButton"
        );


    const card =
        document.getElementById(
            "itemFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelItemButton"
        );


    const form =
        document.getElementById(
            "itemForm"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const data = {

                    jina:
                        document.getElementById(
                            "itemName"
                        ).value.trim(),

                    kiasi:
                        document.getElementById(
                            "itemQuantity"
                        ).value,

                    bei:
                        document.getElementById(
                            "itemPrice"
                        ).value

                };


                try {

                    await api(
                        "addItem",
                        data
                    );


                    showToast(
                        "Kifaa kimeongezwa.",
                        "success"
                    );


                    form.reset();


                    card.style.display =
                        "none";


                    await loadItems();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   INVOICE FORM
================================================== */

function setupInvoiceForm() {

    const addButton =
        document.getElementById(
            "createInvoiceButton"
        );


    const card =
        document.getElementById(
            "invoiceFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelInvoiceButton"
        );


    const form =
        document.getElementById(
            "invoiceForm"
        );


    const addItemButton =
        document.getElementById(
            "addInvoiceItemButton"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";


                renderInvoiceItems();

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

                document.getElementById(
                    "invoiceItemsContainer"
                ).innerHTML = "";

            }
        );

    }


    if (addItemButton) {

        addItemButton.addEventListener(
            "click",
            () => {

                addInvoiceItemRow();

            }
        );

    }


    const labour =
        document.getElementById(
            "invoiceLabour"
        );


    const discount =
        document.getElementById(
            "invoiceDiscount"
        );


    if (labour) {

        labour.addEventListener(
            "input",
            calculateInvoiceTotal
        );

    }


    if (discount) {

        discount.addEventListener(
            "input",
            calculateInvoiceTotal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const customer =
                    document.getElementById(
                        "invoiceCustomer"
                    ).value;


                const date =
                    document.getElementById(
                        "invoiceDate"
                    ).value;


                const labourValue =
                    document.getElementById(
                        "invoiceLabour"
                    ).value;


                const discountValue =
                    document.getElementById(
                        "invoiceDiscount"
                    ).value;


                const rows =
                    document.querySelectorAll(
                        ".invoice-item-row"
                    );


                const vifaa = [];


                rows.forEach(
                    row => {

                        const select =
                            row.querySelector(
                                ".invoice-item-select"
                            );


                        const qty =
                            row.querySelector(
                                ".invoice-item-qty"
                            );


                        if (
                            select &&
                            select.value
                        ) {

                            const item =
                                itemsData.find(
                                    i =>
                                        String(
                                            i["Item ID"]
                                        ) ===
                                        String(
                                            select.value
                                        )
                                );


                            if (item) {

                                vifaa.push({

                                    jina:
                                        item["Jina"],

                                    qty:
                                        Number(
                                            qty.value
                                        ) || 1,

                                    price:
                                        Number(
                                            item["Bei"]
                                        ) || 0

                                });

                            }

                        }

                    }
                );


                if (
                    !customer
                ) {

                    showToast(
                        "Chagua mteja.",
                        "error"
                    );

                    return;

                }


                if (
                    vifaa.length === 0
                ) {

                    showToast(
                        "Ongeza angalau kifaa kimoja.",
                        "error"
                    );

                    return;

                }


                try {

                    await api(

                        "createInvoice",

                        {

                            mteja:
                                customer,

                            tarehe:
                                date,

                            vifaa:
                                vifaa,

                            labour:
                                labourValue,

                            discount:
                                discountValue

                        }

                    );


                    showToast(
                        "Invoice imetengenezwa.",
                        "success"
                    );


                    form.reset();


                    document.getElementById(
                        "invoiceItemsContainer"
                    ).innerHTML = "";


                    card.style.display =
                        "none";


                    await loadInvoices();

                    await loadDashboard();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   INVOICE ITEM ROWS
================================================== */

function renderInvoiceItems() {

    const container =
        document.getElementById(
            "invoiceItemsContainer"
        );


    if (!container) {
        return;
    }


    if (
        container.children.length === 0
    ) {

        addInvoiceItemRow();

    }

}


function addInvoiceItemRow() {

    const container =
        document.getElementById(
            "invoiceItemsContainer"
        );


    if (!container) {
        return;
    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "invoice-item-row";


    row.style.cssText = `

        display:grid;
        grid-template-columns:
        2fr 1fr auto;
        gap:10px;
        margin-bottom:10px;
        align-items:end;

    `;


    row.innerHTML = `

        <div>

            <label>
                Kifaa
            </label>

            <select
                class="invoice-item-select"
            >

                <option value="">
                    Chagua Kifaa
                </option>

                ${itemsData.map(
                    item => `

                        <option
                            value="${escapeHTML(
                                item["Item ID"]
                            )}"
                        >

                            ${escapeHTML(
                                item["Jina"]
                            )}
                            -
                            ${formatMoney(
                                item["Bei"]
                            )}

                        </option>

                    `
                ).join("")}

            </select>

        </div>


        <div>

            <label>
                Kiasi
            </label>

            <input
                type="number"
                class="invoice-item-qty"
                min="1"
                value="1"
            >

        </div>


        <button
            type="button"
            class="btn btn-outline remove-invoice-item"
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    container.appendChild(
        row
    );


    const select =
        row.querySelector(
            ".invoice-item-select"
        );


    const qty =
        row.querySelector(
            ".invoice-item-qty"
        );


    const remove =
        row.querySelector(
            ".remove-invoice-item"
        );


    select.addEventListener(
        "change",
        calculateInvoiceTotal
    );


    qty.addEventListener(
        "input",
        calculateInvoiceTotal
    );


    remove.addEventListener(
        "click",
        () => {

            row.remove();

            calculateInvoiceTotal();

        }
    );


    calculateInvoiceTotal();

}


/* ==================================================
   CALCULATE INVOICE
================================================== */

function calculateInvoiceTotal() {

    let subtotal = 0;


    document
        .querySelectorAll(
            ".invoice-item-row"
        )
        .forEach(
            row => {

                const select =
                    row.querySelector(
                        ".invoice-item-select"
                    );


                const qty =
                    row.querySelector(
                        ".invoice-item-qty"
                    );


                if (
                    select &&
                    select.value
                ) {

                    const item =
                        itemsData.find(
                            i =>
                                String(
                                    i["Item ID"]
                                ) ===
                                String(
                                    select.value
                                )
                        );


                    if (item) {

                        subtotal +=
                            (
                                Number(
                                    item["Bei"]
                                ) || 0
                            ) *
                            (
                                Number(
                                    qty.value
                                ) || 0
                            );

                    }

                }

            }
        );


    const labour =
        Number(
            document.getElementById(
                "invoiceLabour"
            )?.value
        ) || 0;


    const discount =
        Number(
            document.getElementById(
                "invoiceDiscount"
            )?.value
        ) || 0;


    const total =
        Math.max(
            0,
            subtotal +
            labour -
            discount
        );


    const totalInput =
        document.getElementById(
            "invoiceTotal"
        );


    if (totalInput) {

        totalInput.value =
            formatMoney(
                total
            );

    }

}


/* ==================================================
   PAYMENT FORM
================================================== */

function setupPaymentForm() {

    const button =
        document.getElementById(
            "recordPaymentButton"
        );


    const card =
        document.getElementById(
            "paymentFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelPaymentButton"
        );


    const form =
        document.getElementById(
            "paymentForm"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";

                populateInvoiceSelects();

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const data = {

                    invoiceNo:
                        document.getElementById(
                            "paymentInvoice"
                        ).value,

                    kiasi:
                        document.getElementById(
                            "paymentAmount"
                        ).value,

                    njia:
                        document.getElementById(
                            "paymentMethod"
                        ).value

                };


                try {

                    await api(
                        "recordPayment",
                        data
                    );


                    showToast(
                        "Malipo yamehifadhiwa.",
                        "success"
                    );


                    form.reset();


                    card.style.display =
                        "none";


                    await loadPayments();

                    await loadInvoices();

                    await loadDashboard();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   STAFF FORM
================================================== */

function setupStaffForm() {

    const button =
        document.getElementById(
            "addStaffButton"
        );


    const card =
        document.getElementById(
            "staffFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelStaffButton"
        );


    const form =
        document.getElementById(
            "staffForm"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const data = {

                    jina:
                        document.getElementById(
                            "staffName"
                        ).value.trim(),

                    simu:
                        document.getElementById(
                            "staffPhone"
                        ).value.trim(),

                    kiasi:
                        document.getElementById(
                            "staffRate"
                        ).value

                };


                try {

                    await api(
                        "addStaff",
                        data
                    );


                    showToast(
                        "Fundi ameongezwa.",
                        "success"
                    );


                    form.reset();


                    card.style.display =
                        "none";


                    await loadStaff();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   EXPENSE FORM
================================================== */

function setupExpenseForm() {

    const button =
        document.getElementById(
            "addExpenseButton"
        );


    const card =
        document.getElementById(
            "expenseFormCard"
        );


    const cancel =
        document.getElementById(
            "cancelExpenseButton"
        );


    const form =
        document.getElementById(
            "expenseForm"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                card.style.display =
                    "block";

                populateStaffSelect();

                populateInvoiceSelects();

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            () => {

                card.style.display =
                    "none";

                form.reset();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const data = {

                    project:
                        document.getElementById(
                            "expenseProject"
                        ).value.trim(),

                    aina:
                        document.getElementById(
                            "expenseType"
                        ).value.trim(),

                    sehemu:
                        document.getElementById(
                            "expenseLocation"
                        ).value.trim(),

                    fundi:
                        getSelectText(
                            "expenseStaff"
                        ),

                    siku:
                        document.getElementById(
                            "expenseDays"
                        ).value,

                    malazi:
                        document.getElementById(
                            "expenseAccommodation"
                        ).value,

                    usafiri:
                        document.getElementById(
                            "expenseTransport"
                        ).value,

                    chakula:
                        document.getElementById(
                            "expenseFood"
                        ).value,

                    vifaa:
                        document.getElementById(
                            "expenseEquipment"
                        ).value,

                    mengine:
                        document.getElementById(
                            "expenseOther"
                        ).value,

                    budget:
                        document.getElementById(
                            "expenseBudget"
                        ).value,

                    labourCharge:
                        document.getElementById(
                            "expenseLabourCharge"
                        ).value,

                    invoiceNo:
                        document.getElementById(
                            "expenseInvoice"
                        ).value

                };


                try {

                    await api(
                        "addExpense",
                        data
                    );


                    showToast(
                        "Matumizi yamehifadhiwa.",
                        "success"
                    );


                    form.reset();


                    card.style.display =
                        "none";


                    await loadExpenses();

                    await loadDashboard();

                    await loadReports();


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                }

            }
        );

    }

}


/* ==================================================
   SELECTS
================================================== */

function populateCustomerSelect() {

    const select =
        document.getElementById(
            "invoiceCustomer"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Chagua Mteja
        </option>

    `;


    customersData.forEach(
        customer => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer["Jina"];


            option.textContent =
                customer["Jina"] +
                " - " +
                customer["Simu"];


            select.appendChild(
                option
            );

        }
    );

}


function populateInvoiceSelects() {

    const selects = [

        document.getElementById(
            "paymentInvoice"
        ),

        document.getElementById(
            "expenseInvoice"
        )

    ];


    selects.forEach(
        select => {

            if (!select) {
                return;
            }


            const current =
                select.value;


            const firstText =
                select.id ===
                "paymentInvoice"
                    ? "Chagua Invoice"
                    : "Chagua Invoice";


            select.innerHTML = `

                <option value="">
                    ${firstText}
                </option>

            `;


            invoicesData.forEach(
                invoice => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        invoice["Invoice No"];


                    option.textContent =
                        invoice["Invoice No"] +
                        " - " +
                        invoice["Mteja"] +
                        " - " +
                        formatMoney(
                            invoice["Total Charges"]
                        );


                    select.appendChild(
                        option
                    );

                }
            );


            if (current) {

                select.value =
                    current;

            }

        }
    );

}


function populateStaffSelect() {

    const select =
        document.getElementById(
            "expenseStaff"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Chagua Fundi
        </option>

    `;


    staffData.forEach(
        staff => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                staff["Staff ID"];


            option.textContent =
                staff["Jina"];


            select.appendChild(
                option
            );

        }
    );

}


function getSelectText(
    id
) {

    const select =
        document.getElementById(
            id
        );


    if (!select) {
        return "";
    }


    const option =
        select.options[
            select.selectedIndex
        ];


    return option
        ? option.textContent
        : "";

}


/* ==================================================
   SEARCH
================================================== */

function setupSearch() {

    const customerSearch =
        document.getElementById(
            "customerSearch"
        );


    const itemSearch =
        document.getElementById(
            "itemSearch"
        );


    const invoiceSearch =
        document.getElementById(
            "invoiceSearch"
        );


    if (customerSearch) {

        customerSearch.addEventListener(
            "input",
            () => {

                const term =
                    customerSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    customersData.filter(
                        customer =>
                            Object.values(
                                customer
                            )
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                term
                            )
                    );


                renderCustomers(
                    filtered
                );

            }
        );

    }


    if (itemSearch) {

        itemSearch.addEventListener(
            "input",
            () => {

                const term =
                    itemSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    itemsData.filter(
                        item =>
                            Object.values(
                                item
                            )
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                term
                            )
                    );


                renderItems(
                    filtered
                );

            }
        );

    }


    if (invoiceSearch) {

        invoiceSearch.addEventListener(
            "input",
            () => {

                const term =
                    invoiceSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    invoicesData.filter(
                        invoice =>
                            Object.values(
                                invoice
                            )
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                term
                            )
                    );


                renderInvoices(
                    filtered
                );

            }
        );

    }

}


/* ==================================================
   DATE
================================================== */

function updateCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (!element) {
        return;
    }


    const now =
        new Date();


    element.textContent =
        now.toLocaleDateString(
            "sw-TZ",
            {

                weekday:
                    "long",

                year:
                    "numeric",

                month:
                    "long",

                day:
                    "numeric"

            }
        );

}


/* ==================================================
   MONEY
================================================== */

function formatMoney(
    value
) {

    const amount =
        Number(
            value
        ) || 0;


    return (
        "TZS " +
        amount.toLocaleString(
            "en-US"
        )
    );

}


/* ==================================================
   DATE FORMAT
================================================== */

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        "sw-TZ",
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"

        }
    );

}


/* ==================================================
   HTML ESCAPE
================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
   TOAST
================================================== */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    if (!toast) {
        return;
    }


    toastMessage.textContent =
        message;


    if (
        type === "error"
    ) {

        toastIcon.className =
            "fa-solid fa-circle-exclamation";

    } else {

        toastIcon.className =
            "fa-solid fa-circle-check";

    }


    toast.style.display =
        "block";


    clearTimeout(
        window.kashombaToastTimer
    );


    window.kashombaToastTimer =
        setTimeout(
            () => {

                toast.style.display =
                    "none";

            },
            4000
        );

}
