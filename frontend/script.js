/****************************************************
 * KASHOMBA ELECTRICAL
 * FRONTEND APPLICATION
 *
 * CONNECTION:
 * Google Apps Script -> Code.gs
 * Database -> Google Sheets
 ****************************************************/


/* ==================================================
   GLOBAL STATE
================================================== */

const APP = {

    customers: [],

    items: [],

    invoices: [],

    payments: [],

    staff: [],

    expenses: [],

    dashboard: null,

    loading: false

};


/* ==================================================
   INITIALIZE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    setCurrentDate();

    initializeNavigation();

    initializeMobileSidebar();

    initializeQuickActions();

    initializeSearch();

    initializeButtons();

    loadDashboard();

}


/* ==================================================
   GOOGLE APPS SCRIPT API
================================================== */


/**
 * Call backend function safely.
 *
 * Mfano:
 *
 * api("getCustomers")
 *
 * api("addCustomer", {
 *     jina: "John",
 *     simu: "0712345678"
 * })
 */
function api(functionName, data = {}) {

    return new Promise(
        (resolve, reject) => {

            if (
                typeof google === "undefined" ||
                !google.script ||
                !google.script.run
            ) {

                reject(
                    new Error(
                        "Google Apps Script environment haipatikani."
                    )
                );

                return;

            }


            const runner =
                google.script.run

                    .withSuccessHandler(
                        resolve
                    )

                    .withFailureHandler(
                        error => {

                            reject(
                                new Error(
                                    error &&
                                    error.message
                                        ? error.message
                                        : String(error)
                                )
                            );

                        }
                    );


            if (
                data &&
                Object.keys(data).length > 0
            ) {

                runner[functionName](
                    data
                );

            }

            else {

                runner[functionName]();

            }

        }
    );

}


/* ==================================================
   DATE
================================================== */

function setCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (!element) return;


    const now =
        new Date();


    element.textContent =
        now.toLocaleDateString(
            "sw-TZ",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* ==================================================
   NAVIGATION
================================================== */

function initializeNavigation() {

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


                    if (!page) return;


                    showPage(page);

                }
            );

        }
    );

}


function showPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    pages.forEach(
        page => {

            page.classList.remove(
                "active-page"
            );

        }
    );


    links.forEach(
        link => {

            link.classList.remove(
                "active"
            );

        }
    );


    const targetPage =
        document.getElementById(
            `page-${pageName}`
        );


    const targetLink =
        document.querySelector(
            `.nav-link[data-page="${pageName}"]`
        );


    if (targetPage) {

        targetPage.classList.add(
            "active-page"
        );

    }


    if (targetLink) {

        targetLink.classList.add(
            "active"
        );

    }


    updatePageHeader(
        pageName
    );


    closeMobileSidebar();


    /*
     * Load data when user opens page.
     */

    switch (pageName) {

        case "dashboard":

            loadDashboard();

            break;


        case "customers":

            loadCustomers();

            break;


        case "items":

            loadItems();

            break;


        case "invoices":

            loadInvoices();

            break;


        case "payments":

            loadPayments();

            break;


        case "staff":

            loadStaff();

            break;


        case "expenses":

            loadExpenses();

            break;


        case "reports":

            loadReports();

            break;

    }

}


/* ==================================================
   PAGE HEADERS
================================================== */

function updatePageHeader(pageName) {

    const title =
        document.getElementById(
            "pageTitle"
        );


    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const pageInfo = {

        dashboard: {

            title: "Dashboard",

            subtitle:
                "Muhtasari wa shughuli za ofisi"

        },


        customers: {

            title: "Wateja",

            subtitle:
                "Ongeza na simamia taarifa za wateja"

        },


        invoices: {

            title: "Invoice",

            subtitle:
                "Tengeneza na simamia invoices"

        },


        items: {

            title: "Vifaa",

            subtitle:
                "Catalog ya vifaa na bei"

        },


        payments: {

            title: "Malipo",

            subtitle:
                "Rekodi na fuatilia malipo"

        },


        staff: {

            title: "Wafanyakazi",

            subtitle:
                "Simamia mafundi na viwango vyao"

        },


        expenses: {

            title: "Matumizi",

            subtitle:
                "Simamia gharama za projects"

        },


        reports: {

            title: "Ripoti",

            subtitle:
                "Ripoti za biashara na fedha"

        }

    };


    const info =
        pageInfo[pageName];


    if (!info) return;


    if (title) {

        title.textContent =
            info.title;

    }


    if (subtitle) {

        subtitle.textContent =
            info.subtitle;

    }

}


