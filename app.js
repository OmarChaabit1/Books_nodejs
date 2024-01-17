const express = require('express');
const path = require('path');
const fs = require('fs');
const{middleWareVerfication} = require('./utils')
const app = express();
const PORT = 1000;

app.use(express.json());
app.use(express.static("./static"));

// Download route
app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '/download', filename);

    // Send the file as a downloadable attachment
    res.download(filePath, `${filename}.pdf`, (err) => {
        if (err) {
            // Handle errors, e.g., file not found
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});

// Books routes
app.get("/books", (req, res) => {
    fs.readFile("./db/books.json", (err, dataFile) => {
        let books = JSON.parse(dataFile.toString()).books;
        if (err)
            return res.status(404).send("Error on the server ");
        res.status(200).json(books);
    });
});

app.post("/books", middleWareVerfication, (req, res) => {
    let { image, title, description, price } = req.body;
    fs.readFile("./db/books.json", (err, dataFile) => {
        let data = JSON.parse(dataFile.toString());
        let books = data.books;
        let booksToSave = {
            id: data.lastId,
            image,
            title,
            description,
            price
        };
        books.push(booksToSave);
        data.lastId++;
        fs.writeFile("./db/books.json", JSON.stringify(data, null, 4), (err) => {
            if (err)
                return res.status(500).send("Error on the server ");
            res.status(201).json(booksToSave);
        });
    });
});

app.delete("/books/:id", (req, res) => {
    let { id } = req.params;
    fs.readFile("./db/books.json", (err, dataFile) => {
        if (err)
            return res.status(500).send("Error on the server ");
        let data = JSON.parse(dataFile.toString());
        let books = data.books;
        let booksIndex = books.findIndex(ele => ele.id == id);
        if (booksIndex == -1)
            return res.status(404).send("Question Not Found");
        data.books = books.filter(ele => ele.id != id);
        fs.writeFile("./db/books.json", JSON.stringify(data, null, 4), (err) => {
            if (err)
                return res.status(500).send("Error on the server ");
            res.status(200).send("The book deleted successfully!");
        });

    });
});

app.put("/books/:id", middleWareVerfication, (req, res) => {
    // Handle book update logic
});

app.listen(PORT, () => {
    console.log("Server Started at :", PORT);
});
