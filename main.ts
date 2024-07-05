import { Context, Hono } from "hono";
import { ANIME } from "https://esm.sh/@consumet/extensions";
import { cors } from "hono/cors";

// Create a new instance of the Gogoanime provider
const gogoanime = new ANIME.Gogoanime();

const app = new Hono();
app.use(cors());
app.get("/", (c: Context) => c.text("Hoonoooooooo!"));
app.get("/list", async (c: Context) => {
  const query = c.req.query("p");
  let page = 0;
  if (query === null || query === undefined) page = 0;
  else if (isNaN(Number(query))) page = 0;
  else page = Number(query);
  const list = await gogoanime.fetchPopular(page);
  return c.json(list);
});
app.get("/anime/:id", async (c: Context) => {
  const id = c.req.param("id");
  const list = await gogoanime.fetchAnimeInfo(id);
  return c.json(list);
});
app.get("/search/:query", async (c: Context) => {
  const query = c.req.param("query");
  const list = await gogoanime.search(query, 0);
  return c.json(list);
});
app.get("/getsource/:episode", async (c: Context) => {
  const episode = c.req.param("episode");
  const list = await gogoanime.fetchEpisodeSources(episode);
  return c.json(list);
});

Deno.serve(app.fetch);
