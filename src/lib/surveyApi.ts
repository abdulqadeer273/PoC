// Simulate survey completion status
export const mockSurveyCheck = async (formUrl: string): Promise<boolean> => {
  // Randomly simulate whether the user completed the survey
  console.log(`Checking survey completion for ${formUrl}...`);
  await new Promise((res) => setTimeout(res, 500));
  const completed = Math.random() > 0.5;
  console.log(
    `Survey status: ${completed ? "✅ Completed" : "❌ Not completed"}`
  );
  return completed;
};
