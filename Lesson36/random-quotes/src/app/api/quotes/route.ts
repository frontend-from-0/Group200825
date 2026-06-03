import { Collections, getDb } from '@/lib/db';
import { Quote } from '@/types/quotes';

export async function GET () {

  const db = await getDb();
  const col = db.collection<Quote>(Collections.quotes);
  const query = { adminApproved: true };
  const quotes = await col.find(query).toArray();

  return Response.json({ quotes });
}