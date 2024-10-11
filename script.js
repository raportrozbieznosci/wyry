document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const app = document.getElementById('app');
    const logoutButton = document.getElementById('logoutButton');
    const employeeForm = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');
    const filterName = document.getElementById('filterName');
    const filterDate = document.getElementById('filterDate');
    const employeeBulk = document.getElementById('employeeBulk');
    const bulkDate = document.getElementById('bulkDate');
    const bulkAddButton = document.getElementById('bulkAddButton');
    const exportButton = document.getElementById('exportButton');
    const importFile = document.getElementById('importFile');
    const importButton = document.getElementById('importButton');

    // Administrator credentials
    const admin = { username: 'admin', password: 'raport' };
    let employees = []; // Zmienna do przechowywania pracowników

    // Funkcja do pobierania pracowników z bazy danych
    function fetchEmployees() {
        fetch('https://wyry.vercel.app/api/data') // Upewnij się, że tu wpisujesz odpowiedni URL
            .then(response => response.json())
            .then(data => {
                employees = data; // Zaktualizuj listę pracowników z bazy
                renderEmployees(filterName.value, filterDate.value);
            })
            .catch(error => console.error('Błąd podczas pobierania danych:', error));
    }

    // Wysyłanie danych do serwera
    document.getElementById('sendButton').addEventListener('click', () => {
        const value = document.getElementById('inputValue').value;

        fetch('https://wyry.vercel.app/api/data', { // Upewnij się, że tu wpisujesz odpowiedni URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Dane wysłane na serwer:', data);
            fetchEmployees(); // Odśwież listę pracowników po dodaniu
        })
        .catch(error => console.error('Błąd podczas wysyłania danych:', error));
    });

    const renderEmployees = (nameFilter = '', dateFilter = '') => {
        employeeList.innerHTML = '';
        // Sort employees by date
        employees.sort((a, b) => new Date(a.date) - new Date(b.date));
        employees
            .filter(employee => employee.name.toLowerCase().includes(nameFilter.toLowerCase()))
            .filter(employee => !dateFilter || employee.date === dateFilter)
            .forEach((employee, index) => {
                const li = document.createElement('li');
                li.textContent = `${employee.name} - ${employee.date}`;
                
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edytuj';
                editBtn.classList.add('edit-btn');
                editBtn.addEventListener('click', () => {
                    const newName = prompt('Edytuj imię i nazwisko:', employee.name);
                    const newDate = prompt('Edytuj datę zatrudnienia:', employee.date);
                    if (newName && newDate) {
                        // Aktualizacja pracownika w bazie danych
                        fetch(`https://wyry.vercel.app/api/data/${employee._id}`, { // Przykład URL z ID
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ name: newName, date: newDate })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Zaktualizowany pracownik:', data);
                            fetchEmployees(); // Odśwież listę pracowników
                        })
                        .catch(error => console.error('Błąd podczas aktualizacji:', error));
                    }
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Usuń';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.addEventListener('click', () => {
                    // Usunięcie pracownika z bazy danych
                    fetch(`https://wyry.vercel.app/api/data/${employee._id}`, { // Przykład URL z ID
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Usunięty pracownik:', data);
                        fetchEmployees(); // Odśwież listę pracowników
                    })
                    .catch(error => console.error('Błąd podczas usuwania:', error));
                });

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                employeeList.appendChild(li);
            });
    };

    const checkLoginStatus = () => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
            loginForm.style.display = 'none';
            app.style.display = 'block';
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === admin.username && password === admin.password) {
            alert('Zalogowano jako administrator');
            localStorage.setItem('loggedIn', 'true');
            loginForm.style.display = 'none';
            app.style.display = 'block';
            fetchEmployees(); // Ładowanie pracowników po zalogowaniu
        } else {
            alert('Nieprawidłowa nazwa użytkownika lub hasło');
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        app.style.display = 'none';
        loginForm.style.display = 'block';
    });

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('employeeName').value;
        const date = document.getElementById('hireDate').value;
        fetch('https://wyry.vercel.app/api/data', { // Upewnij się, że tu wpisujesz odpowiedni URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, date })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dodany pracownik:', data);
            fetchEmployees(); // Odśwież listę pracowników po dodaniu
            document.getElementById('employeeName').value = ''; // Reset input
        })
        .catch(error => console.error('Błąd podczas dodawania pracownika:', error));
    });

    bulkAddButton.addEventListener('click', () => {
        const bulkData = employeeBulk.value.split('\n');
        const date = bulkDate.value;
        bulkData.forEach(line => {
            const name = line.trim();
            if (name && date) {
                fetch('https://wyry.vercel.app/api/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, date })
                })
                .then(response => response.json())
                .then(data => console.log('Dodano pracownika w partii:', data))
                .catch(error => console.error('Błąd podczas dodawania pracownika w partii:', error));
            }
        });
        fetchEmployees(); // Odśwież listę pracowników
        employeeBulk.value = ''; // Wyczyść pole tekstowe
    });

    filterName.addEventListener('input', () => {
        renderEmployees(filterName.value, filterDate.value);
    });

    filterDate.addEventListener('input', () => {
        renderEmployees(filterName.value, filterDate.value);
    });

    exportButton.addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8," + employees.map(e => `${e.name},${e.date}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    importButton.addEventListener('click', () => {
        const file = importFile.files[0]; // Poprawka: tylko pierwszy plik
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const importedEmployees = text.split('\n').map(line => {
                    const [name, date] = line.split(',').map(item => item.trim());
                    return { name, date };
                });
                Promise.all(importedEmployees.map(employee => {
                    return fetch('https://wyry.vercel.app/api/data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application
