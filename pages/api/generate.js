import fs from 'fs'
import path from 'path'
import { Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const getBasePrompt = () => {
    const fileDirectory = path.join(process.cwd(), "assets")
    const fileName = "base-prompt.txt";
    const fullPath = path.join(fileDirectory, fileName);
    return fs.readFileSync(fullPath, 'utf8');
}

const generateAction = async (req, res) => {
    // Run first prompt
    const basePromptPrefix = getBasePrompt();
    const prompt = basePromptPrefix
        + `\nNow, write me a Soviet joke about ${req.body.userInput}.`
        + " Again, please mimic the style of the examples as much as possible."
        + " Make sure to make fun of some USSR concepts such as Stalin, Khrushchev, Brezhnev, Gorbachev, KGB, etc."
        + "\n\n-- Joke --";
    console.log("API: " + prompt);

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.8,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput});
}

export default generateAction;