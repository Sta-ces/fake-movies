async function handleForm(formId, endpoint) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch(`https://fake-movies.vercel.app/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || result.error);
  });
}

handleForm("movieForm", "movies");
handleForm("actorForm", "actors");
handleForm("studioForm", "studios");
