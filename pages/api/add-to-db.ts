import Certificate from "@/models/Certificate.model";

export default async function handler(req: any, res: any) {
  const body = req.body as Certificate;

  const url =
    process.env.SEMANTIC_SEARCH_HOST +
    "/index";
    
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((_res) => _res.json());

  res.json({
    answer: resp.answer,
  });
}