/* ==================================================
   MOBILE SIDEBAR
================================================== */

function initializeMobileSidebar() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    const closeButton =
        document.getElementById(
            "sidebarClose"
        );


    if (
        menuToggle &&
        sidebar &&
        overlay
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                sidebar.classList.add(
                    "open"
                );

                overlay.classList.add(
                    "active"
                );

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMobileSidebar
        );

    }

}


function closeMobileSidebar() {

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
   QUICK ACTIONS
================================================== */

function initializeQuickActions() {

    const buttons =
        document.querySelectorAll(
            "[data-page]"
        );


    buttons.forEach(
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

                    const page =
                        button.dataset.page;


                    if (page) {

                        showPage(page);

                    }

                }
            );

        }
    );

}


/* ==================================================
   BUTTONS
================================================== */

function initializeButtons() {


    const addCustomerBtn =
        document.getElementById(
            "addCustomerBtn"
        );


    if (addCustomerBtn) {

        addCustomerBtn.addEventListener(
            "click",
            addCustomer
        );

    }


    const addItemBtn =
        document.getElementById(
            "addItemBtn"
        );


    if (addItemBtn) {

        addItemBtn.addEventListener(
            "click",
            addItem
        );

    }


    const addStaffBtn =
        document.getElementById(
            "addStaffBtn"
        );


    if (addStaffBtn) {

        addStaffBtn.addEventListener(
            "click",
            addStaff
        );

    }


    const addExpenseBtn =
        document.getElementById(
            "addExpenseBtn"
        );


    if (addExpenseBtn) {

        addExpenseBtn.addEventListener(
            "click",
            addExpense
        );

    }


    const createInvoiceBtn =
        document.getElementById(
            "createInvoiceBtn"
        );


    if (createInvoiceBtn) {

        createInvoiceBtn.addEventListener(
            "click",
            createInvoice
        );

    }


    const paymentBtn =
        document.getElementById(
            "recordPaymentBtn"
        );


    if (paymentBtn) {

        paymentBtn.addEventListener(
            "click",
            recordPayment
        );

    }


    const refreshReports =
        document.getElementById(
            "refreshReports"
        );


    if (refreshReports) {

        refreshReports.addEventListener(
            "click",
            loadReports
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


        APP.dashboard =
            stats;


        updateDashboardStats(
            stats
        );


        await loadRecentInvoices();


    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        showError(
            "Imeshindikana kupakia Dashboard."
        );

    }

}


function updateDashboardStats(
    stats
) {

    setText(
        "statCustomers",
        formatNumber(
            stats.customers
        )
    );


    setText(
        "statInvoices",
        formatNumber(
            stats.invoices
        )
    );


    setText(
        "statPayments",
        formatMoney(
            stats.payments
        )
    );


    setText(
        "statProfit",
        formatMoney(
            stats.profit
        )
    );

}


/* ==================================================
   RECENT INVOICES
================================================== */

async function loadRecentInvoices() {

    const tbody =
        document.getElementById(
            "recentInvoices"
        );


    if (!tbody) return;


    try {

        const invoices =
            await api(
                "getInvoices"
            );


        APP.invoices =
            invoices || [];


        const recent =
            APP.invoices
                .slice()
                .reverse()
                .slice(0, 5);


        if (!recent.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="empty-state"
                    >
                        Hakuna invoice bado.
                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            recent
                .map(
                    invoice =>
                        `
                        <tr>

                            <td>
                                ${escapeHtml(
                                    getInvoiceNumber(
                                        invoice
                                    )
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    getValue(
                                        invoice,
                                        [
                                            "Mteja",
                                            "mteja"
                                        ]
                                    )
                                )}
                            </td>

                            <td>
                                ${formatMoney(
                                    getValue(
                                        invoice,
                                        [
                                            "Total Charges",
                                            "total charges"
                                        ]
                                    )
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    getValue(
                                        invoice,
                                        [
                                            "Hali",
                                            "Status"
                                        ]
                                    )
                                )}
                            </td>

                        </tr>
                        `
                )
                .join("");

    }

    catch (error) {

        console.error(
            error
        );

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >
                    Imeshindikana kupakia invoices.
                </td>

            </tr>

        `;

    }

}


/* ==================================================
   CUSTOMERS
================================================== */

async function loadCustomers() {

    const tbody =
        document.getElementById(
            "customersTable"
        );


    if (!tbody) return;


    try {

        const customers =
            await api(
                "getCustomers"
            );


        APP.customers =
            customers || [];


        renderCustomers(
            APP.customers
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            6
        );

    }

}


function renderCustomers(
    customers
) {

    const tbody =
        document.getElementById(
            "customersTable"
        );


    if (!tbody) return;


    if (!customers.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    Hakuna wateja bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        customers
            .map(
                customer =>
                    `

                    <tr>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    customer,
                                    [
                                        "Customer ID",
                                        "ID",
                                        "id"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    getValue(
                                        customer,
                                        [
                                            "Jina",
                                            "jina"
                                        ]
                                    )
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    customer,
                                    [
                                        "Simu",
                                        "simu"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    customer,
                                    [
                                        "Anwani",
                                        "anwani"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    customer,
                                    [
                                        "Email",
                                        "email"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                getValue(
                                    customer,
                                    [
                                        "Tarehe",
                                        "tarehe"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


/* ==================================================
   ADD CUSTOMER
================================================== */

async function addCustomer() {

    const jina =
        prompt(
            "Ingiza jina la mteja:"
        );


    if (!jina) return;


    const simu =
        prompt(
            "Ingiza namba ya simu:"
        );


    if (!simu) return;


    const anwani =
        prompt(
            "Ingiza anwani:"
        ) || "";


    const pobox =
        prompt(
            "Ingiza P.O. Box:"
        ) || "";


    const email =
        prompt(
            "Ingiza email:"
        ) || "";


    showLoading(
        "Inahifadhi mteja..."
    );


    try {

        const result =
            await api(
                "addCustomer",
                {
                    jina,
                    simu,
                    anwani,
                    pobox,
                    email
                }
            );


        hideLoading();


        showSuccess(
            result.message ||
            "Mteja ameongezwa."
        );


        loadCustomers();

        loadDashboard();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   ITEMS
================================================== */

async function loadItems() {

    const tbody =
        document.getElementById(
            "itemsTable"
        );


    if (!tbody) return;


    try {

        const items =
            await api(
                "getItems"
            );


        APP.items =
            items || [];


        renderItems(
            APP.items
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            4
        );

    }

}


function renderItems(
    items
) {

    const tbody =
        document.getElementById(
            "itemsTable"
        );


    if (!tbody) return;


    if (!items.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >
                    Hakuna vifaa bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        items
            .map(
                item =>
                    `

                    <tr>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    item,
                                    [
                                        "Item ID",
                                        "ID",
                                        "id"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    getValue(
                                        item,
                                        [
                                            "Jina",
                                            "jina"
                                        ]
                                    )
                                )}
                            </strong>
                        </td>

                        <td>
                            ${formatNumber(
                                getValue(
                                    item,
                                    [
                                        "Kiasi",
                                        "kiasi"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    item,
                                    [
                                        "Bei",
                                        "bei"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


async function addItem() {

    const jina =
        prompt(
            "Jina la kifaa:"
        );


    if (!jina) return;


    const kiasi =
        prompt(
            "Kiasi:"
        );


    const bei =
        prompt(
            "Bei:"
        );


    showLoading(
        "Inahifadhi kifaa..."
    );


    try {

        const result =
            await api(
                "addItem",
                {
                    jina,
                    kiasi,
                    bei
                }
            );


        hideLoading();


        showSuccess(
            result.message ||
            "Kifaa kimeongezwa."
        );


        loadItems();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   INVOICES
================================================== */

async function loadInvoices() {

    const tbody =
        document.getElementById(
            "invoicesTable"
        );


    if (!tbody) return;


    try {

        const invoices =
            await api(
                "getInvoices"
            );


        APP.invoices =
            invoices || [];


        renderInvoices(
            APP.invoices
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            5
        );

    }

}


function renderInvoices(
    invoices
) {

    const tbody =
        document.getElementById(
            "invoicesTable"
        );


    if (!tbody) return;


    if (!invoices.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    Hakuna invoices bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        invoices
            .slice()
            .reverse()
            .map(
                invoice =>
                    `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHtml(
                                    getInvoiceNumber(
                                        invoice
                                    )
                                )}
                            </strong>

                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    invoice,
                                    [
                                        "Mteja",
                                        "mteja"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                getValue(
                                    invoice,
                                    [
                                        "Tarehe",
                                        "tarehe"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    invoice,
                                    [
                                        "Total Charges",
                                        "total charges"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${statusBadge(
                                getValue(
                                    invoice,
                                    [
                                        "Hali",
                                        "Status"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


async function createInvoice() {

    const mteja =
        prompt(
            "Jina la mteja:"
        );


    if (!mteja) return;


    const jina =
        prompt(
            "Jina la kifaa:"
        );


    if (!jina) return;


    const qty =
        prompt(
            "Quantity:"
        );


    const price =
        prompt(
            "Bei ya kifaa:"
        );


    const labour =
        prompt(
            "Labour:"
        ) || 0;


    const discount =
        prompt(
            "Discount:"
        ) || 0;


    const vifaa = [

        {

            jina,

            qty:
                Number(qty) || 0,

            price:
                Number(price) || 0

        }

    ];


    showLoading(
        "Inatengeneza invoice..."
    );


    try {

        const result =
            await api(
                "createInvoice",
                {
                    mteja,

                    vifaa,

                    labour:
                        Number(labour) || 0,

                    discount:
                        Number(discount) || 0
                }
            );


        hideLoading();


        showSuccess(
            `${result.message} Invoice: ${result.invoiceNo}`
        );


        loadInvoices();

        loadDashboard();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   PAYMENTS
================================================== */

async function loadPayments() {

    const tbody =
        document.getElementById(
            "paymentsTable"
        );


    if (!tbody) return;


    try {

        const payments =
            await api(
                "getPayments"
            );


        APP.payments =
            payments || [];


        renderPayments(
            APP.payments
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            5
        );

    }

}


function renderPayments(
    payments
) {

    const tbody =
        document.getElementById(
            "paymentsTable"
        );


    if (!tbody) return;


    if (!payments.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    Hakuna malipo bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        payments
            .slice()
            .reverse()
            .map(
                payment =>
                    `

                    <tr>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    payment,
                                    [
                                        "Payment ID",
                                        "ID",
                                        "id"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    payment,
                                    [
                                        "Invoice No",
                                        "invoice no"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    payment,
                                    [
                                        "Kiasi",
                                        "kiasi"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                getValue(
                                    payment,
                                    [
                                        "Tarehe",
                                        "tarehe"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    payment,
                                    [
                                        "Njia",
                                        "njia"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


async function recordPayment() {

    const invoiceNo =
        prompt(
            "Invoice No:"
        );


    if (!invoiceNo) return;


    const kiasi =
        prompt(
            "Kiasi cha malipo:"
        );


    if (!kiasi) return;


    const njia =
        prompt(
            "Njia ya malipo: NMB, M-PESA au CASH"
        );


    if (!njia) return;


    showLoading(
        "Inahifadhi malipo..."
    );


    try {

        const result =
            await api(
                "recordPayment",
                {
                    invoiceNo,

                    kiasi:
                        Number(kiasi),

                    njia
                }
            );


        hideLoading();


        showSuccess(
            result.message ||
            "Malipo yamehifadhiwa."
        );


        loadPayments();

        loadInvoices();

        loadDashboard();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   STAFF
================================================== */

async function loadStaff() {

    const tbody =
        document.getElementById(
            "staffTable"
        );


    if (!tbody) return;


    try {

        const staff =
            await api(
                "getStaff"
            );


        APP.staff =
            staff || [];


        renderStaff(
            APP.staff
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            4
        );

    }

}


function renderStaff(
    staff
) {

    const tbody =
        document.getElementById(
            "staffTable"
        );


    if (!tbody) return;


    if (!staff.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >
                    Hakuna wafanyakazi bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        staff
            .map(
                person =>
                    `

                    <tr>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    person,
                                    [
                                        "Staff ID",
                                        "ID",
                                        "id"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    getValue(
                                        person,
                                        [
                                            "Jina",
                                            "jina"
                                        ]
                                    )
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    person,
                                    [
                                        "Simu",
                                        "simu"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    person,
                                    [
                                        "Kiwango Kwa Siku",
                                        "Kiwango kwa Siku",
                                        "Kiwango",
                                        "kiwango"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


async function addStaff() {

    const jina =
        prompt(
            "Jina la fundi:"
        );


    if (!jina) return;


    const simu =
        prompt(
            "Namba ya simu:"
        ) || "";


    const kiasi =
        prompt(
            "Kiwango kwa siku:"
        );


    showLoading(
        "Inahifadhi fundi..."
    );


    try {

        const result =
            await api(
                "addStaff",
                {
                    jina,

                    simu,

                    kiasi:
                        Number(kiasi) || 0
                }
            );


        hideLoading();


        showSuccess(
            result.message ||
            "Fundi ameongezwa."
        );


        loadStaff();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   EXPENSES
================================================== */

async function loadExpenses() {

    const tbody =
        document.getElementById(
            "expensesTable"
        );


    if (!tbody) return;


    try {

        const expenses =
            await api(
                "getExpenses"
            );


        APP.expenses =
            expenses || [];


        renderExpenses(
            APP.expenses
        );

    }

    catch (error) {

        console.error(
            error
        );

        renderError(
            tbody,
            6
        );

    }

}


function renderExpenses(
    expenses
) {

    const tbody =
        document.getElementById(
            "expensesTable"
        );


    if (!tbody) return;


    if (!expenses.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    Hakuna matumizi bado.
                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        expenses
            .slice()
            .reverse()
            .map(
                expense =>
                    `

                    <tr>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    expense,
                                    [
                                        "Expense ID",
                                        "ID",
                                        "id"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    expense,
                                    [
                                        "Project",
                                        "project"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                getValue(
                                    expense,
                                    [
                                        "Fundi",
                                        "fundi"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    expense,
                                    [
                                        "Gharama Zote-auto",
                                        "Total Cost",
                                        "total cost"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                getValue(
                                    expense,
                                    [
                                        "Faida",
                                        "profit"
                                    ]
                                )
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                getValue(
                                    expense,
                                    [
                                        "Tarehe",
                                        "tarehe"
                                    ]
                                )
                            )}
                        </td>

                    </tr>

                    `
            )
            .join("");

}


async function addExpense() {

    const project =
        prompt(
            "Project:"
        );


    if (!project) return;


    const aina =
        prompt(
            "Aina ya project:"
        ) || "";


    const fundi =
        prompt(
            "Jina la fundi:"
        ) || "";


    const sehemu =
        prompt(
            "Sehemu:"
        ) || "";


    const siku =
        prompt(
            "Idadi ya siku:"
        ) || 0;


    const malazi =
        prompt(
            "Malazi:"
        ) || 0;


    const usafiri =
        prompt(
            "Usafiri:"
        ) || 0;


    const chakula =
        prompt(
            "Chakula:"
        ) || 0;


    const vifaa =
        prompt(
            "Vifaa:"
        ) || 0;


    const mengine =
        prompt(
            "Mengine:"
        ) || 0;


    const invoiceNo =
        prompt(
            "Invoice No:"
        ) || "";


    const budget =
        prompt(
            "Budget:"
        ) || 0;


    const labourCharge =
        prompt(
            "Labour Charge:"
        ) || 0;


    showLoading(
        "Inahifadhi matumizi..."
    );


    try {

        const result =
            await api(
                "addExpense",
                {
                    project,

                    aina,

                    fundi,

                    sehemu,

                    siku:
                        Number(siku),

                    malazi:
                        Number(malazi),

                    usafiri:
                        Number(usafiri),

                    chakula:
                        Number(chakula),

                    vifaa:
                        Number(vifaa),

                    mengine:
                        Number(mengine),

                    invoiceNo,

                    budget:
                        Number(budget),

                    labourCharge:
                        Number(labourCharge)
                }
            );


        hideLoading();


        showSuccess(
            result.message ||
            "Matumizi yamehifadhiwa."
        );


        loadExpenses();

        loadDashboard();

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   REPORTS
================================================== */

async function loadReports() {

    showLoading(
        "Inapakia ripoti..."
    );


    try {

        const reports =
            await api(
                "getReports"
            );


        hideLoading();


        APP.dashboard =
            reports.dashboard;


        updateDashboardStats(
            reports.dashboard
        );


        console.log(
            "Reports:",
            reports
        );


        showSuccess(
            "Ripoti zimehuishwa."
        );

    }

    catch (error) {

        hideLoading();

        showError(
            error.message
        );

    }

}


/* ==================================================
   SEARCH
================================================== */

function initializeSearch() {

    const customerSearch =
        document.getElementById(
            "customerSearch"
        );


    if (customerSearch) {

        customerSearch.addEventListener(
            "input",
            () => {

                const query =
                    customerSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    APP.customers.filter(
                        customer =>
                            JSON.stringify(
                                customer
                            )
                            .toLowerCase()
                            .includes(query)
                    );


                renderCustomers(
                    filtered
                );

            }
        );

    }


    const itemSearch =
        document.getElementById(
            "itemSearch"
        );


    if (itemSearch) {

        itemSearch.addEventListener(
            "input",
            () => {

                const query =
                    itemSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    APP.items.filter(
                        item =>
                            JSON.stringify(
                                item
                            )
                            .toLowerCase()
                            .includes(query)
                    );


                renderItems(
                    filtered
                );

            }
        );

    }


    const invoiceSearch =
        document.getElementById(
            "invoiceSearch"
        );


    if (invoiceSearch) {

        invoiceSearch.addEventListener(
            "input",
            () => {

                const query =
                    invoiceSearch.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    APP.invoices.filter(
                        invoice =>
                            JSON.stringify(
                                invoice
                            )
                            .toLowerCase()
                            .includes(query)
                    );


                renderInvoices(
                    filtered
                );

            }
        );

    }

}


/* ==================================================
   HELPERS
================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function getValue(
    object,
    keys
) {

    if (!object) return "";


    for (const key of keys) {

        if (
            Object.prototype.hasOwnProperty.call(
                object,
                key
            )
        ) {

            return object[key];

        }

    }


    return "";

}


function getInvoiceNumber(
    invoice
) {

    return getValue(
        invoice,
        [
            "Invoice No",
            "invoice no",
            "Invoice",
            "invoice"
        ]
    );

}


function formatMoney(
    value
) {

    const number =
        Number(value) || 0;


    return (
        "TSh " +
        number.toLocaleString(
            "en-TZ"
        )
    );

}


function formatNumber(
    value
) {

    return (
        Number(value) || 0
    )
    .toLocaleString(
        "en-TZ"
    );

}


function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "sw-TZ"
    );

}


function statusBadge(
    status
) {

    const value =
        String(
            status || "UNPAID"
        )
        .toUpperCase();


    let className =
        "status-unpaid";


    if (
        value === "PAID"
    ) {

        className =
            "status-paid";

    }

    else if (
        value === "PARTIAL"
    ) {

        className =
            "status-partial";

    }


    return `

        <span class="status-badge ${className}">

            ${escapeHtml(value)}

        </span>

    `;

}


function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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


function renderError(
    tbody,
    columns
) {

    tbody.innerHTML = `

        <tr>

            <td
                colspan="${columns}"
                class="empty-state"
            >
                Imeshindikana kupakia data.
            </td>

        </tr>

    `;

}


/* ==================================================
   NOTIFICATIONS
================================================== */

function showSuccess(
    message
) {

    alert(
        "✓ " + message
    );

}


function showError(
    message
) {

    alert(
        "✕ " + message
    );

}


/* ==================================================
   LOADING
================================================== */

function showLoading(
    message = "Inapakia..."
) {

    let loader =
        document.getElementById(
            "appLoader"
        );


    if (!loader) {

        loader =
            document.createElement(
                "div"
            );


        loader.id =
            "appLoader";


        loader.innerHTML = `

            <div class="loader-box">

                <div class="spinner"></div>

                <span id="loaderText">
                    ${escapeHtml(message)}
                </span>

            </div>

        `;


        document.body.appendChild(
            loader
        );

    }


    const text =
        document.getElementById(
            "loaderText"
        );


    if (text) {

        text.textContent =
            message;

    }


    loader.classList.add(
        "show"
    );

}


function hideLoading() {

    const loader =
        document.getElementById(
            "appLoader"
        );


    if (loader) {

        loader.classList.remove(
            "show"
        );

    }

}


/* ==================================================
   GLOBAL ERROR HANDLER
================================================== */

window.addEventListener(
    "error",
    event => {

        console.error(
            "Frontend Error:",
            event.error
        );

    }
);