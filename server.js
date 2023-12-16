import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

// In-memory data store
let posts = []; // Make sure this is declared if you're not using an external API for persistence
let postOrder = []; // Keep track of the last ID assigned

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Function to apply the custom order to the posts
function applyOrderToPosts() {
  if (postOrder.length > 0) {
    posts.sort((a, b) => postOrder.indexOf(a.id) - postOrder.indexOf(b.id));
  }
}

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});




// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Task", submit: "Create Task" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Task",
      submit: "Update Task",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});


// Route to reorder posts
app.post("/api/posts/reorder", (req, res) => {
  const { order } = req.body;
  postsOrder = order; // Update the stored order
  res.json({ message: 'Order updated successfully.' });
});



// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});