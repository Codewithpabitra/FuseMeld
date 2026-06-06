import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

// Singleton - model loads once, reused for all requests
let extractor: FeatureExtractionPipeline | null = null;

const getExtractor = async (): Promise<FeatureExtractionPipeline> => {
  if (!extractor) {
    console.log("⏳ Loading embedding model (first time only)...");
    // This model is ~23MB, downloads once then cached locally
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Embedding model ready");
  }
  return extractor;
};

// Convert a single text string into a vector
export const embedText = async (text: string): Promise<number[]> => {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  // output.data is a Float32Array - convert to plain number[]
  return Array.from(output.data as Float32Array);
};

// Embed multiple texts - processes them one by one
// (batching is possible but adds complexity for MVP)
export const embedMany = async (texts: string[]): Promise<number[][]> => {
  const vectors: number[][] = [];

  for (const text of texts) {
    const vector = await embedText(text);
    vectors.push(vector);
  }

  return vectors;
};

// Prepare issue text for embedding
// Combining title + body gives better semantic results than title alone
export const prepareIssueText = (title: string, body: string | null): string => {
  const cleanBody = body
    ? body
        .replace(/```[\s\S]*?```/g, "") // strip code blocks
        .replace(/!\[.*?\]\(.*?\)/g, "") // strip images
        .replace(/\[.*?\]\(.*?\)/g, "") // strip links
        .slice(0, 512) // cap length
        .trim()
    : "";

  return `${title}. ${cleanBody}`.trim();
};