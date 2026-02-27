#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Keyword dictionaries (weighted toward journal/emotion domain) ---

const POSITIVE_WORDS = new Set([
  // Strong positive
  "amazing", "incredible", "wonderful", "fantastic", "excellent", "brilliant",
  "thrilled", "ecstatic", "overjoyed", "euphoric", "elated", "blissful",
  "love", "loved", "loving", "adore", "cherish",
  "celebrate", "celebrated", "celebration", "promotion", "achievement",
  // Moderate positive
  "happy", "glad", "pleased", "delighted", "cheerful", "joyful", "joyous",
  "grateful", "thankful", "blessed", "fortunate", "lucky",
  "excited", "enthusiasm", "passionate", "inspired", "motivated",
  "peaceful", "calm", "serene", "relaxed", "content", "satisfied",
  "confident", "proud", "accomplished", "succeeded", "success",
  "fun", "enjoy", "enjoyed", "enjoyable", "laugh", "laughed", "laughing",
  "beautiful", "gorgeous", "lovely", "perfect", "great", "good", "nice",
  "progress", "improved", "better", "growth", "hopeful", "optimistic",
  "friend", "friends", "friendship", "family", "together", "connection",
  // Light positive
  "okay", "fine", "alright", "decent", "comfortable", "steady",
]);

const NEGATIVE_WORDS = new Set([
  // Strong negative
  "terrible", "horrible", "awful", "dreadful", "miserable", "devastating",
  "depressed", "depression", "hopeless", "despair", "desperate",
  "furious", "enraged", "livid", "hate", "hated", "hatred",
  "panic", "terrified", "horrified",
  // Moderate negative
  "sad", "unhappy", "upset", "disappointed", "frustrated", "annoyed",
  "angry", "anxious", "anxiety", "worried", "nervous", "stressed",
  "scared", "afraid", "fearful", "dread", "dreading",
  "lonely", "alone", "isolated", "homesick", "missing",
  "tired", "exhausted", "drained", "burned", "burnout", "overwhelmed",
  "failed", "failure", "mistake", "regret", "regretted", "guilt", "guilty",
  "hurt", "pain", "painful", "suffering", "struggled", "struggling",
  "boring", "bored", "monotonous", "stuck", "lost",
  "conflict", "argument", "fight", "tension", "pressure", "deadline",
  // Light negative
  "difficult", "tough", "hard", "challenging", "uncertain", "confused",
]);

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  const foundPositive = [];
  const foundNegative = [];
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      foundPositive.push(word);
      positiveScore++;
    }
    if (NEGATIVE_WORDS.has(word)) {
      foundNegative.push(word);
      negativeScore++;
    }
  }

  const total = positiveScore + negativeScore;
  let sentiment;
  let score;

  if (total === 0) {
    sentiment = "neutral";
    score = 0;
  } else if (positiveScore > 0 && negativeScore > 0) {
    const ratio = (positiveScore - negativeScore) / total;
    if (Math.abs(ratio) < 0.2) {
      sentiment = "mixed";
    } else {
      sentiment = ratio > 0 ? "positive" : "negative";
    }
    score = Math.round(ratio * 100) / 100;
  } else if (positiveScore > 0) {
    sentiment = "positive";
    score = Math.min(positiveScore / Math.max(words.length * 0.1, 1), 1);
    score = Math.round(score * 100) / 100;
  } else {
    sentiment = "negative";
    score = -Math.min(negativeScore / Math.max(words.length * 0.1, 1), 1);
    score = Math.round(score * 100) / 100;
  }

  return {
    sentiment,
    score,
    keywords: [...new Set([...foundPositive, ...foundNegative])],
  };
}

// --- MCP Server ---

const server = new McpServer({
  name: "sentiment",
  version: "1.0.0",
});

server.tool(
  "sentiment",
  "Analyze the sentiment of journal entry text. Returns polarity (positive/negative/neutral/mixed), a score from -1 to 1, and detected keywords.",
  {
    text: z.string().describe("The text to analyze for sentiment"),
  },
  async ({ text }) => {
    const result = analyzeSentiment(text);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
