import express from "express";
import fetchData from "../utils/fetchData.js";

const router = express.Router();

function searchForDate(arr, start, end) {
  const items = arr.filter((book) => {
    const bookDate = new Date(book.datePublished);
    return bookDate >= start && bookDate <= end;
  });
  return items;
}
function searchFeatured(arr, isFeatured) {
  const items = arr.filter((book) => {
    return book.featured === isFeatured;
  });

  return items;
}
router.get("/", (req, res) => {
  try {
    let response = [];
    let isAll = true;
    const data = fetchData("../data/books.json", "books");
    let { startDate = null, endDate = null, isFeatured = null } = req.query;

    // date is provided then fetch based on it
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(500).json({ error: "Invalid date format" });
      }
      if (start > end) {
        return res
          .status(500)
          .json({ error: "Start date must be before end date" });
      }
      isAll = false;
      const items = searchForDate(data, start, end);
      response = [...items];
    }
    // if there's a isFeatured query
    if (isFeatured !== null) {
      isAll = false;
      if (isFeatured === "false") {
        isFeatured = false;
      } else if (isFeatured === "true") {
        isFeatured = true;
      } else {
        return;
      }
      const items = searchFeatured(data, isFeatured);
      response = [...response, ...items];
    }
    // no search query then fetch all books.
    if (!isAll) {
      res.json(response);
      return;
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ response: "Error while fetching from file", error });
  }
});

router.get("/toprated", (_, res) => {
  const data = fetchData("../data/books.json", "books");
  const toprated = data
    .map((book) => ({
      ...book,
      score: book.rating * book.reviewCount,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json(toprated);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const data = fetchData("../data/books.json", "books");
  const item = data.find((book) => {
    return book.id === id;
  });

  if (!item) {
    res.json({ response: "No data found" });
    return;
  }

  res.json(item);
});

router.get("/:id/review", (req, res) => {
  const { id } = req.params;

  const data = fetchData("../data/reviews.json", "reviews");
  const item = data.filter((review) => {
    return review.bookId === id;
  });

  res.json(item);
});

router.get("/:id/review/:review_id", (req, res) => {
  const { id, review_id } = req.params;

  const data = fetchData("../data/reviews.json", "reviews");
  const item = data.filter((review) => {
    return review.bookId === id;
  });

  const review = item.find((review) => review.id === review_id);
  if (!review) {
    res.json({ response: "No data found" });
    return;
  }
  res.json(review);
});

export default router;
