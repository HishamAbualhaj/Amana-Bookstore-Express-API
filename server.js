import express from "express";

import router from "./routes/books.js";
import writeFile from "./utils/writeFile.js";

const app = express();

app.use(express.json());

app.use("/books", router);

app.post("/addBook", (req, res) => {
  const newBook = req.body;

  const id = Math.ceil(Math.random() * 100);

  try {
    writeFile({ id: String(id), ...newBook }, "../data/books.json", "books");

    res.status(201).json({
      message: "Book added successfully!",
      book: newBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while adding new book",
    });
  }
});
app.post("/addReview", (req, res) => {
  const newReview = req.body;

  const id = Math.ceil(Math.random() * 100);

  try {
    writeFile(
      { id: String(id), ...newReview },
      "../data/reviews.json",
      "reviews"
    );

    res.status(201).json({
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while adding new review",
    });
  }
});

app.get("/", (req, res) => {
  console.log("first express app");
  res.json(books.books);
});

app.listen(5000, () => {
  console.log(`🚀 Server is running`);
});
