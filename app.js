const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files (HTML, CSS, JS)
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Adhi@2002',
    database: 'invoice_management',
    port:3306
    
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database');
});

// 1. Add a customer
app.post('/addCustomer', (req, res) => {
    const { name, email, phone, address } = req.body;
    db.query('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)', 
    [name, email, phone, address], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Customer added successfully' });
    });
});

// 2. Add an invoice
app.post('/addInvoice', (req, res) => {
    const { customer_id, invoice_date } = req.body;
    db.query('INSERT INTO invoices (customer_id, invoice_date) VALUES (?, ?)', 
    [customer_id, invoice_date], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Invoice added successfully' });
    });
});

// 3. Add items to an invoice
app.post('/addItem', (req, res) => {
    const { invoice_id, item_name, item_quantity, item_price } = req.body;
    db.query('INSERT INTO invoice_items (invoice_id, item_name, item_quantity, item_price) VALUES (?, ?, ?, ?)', 
    [invoice_id, item_name, item_quantity, item_price], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Item added successfully' });
    });
});

// 4. List all customers
app.get('/listCustomers', (req, res) => {
    db.query('SELECT * FROM customers', (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// 5. List all invoices
app.get('/listInvoices', (req, res) => {
    db.query('SELECT * FROM invoices', (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// 6. List all invoices of a customer
app.get('/listInvoices/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    db.query('SELECT * FROM invoices WHERE customer_id = ?', [customerId], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// 7. Display the full details of an invoice

// Delete customer by ID
app.delete('/deleteCustomer/:id', (req, res) => {
    const customerId = req.params.id;
    const sql = 'DELETE FROM customers WHERE id = ?';
    
    db.query(sql, [customerId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Customer ${customerId} deleted successfully` });
    });
});

// Delete invoice by ID
app.delete('/deleteInvoice/:id', (req, res) => {
    const invoiceId = req.params.id;
    const sql = 'DELETE FROM invoices WHERE id = ?';
    
    db.query(sql, [invoiceId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Invoice ${invoiceId} deleted successfully` });
    });
});

// Delete item by ID
app.get('/viewInvoice/:id', (req, res) => {
    const invoiceId = req.params.id;

    const invoiceSql = 'SELECT * FROM invoices WHERE id = ?';
    const itemsSql = 'SELECT * FROM invoice_items WHERE invoice_id = ?';

    // Fetch invoice details
    db.query(invoiceSql, [invoiceId], (err, invoiceResult) => {
        if (err) throw err;

        if (invoiceResult.length > 0) {
            const invoice = invoiceResult[0];

            // Fetch items related to the invoice
            db.query(itemsSql, [invoiceId], (err, itemsResult) => {
                if (err) throw err;

                res.json({ invoice, items: itemsResult });
            });
        } else {
            res.json({ message: 'Invoice not found' });
        }
    });
});

// Delete item by ID
app.delete('/deleteItem/:id', (req, res) => {
    const itemId = req.params.id;
    const sql = 'DELETE FROM invoice_items WHERE id = ?';

    db.query(sql, [itemId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Item ${itemId} deleted successfully` });
    });
});
// Update customer by ID
app.put('/updateCustomer/:id', (req, res) => {
    const customerId = req.params.id;
    const updatedData = req.body;
    const sql = 'UPDATE customers SET ? WHERE id = ?';
    
    db.query(sql, [updatedData, customerId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Customer ${customerId} updated successfully` });
    });
});

// Update invoice by ID
app.put('/updateInvoice/:id', (req, res) => {
    const invoiceId = req.params.id;
    const updatedData = req.body;
    const sql = 'UPDATE invoices SET ? WHERE id = ?';
    
    db.query(sql, [updatedData, invoiceId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Invoice ${invoiceId} updated successfully` });
    });
});
// Fetch invoices and items based on cust
// Get all invoices and their items for a specific customer
app.get('/customerInvoices/:customerId', (req, res) => {
    const customerId = req.params.customerId;

    const sql = `
        SELECT invoices.id AS invoice_id, invoices.invoice_date, 
               invoice_items.id AS item_id, invoice_items.item_name, 
               invoice_items.item_quantity, invoice_items.item_price
        FROM invoices
        LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
        WHERE invoices.customer_id = ?
    `;

    db.query(sql, [customerId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Update item by ID
app.put('/updateItem/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedData = req.body;
    const sql = 'UPDATE invoice_items SET ? WHERE id = ?';
    
    db.query(sql, [updatedData, itemId], (err, result) => {
        if (err) throw err;
        res.json({ message: `Item ${itemId} updated successfully` });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
