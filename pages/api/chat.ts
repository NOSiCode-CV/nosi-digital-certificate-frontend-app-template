export default async function handler(req: any, res: any) {
  const url =
    process.env.SEMANTIC_SEARCH_HOST +
    "/search?text=" +
    req.query.query;
  const resp = await fetch(url).then((_res) => _res.json());

  res.json({
    answer: resp.answer,
  });
}
