// Worksheet content: all questions, expected answers, and the explanation
// shown after grading (matching "inform them how you arrived at that
// answer before they proceed"). Answer keys confirmed against the user's
// source PDFs and answer sheets — see PROJECT_STATUS.md.
//
// type: "numberSet" | "integer" | "fraction" | "pairSet" | "yesNo" | "manual"
// "manual" = facilitator marks each group correct/incorrect themselves
// (open-ended reasoning or the dice-drawing bonus — not auto-gradable).

const WORKSHEETS = [
  {
    title: "Worksheet 1 — Rolling 1 Die Once",
    subtitle: "Case: Probability of getting a 6",
    questions: [
      {
        text: "What numbers can appear on a die?",
        hint: "List them all.",
        type: "numberSet",
        expected: [1, 2, 3, 4, 5, 6],
        explanation: "A standard die has 6 faces, numbered 1 through 6.",
      },
      {
        text: 'How many of these numbers are "6"?',
        type: "integer",
        expected: 1,
        explanation: "Only one face shows a 6 — there's exactly one \"6\" among the numbers 1-6.",
      },
      {
        text: "What is the probability of rolling a 6?",
        hint: "Apply the formula: favorable outcomes ÷ total outcomes.",
        type: "fraction",
        expected: 1 / 6,
        expectedDisplay: "1/6",
        explanation: "Probability = favorable outcomes ÷ total outcomes = 1 ÷ 6 = 1/6.",
      },
      {
        text: "Bonus thinking: if you roll the die 30 times, how many 6s do you expect?",
        type: "integer",
        expected: 5,
        explanation: "Expected count = probability × number of rolls = (1/6) × 30 = 5.",
      },
    ],
  },
  {
    title: "Worksheet 2 — Two Dice Rolled Together Once",
    subtitle: "Case: Probability of getting two 6s",
    questions: [
      {
        text: "How many total combinations can two dice make?",
        hint: "Think: 6 choices × 6 choices.",
        type: "integer",
        expected: 36,
        explanation: "Each die has 6 faces, and the dice are independent, so total combinations = 6 × 6 = 36.",
      },
      {
        text: "How many combinations give (6,6)?",
        type: "integer",
        expected: 1,
        explanation: "Only one combination gives (6,6) — both dice must show 6 at the same time.",
      },
      {
        text: "Write the probability of getting two 6s.",
        type: "fraction",
        expected: 1 / 36,
        expectedDisplay: "1/36",
        explanation: "Probability = 1 ÷ 36 = 1/36.",
      },
      {
        text: "True or False: rolling two 6s is more likely than rolling one 6.",
        type: "yesNo",
        expected: false,
        explanation: "False — rolling two 6s is less likely than rolling one 6.",
      },
      {
        text: "Why? (rolling two 6s vs. rolling one 6)",
        type: "manual",
        explanation: "1/36 is a much smaller fraction than 1/6, so two 6s together is rarer.",
      },
      {
        text: "Bonus: draw the pair of dice showing 6 and 6.",
        type: "manual",
        explanation: "Two dice, each showing a 6.",
      },
    ],
  },
  {
    title: "Worksheet 3 — Two Dice Rolled Together",
    subtitle: "Case: Probability that the numbers add to 7",
    questions: [
      {
        text: "List all pairs of numbers that add to 7.",
        hint: "Example: 1+6 = 7.",
        type: "pairSet",
        expected: [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]],
        explanation: "The six pairs that add to 7 are: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1.",
      },
      {
        text: "How many pairs did you find?",
        type: "integer",
        expected: 6,
        explanation: "There are 6 such pairs.",
      },
      {
        text: "Write the probability that the numbers add to 7.",
        type: "fraction",
        expected: 6 / 36,
        expectedDisplay: "6/36 = 1/6",
        explanation: "Probability = 6 ÷ 36 = 1/6.",
      },
      {
        text: "Bonus challenge: why do you think 7 is the most common sum?",
        type: "manual",
        explanation: "7 has more pairs (6 combinations) than any other sum, so it has the highest probability.",
      },
    ],
  },
  {
    title: "Worksheet 4 — At Least One Die Shows a 6",
    subtitle: "Case: Probability that at least one die shows a 6",
    questions: [
      {
        text: "List all outcomes where the first die shows 6.",
        hint: "Write like this: 6-1, 6-2 …",
        type: "pairSet",
        expected: [[6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]],
        explanation: "6-1, 6-2, 6-3, 6-4, 6-5, 6-6 — six outcomes where the first die shows 6.",
      },
      {
        text: "List all outcomes where the second die shows 6.",
        type: "pairSet",
        expected: [[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]],
        explanation: "1-6, 2-6, 3-6, 4-6, 5-6, 6-6 — six outcomes where the second die shows 6.",
      },
      {
        text: "Did you list (6,6) twice?",
        type: "yesNo",
        expected: true,
        explanation: "Yes — (6,6) appears in both lists, so it's counted twice if you just add 6 + 6.",
      },
      {
        text: "Total unique outcomes with at least one 6:",
        type: "integer",
        expected: 11,
        explanation: "6 + 6 = 12 total mentions, but (6,6) is repeated once, so unique outcomes = 12 − 1 = 11.",
      },
      {
        text: "Write the probability of at least one die showing a 6.",
        type: "fraction",
        expected: 11 / 36,
        expectedDisplay: "11/36",
        explanation: "Probability = 11 ÷ 36.",
      },
    ],
  },
];

const GROUP_COUNT = 4;
