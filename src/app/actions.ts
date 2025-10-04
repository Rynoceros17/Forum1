"use server";

import { automatedContentTagging, type AutomatedContentTaggingInput } from "@/ai/flows/automated-content-tagging";
import { z } from "zod";

const TaggingSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters.").max(5000, "Content must be less than 5000 characters."),
});

type SuggestionState = {
  tags?: string[];
  error?: string;
}

export async function getSuggestedTagsAction(input: AutomatedContentTaggingInput): Promise<SuggestionState> {
  const validatedFields = TaggingSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: "Content is too short or too long.",
    };
  }

  try {
    const result = await automatedContentTagging(validatedFields.data);
    return {
      tags: result.tags,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to get suggestions from AI. Please try again.",
    };
  }
}
