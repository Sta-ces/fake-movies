# 🎬 Fake Movies API

**Fake Movies** is an **open-source project** that provides a **fictional movie database** (movies, actors, studios, genres) accessible through a **free and public REST API**.  
The goal is to give developers and students an easy way to test, experiment, or practice with a cinema-like API, without any commercial restrictions.

---

## 🚀 Features

- Data stored in **JSON files** and fully version-controlled on GitHub.  
- **Public REST API** to access all data.  
- Online forms to submit new movies, actors, and studios.  
- New submissions are handled through **automatic Pull Requests** on GitHub, keeping everything open-source.  
- A simple frontend to:  
  - Display movies  
  - Filter results  
  - Add new entries  

---

## 🌍 API Endpoints

### Movies
GET /api/movies
Returns all movies with their related actors, studios, and genres.

### Actors
GET /api/actors

### Studios
GET /api/studios

### Genres
GET /api/genres

### Add a Movie
POST /api/movies
Content-Type: application/json

{
"title": "Fake Adventure",
"year": 2025,
"poster": "posters/fake_adventure.jpg",
"actors": [1, 2],
"studios": [1],
"genres": [3]
}

👉 This request creates a **Pull Request** on GitHub with the new entry.

---

## 🖥️ Frontend

The project includes a static frontend (`index.html`) hosted via **GitHub Pages**, which allows users to:  
- Browse movies  
- Add new movies, actors, and studios through forms  
- Interact directly with the API  

---

## 🤝 Contributing

Contributions are welcome!  
1. **Fork** this repository  
2. Create a new branch:  
   ```bash
   git checkout -b add-new-feature
3. Add your changes (data or code)  
4. Open a **Pull Request**  

⚠️ Submissions via the web forms will also generate Pull Requests automatically.

---

## 🛠️ Local Development

### Backend
```bash
# Clone the project
git clone https://github.com/Sta-ces/fake-movies.git
cd fake-movies

# Install dependencies
npm install

# Start the local server
npm run dev

### Frontend
Simply open `public/index.html` in your browser.

---

## 📜 License

This project is licensed under the **GNU GPL-3.0 License**.  
You are free to use, modify, and redistribute this project.  
However, any modifications or derivative works must remain under the same license.  

📌 In other words: this project will remain **100% open-source forever**.

---

## ✨ Authors

- [Cédric Staces](https://github.com/Sta-ces) – Project Creator  
- Community contributors – thank you for making this project grow 🚀
