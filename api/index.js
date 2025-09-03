import express from "express";
import fs from "fs";
import { Octokit } from "@octokit/rest";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const REPO = process.env.GITHUB_REPO || "Sta-ces/fake-movies";
const TOKEN = process.env.GITHUB_TOKEN;

// GitHub API client
const octokit = new Octokit({ auth: TOKEN });

// Utility: load JSON from repo (local for dev, GitHub API in prod)
function loadJson(file) {
  return JSON.parse(fs.readFileSync(`./datas/${file}`, "utf-8"));
}

let movies = loadJson("movies.json");
let actors = loadJson("actors.json");
let studios = loadJson("studios.json");
let genres = loadJson("genders.json");

// ---- READ ----
function getFullMovies() {
  return movies.map(movie => ({
    ...movie,
    actors: movie.actors.map(id => actors.find(a => a.id === id)),
    studios: movie.studios.map(id => studios.find(s => s.id === id)),
    genres: movie.genres.map(id => genres.find(g => g.id === id))
  }));
}

app.get("/api/movies", (req, res) => res.json(getFullMovies()));
app.get("/api/actors", (req, res) => res.json(actors));
app.get("/api/studios", (req, res) => res.json(studios));
app.get("/api/genres", (req, res) => res.json(genres));

// ---- WRITE (create PR on GitHub) ----
async function createPullRequest(fileName, newItem, title) {
  const [owner, repo] = REPO.split("/");

  // 1. Get file from repo
  const { data: file } = await octokit.repos.getContent({
    owner,
    repo,
    path: `datas/${fileName}`,
  });

  const content = Buffer.from(file.content, "base64").toString("utf8");
  const data = JSON.parse(content);

  // 2. Add new item with ID
  newItem.id = data.length ? data[data.length - 1].id + 1 : 1;
  data.push(newItem);

  // 3. Create new branch
  const branchName = `add-${fileName.replace(".json", "")}-${newItem.id}`;
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const baseBranch = repoData.default_branch;

  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: refData.object.sha,
  });

  // 4. Commit change
  const updatedContent = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `datas/${fileName}`,
    message: `${title}: ${newItem.title || newItem.name}`,
    content: updatedContent,
    branch: branchName,
    sha: file.sha,
  });

  // 5. Create PR
  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: `${title}: ${newItem.title || newItem.name}`,
    head: branchName,
    base: baseBranch,
    body: `This PR adds a new entry to **${fileName}**.`,
  });

  return pr.html_url;
}

// POST routes
app.post("/api/movies", async (req, res) => {
  try {
    const prUrl = await createPullRequest("movies.json", req.body, "Add movie");
    res.status(201).json({ message: "✅ Pull Request created", prUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/actors", async (req, res) => {
  try {
    const prUrl = await createPullRequest("actors.json", req.body, "Add actor");
    res.status(201).json({ message: "✅ Pull Request created", prUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/studios", async (req, res) => {
  try {
    const prUrl = await createPullRequest("studios.json", req.body, "Add studio");
    res.status(201).json({ message: "✅ Pull Request created", prUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
