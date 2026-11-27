import { NextResponse } from "next/server";
import corpus from "../../../../docs/catalogues/corpus.json";
import searchIndex from "../../../../docs/catalogues/index.json";

export const runtime = "nodejs";

type Passage = {
  document_id: string;
  title: string;
  course: string;
  chapter?: string;
  page?: number;
  section?: string;
  content: string;
  source_path: string;
  validation_status: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLocaleLowerCase("fr");
  const passages = searchIndex.passages as Passage[];
  const results = query.length >= 2
    ? passages.filter((item) =>
        [item.title, item.course, item.chapter || "", item.section || "", item.content]
          .join(" ")
          .toLocaleLowerCase("fr")
          .includes(query)
      ).slice(0, 30)
    : [];

  return NextResponse.json({
    catalog: corpus,
    search: {
      query,
      indexedPassages: passages.length,
      results,
      status: passages.length ? "ready" : "empty",
      message: passages.length
        ? (results.length ? "Résultats issus des passages indexés." : "Aucun passage correspondant dans le corpus indexé.")
        : "La bibliothèque est initialisée, mais aucun support source n'a encore été validé et indexé."
    }
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}
