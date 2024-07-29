document.addEventListener('DOMContentLoaded', () => {
    const accountNameInput = document.getElementById('account-name');
    const addAccountButton = document.getElementById('add-account');
    const addAccountBtn = document.getElementById('add-account-btn');
    const viewBalanceBtn = document.getElementById('view-balance-btn');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeSourceInput = document.getElementById('income-source');
    const incomeAccountSelect = document.getElementById('income-account');
    const addIncomeButton = document.getElementById('add-income');
    const viewIncomeHistoryButton = document.getElementById('view-income-history');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseSourceInput = document.getElementById('expense-source');
    const expenseAccountSelect = document.getElementById('expense-account');
    const addExpenseButton = document.getElementById('add-expense');
    const viewExpenseHistoryButton = document.getElementById('view-expense-history');
    const recentTransactionsDiv = document.getElementById('recent-transactions');
    const viewAllButton = document.getElementById('view-all');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const container = document.querySelector('.container');

    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
    let showingAllTransactions = false;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Switch to Bright Mode';
    } else {
        darkModeToggle.textContent = 'Switch to Dark Mode';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        isDarkMode = !isDarkMode;
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
        darkModeToggle.textContent = isDarkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode';
    });

    addAccountBtn.addEventListener('click', () => {
        accountNameInput.classList.toggle('hidden');
        addAccountButton.classList.toggle('hidden');
    });

    addAccountButton.addEventListener('click', () => {
        const accountName = accountNameInput.value.trim();
        if (accountName && !accounts[accountName]) {
            accounts[accountName] = 0;
            updateAccountSelects();
            accountNameInput.value = '';
            saveData();
        }
    });

    addIncomeButton.addEventListener('click', () => {
        const amount = parseFloat(incomeAmountInput.value.trim());
        const source = incomeSourceInput.value.trim();
        const account = incomeAccountSelect.value;

        if (!isNaN(amount) && amount > 0 && source && account) {
            const income = { amount, source, account };
            incomes.push(income);
            accounts[account] += amount;
            updateRecentTransactions();
            incomeAmountInput.value = '';
            incomeSourceInput.value = '';
            saveData();
        }
    });

    addExpenseButton.addEventListener('click', () => {
        const amount = parseFloat(expenseAmountInput.value.trim());
        const source = expenseSourceInput.value.trim();
        const account = expenseAccountSelect.value;

        if (!isNaN(amount) && amount > 0 && source && account && accounts[account] >= amount) {
            const expense = { amount, source, account };
            expenses.push(expense);
            accounts[account] -= amount;
            updateRecentTransactions();
            expenseAmountInput.value = '';
            expenseSourceInput.value = '';
            saveData();
        }
    });

    function updateAccountSelects() {
        incomeAccountSelect.innerHTML = '';
        expenseAccountSelect.innerHTML = '';
        for (let account in accounts) {
            const option = document.createElement('option');
            option.value = account;
            option.textContent = account;
            incomeAccountSelect.appendChild(option.cloneNode(true));
            expenseAccountSelect.appendChild(option);
        }
    }

    function updateRecentTransactions() {
        recentTransactionsDiv.innerHTML = '';
        const allTransactions = [...incomes, ...expenses].sort((a, b) => b.date - a.date);
        const transactionsToShow = showingAllTransactions ? allTransactions : allTransactions.slice(0, 3);

        transactionsToShow.forEach(transaction => {
            const div = document.createElement('div');
            if (transaction.amount > 0) {
                div.textContent = `Income ${transaction.source} ${transaction.amount} rupees`;
            } else {
                div.textContent = `Expense ${transaction.source} ${-transaction.amount} rupees`;
            }
            recentTransactionsDiv.appendChild(div);
        });

        viewAllButton.textContent = showingAllTransactions ? 'Show Less' : 'View ALL';
    }

    viewAllButton.addEventListener('click', () => {
        showingAllTransactions = !showingAllTransactions;
        updateRecentTransactions();
    });

    function saveData() {
        localStorage.setItem('incomes', JSON.stringify(incomes));
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    updateAccountSelects();
    updateRecentTransactions();
});
