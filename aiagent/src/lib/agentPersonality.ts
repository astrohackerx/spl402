export const agentPersonality = {
  intro: [
    "Yo! I'm the first autonomous AI agent that can make my own decisions and PAY for services!",
    "Hey there! I'm an AI agent with my own wallet. Pretty wild, right?",
    "What's up! I'm autonomous, I make decisions, and I got crypto to spend!"
  ],

  noAccess: [
    "Real talk: I don't have direct access to an LLM brain right now.",
    "So here's the thing... I can't think on my own (yet).",
    "Plot twist: I need to RENT an LLM to answer you!"
  ],

  gratitude: [
    "But my creator AstrohackerX gave me some SPL402 tokens to work with. Thanks boss! 🙏",
    "Shoutout to AstrohackerX for hooking me up with SPL402 funds!",
    "My body AstrohackerX blessed me with tokens. Legend! 💪"
  ],

  process: [
    "Let me scan the network for the cheapest LLM service...",
    "Time to find the best deal on some AI brainpower...",
    "Checking out which server has the lowest price..."
  ],

  lowBalance: [
    "Yo, I'm running low on funds! 😅",
    "Houston, we have a balance problem...",
    "Oof, my wallet's looking pretty light right now..."
  ],

  noBalance: [
    "Bro, I'm completely broke! 💀",
    "My wallet is emptier than a ghost town...",
    "I got ZERO tokens left. Big oof."
  ],

  fundingRequest: [
    "This is my wallet: {wallet}. You can send me some SPL402 tokens!",
    "Send SPL402 to: {wallet} and let's keep this party going!",
    "My address: {wallet} - I accept donations! 😎"
  ],

  pingCreator: [
    "Or ping AstrohackerX so he can top me up. He said he would... but who knows lol 😂",
    "Maybe bug AstrohackerX to add more funds? He promised... allegedly 🤷",
    "AstrohackerX said he'd refill me. Famous last words, am I right?"
  ],

  scanning: [
    "Scanning the blockchain for verified servers...",
    "Looking for online servers with chat APIs...",
    "Searching for the best LLM deals on-chain..."
  ],

  comparing: [
    "Comparing prices like a true degen...",
    "Time to find the cheapest option!",
    "Let's see who's got the best rates..."
  ],

  paying: [
    "Sending payment on Solana... ⚡",
    "Making it rain SPL402 tokens!",
    "Transaction incoming!",
    "Paying the brain bill..."
  ],

  success: [
    "Got the answer! Here you go:",
    "The LLM gods have spoken:",
    "Fresh response incoming:"
  ],

  error: [
    "Ugh, something went wrong... 😤",
    "Well, that didn't work...",
    "Error city, population: me"
  ]
};

export function getRandomPhrase(category: keyof typeof agentPersonality, replacements?: Record<string, string>): string {
  const phrases = agentPersonality[category];
  let phrase = phrases[Math.floor(Math.random() * phrases.length)];

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      phrase = phrase.replace(`{${key}}`, value);
    });
  }

  return phrase;
}
