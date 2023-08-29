import { Configuration, OpenAIApi } from "openai";

const key = ""
const configuration = new Configuration({
  apiKey: key,
  organization: 'org-zb0yfSvxb00isXRZfO2zhPoS',
});

const openai = new OpenAIApi(configuration);

export const generateResponse = async (question: string): Promise<string> => {
  const options = {
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 600,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['/'],
  };

  let prompt = question 

  console.log("prompt", prompt)

  const completeOptions = {
    ...options,
    prompt: prompt,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'User-Agent': 'Your User Agent',
      },
      body: JSON.stringify(completeOptions),
    });

    const data = await response.json();
    if (data.choices) {
      return data.choices[0].text;
    } else {
      return 'Error';
    }
  } catch (error) {
    console.error(error);
    return 'Error';
  }
};
