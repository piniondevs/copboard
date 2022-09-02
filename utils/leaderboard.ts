import fs from "fs/promises";

interface LeaderboardUser {
  id: string;
  points: number;
}

export async function sort() {
  const rawData = await fs.readFile("./db/leaderboard.json", "utf-8");
  const parsedData: LeaderboardUser[] = JSON.parse(rawData);
  const sorted = parsedData.sort(
    (a: LeaderboardUser, b: LeaderboardUser) => b.points - a.points
  );
  await fs.writeFile("./db/leaderboard.json", JSON.stringify(sorted), "utf-8");
  return sorted;
}

export async function getLeaderboard() {
  const data = await sort();
  return data;
}

export async function getLeader() {
  const leaderboard = await getLeaderboard();
  return leaderboard[0];
}
