document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const addAccountBtn = document.getElementById('add-account-btn');
    const addAccountInput = document.getElementById('account-name');
    const addAccount = document.getElementById('add-account');
    const viewBalanceBtn = document.getElementById('view-balance-btn');
    const incomeAccountSelect = document.getElementById('income-account');
    const expenseAccountSelect = document.getElementById('expense-account');
    const addIncomeBtn = document.getElementById('add-income');
    const addExpenseBtn = document.getElementById('add-expense');
    const recentTransactionsDiv = document.getElementById('recent-transactions');
    const viewAllBtn = document.getElementById('view-all');

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

    const saveData = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    };

    const updateAccountSelect = () => {
        incomeAccountSelect.innerHTML = '';
        expenseAccountSelect.innerHTML = '';
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = account.name;
            incomeAccountSelect.appendChild(option);
            expenseAccountSelect.appendChild(option);
        });
    };

    const updateRecentTransactions = () => {
        recentTransactionsDiv.innerHTML = '';
        const recentTransactions = transactions.slice(-3);
        recentTransactions.forEach(transaction => {
            const p = document.createElement('p');
            p.textContent = `${transaction.type} ${transaction.amount} rupees to/from ${transaction.account}`;
            recentTransactionsDiv.appendChild(p);
        });
        if (transactions.length > 3) {
            viewAllBtn.classList.remove('hidden');
        } else {
            viewAllBtn.classList.add('hidden');
        }
    };

    const updateBalances = () => {
        let totalBalance = 0;
        accounts.forEach(account => {
            totalBalance += account.balance;
        });

        const balancesDiv = document.createElement('div');
        balancesDiv.id = 'balances';
        balancesDiv.innerHTML = `<p>Total Balance: ${totalBalance} rupees</p>`;
        accounts.forEach(account => {
            const p = document.createElement('p');
            p.textContent = `${account.name} Balance: ${account.balance} rupees`;
            balancesDiv.appendChild(p);
        });

        document.body.appendChild(balancesDiv);
    };

    const toggleDarkMode = () => {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = 'Switch to Bright Mode';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.textContent = 'Switch to Dark Mode';
        }
        saveData();
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Switch to Bright Mode';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = 'Switch to Dark Mode';
    }

    addAccountBtn.addEventListener('click', () => {
        addAccountInput.classList.toggle('hidden');
        addAccount.classList.toggle('hidden');
    });

    addAccount.addEventListener('click', () => {
        const accountName = addAccountInput.value.trim();
        if (accountName !== '') {
            accounts.push({ name: accountName, balance: 0 });
            addAccountInput.value = '';
            updateAccountSelect();
            saveData();
        }
    });

    addIncomeBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('income-amount').value);
        const source = document.getElementById('income-source').value.trim();
        const accountName = incomeAccountSelect.value;
        if (!isNaN(amount) && amount > 0 && source !== '' && accountName !== '') {
            const account = accounts.find(acc => acc.name === accountName);
            account.balance += amount;
            transactions.push({ type: 'Income', amount, source, account: accountName });
            updateRecentTransactions();
            saveData();
        }
    });

    addExpenseBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const source = document.getElementById('expense-source').value.trim();
        const accountName = expenseAccountSelect.value;
        if (!isNaN(amount) && amount > 0 && source !== '' && accountName !== '') {
            const account = accounts.find(acc => acc.name === accountName);
            account.balance -= amount;
            transactions.push({ type: 'Expense', amount, source, account: accountName });
            updateRecentTransactions();
            saveData();
        }
    });

    viewBalanceBtn.addEventListener('click', () => {
        const existingBalancesDiv = document.getElementById('balances');
        if (existingBalancesDiv) {
            existingBalancesDiv.remove();
        }
        updateBalances();
    });

    viewAllBtn.addEventListener('click', () => {
        recentTransactionsDiv.innerHTML = '';
        transactions.forEach(transaction => {
            const p = document.createElement('p');
            p.textContent = `${transaction.type} ${transaction.amount} rupees to/from ${transaction.account}`;
            recentTransactionsDiv.appendChild(p);
        });
    });

    updateAccountSelect();
    updateRecentTransactions();
    saveData();
});

