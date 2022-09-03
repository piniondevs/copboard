import fs from "fs/promises";

interface Request {
  lore: string;
  proposedRating: number;
  actualRatings:  { id: string; rating: number }[] | [];
}

export async function addRequest(request: Request) {
  const raw = await fs.readFile('./db/requests.json', 'utf-8');
  const oldData = JSON.parse(raw);
  const newData = [...oldData, request];
  await fs.writeFile('./db/requests.json', JSON.stringify(newData), 'utf-8');
  return newData;
} 