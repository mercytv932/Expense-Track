    const itemNameInput = document.querySelector("#itemNameInput");
    const itemAmountInput = document.querySelector("#itemAmountInput");
    const add = document.querySelector(".add");
    const inputAndBtn = document.querySelector(".inputAndBtn");
    const totalDisplay = document.querySelector("#totalDisplay");
    const listContainer = document.querySelector("#listContainer");

    let expenses = [];

    add.addEventListener("click", addExpense);

    itemAmountInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addExpense();
      }
    });

    itemNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        itemAmountInput.focus();
      }
    });

    function addExpense() {
      const name = itemNameInput.value.trim();
      const amount = Number(itemAmountInput.value);

      if (!name || !amount || amount <= 0) {
        inputAndBtn.classList.add("shake");

        setTimeout(() => {
          inputAndBtn.classList.remove("shake");
        }, 350);

        return;
      }

      const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount
      };

      expenses.push(newExpense);
      saveToStorage();
      renderExpenses();
      updateTotal();

      itemNameInput.value = "";
      itemAmountInput.value = "";
      itemNameInput.focus();
    }

    function renderExpenses() {
      listContainer.innerHTML = "";

      if (expenses.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "No expenses yet. Add your first one above.";
        listContainer.appendChild(emptyState);
        return;
      }

      expenses.forEach((expense) => {
        const renderDiv = document.createElement("div");
        renderDiv.className = "expense-item";

        const newP = document.createElement("p");
        newP.className = "expense-name";
        newP.textContent = expense.name;

        const newP1 = document.createElement("p");
        newP1.className = "expense-amount";
        newP1.textContent = `$${expense.amount.toFixed(2)}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "X";

        deleteBtn.addEventListener("click", () => {
          expenses = expenses.filter((item) => item.id !== expense.id);
          saveToStorage();
          renderExpenses();
          updateTotal();
        });

        renderDiv.appendChild(newP);
        renderDiv.appendChild(newP1);
        renderDiv.appendChild(deleteBtn);
        listContainer.appendChild(renderDiv);
      });
    }

    function updateTotal() {
      let total = 0;

      expenses.forEach((expense) => {
        total += Number(expense.amount);
      });

      totalDisplay.innerHTML = `
        <span class="total-label">Current total</span>
        <span class="total-amount">$${total.toFixed(2)}</span>
      `;
    }

    function saveToStorage() {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function loadFromStorage() {
      const storedExpenses = localStorage.getItem("expenses");

      if (storedExpenses) {
        try {
          expenses = JSON.parse(storedExpenses);
        } catch (error) {
          console.error("Error parsing expenses from localStorage:", error);
          expenses = [];
        }
      }

      renderExpenses();
      updateTotal();
    }

    loadFromStorage();