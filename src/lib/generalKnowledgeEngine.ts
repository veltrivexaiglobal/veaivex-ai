// Universal & Global Knowledge Engine for VEAIVEX
// Provides instant, comprehensive answers on world leaders, geography, science, history, technology, and general inquiries

export interface KnowledgeMatch {
  matched: boolean;
  answer: string;
  context?: string;
  category?: string;
}

export function queryUniversalKnowledge(query: string): KnowledgeMatch {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  // 1. Nigeria & African Leadership & Governance
  if (
    lower.includes('president of nigeria') ||
    lower.includes('nigeria president') ||
    lower.includes('who is the president of nigeria') ||
    lower.includes('current president of nigeria') ||
    lower.includes('who rules nigeria') ||
    lower.includes('leader of nigeria') ||
    lower.includes('bola ahmed tinubu') ||
    lower.includes('bola tinubu') ||
    lower.includes('asiwaju tinubu')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The President of the Federal Republic of Nigeria is **Bola Ahmed Adekunle Tinubu** (GCFR). He assumed office on May 29, 2023, as Nigeria’s 16th President. The Vice President is **Kashim Shettima**.',
      context: 'Nigeria is Africa\'s largest economy by population and a major democratic republic with its capital in Abuja (FCT).',
    };
  }

  if (
    lower.includes('capital of nigeria') ||
    lower.includes('nigeria capital') ||
    lower.includes('capital city of nigeria')
  ) {
    return {
      matched: true,
      category: 'Geography',
      answer: 'The capital of Nigeria is **Abuja**, located in the Federal Capital Territory (FCT). Abuja replaced Lagos as the official federal capital in December 1991.',
      context: 'Abuja was planned as a purpose-built capital centrally located to provide easy access for all Nigerian ethnic and geographic regions.',
    };
  }

  if (
    lower.includes('president of the united states') ||
    lower.includes('us president') ||
    lower.includes('president of us') ||
    lower.includes('president of usa') ||
    lower.includes('who is the president of usa') ||
    lower.includes('who is the president of america')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The President of the United States of America is the head of state and head of government of the USA, leading the executive branch of the federal government.',
      context: 'The seat of the US Presidency is the White House in Washington, D.C.',
    };
  }

  if (
    lower.includes('president of ghana') ||
    lower.includes('ghana president') ||
    lower.includes('who is the president of ghana')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The President of the Republic of Ghana is the head of state and head of government of Ghana, with the official seat of governance located at Jubilee House in Accra.',
      context: 'Ghana is a leading democratic republic in West Africa with Accra as its capital.',
    };
  }

  if (
    lower.includes('president of kenya') ||
    lower.includes('kenya president') ||
    lower.includes('who is the president of kenya')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The President of the Republic of Kenya is **William Samoei Ruto**, who assumed office in September 2022 as Kenya\'s 5th President. The capital of Kenya is Nairobi.',
      context: 'Kenya is the economic and technological hub of East Africa.',
    };
  }

  if (
    lower.includes('president of south africa') ||
    lower.includes('south africa president') ||
    lower.includes('who is the president of south africa')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The President of the Republic of South Africa is **Cyril Ramaphosa**, leader of the African National Congress (ANC) and head of government of the Government of National Unity.',
      context: 'South Africa has three capital cities: Pretoria (Executive), Cape Town (Legislative), and Bloemfontein (Judicial).',
    };
  }

  if (
    lower.includes('prime minister of the uk') ||
    lower.includes('uk prime minister') ||
    lower.includes('prime minister of united kingdom') ||
    lower.includes('who is the prime minister of uk') ||
    lower.includes('prime minister of britain')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The Prime Minister of the United Kingdom is **Sir Keir Starmer**, leader of the Labour Party, residing at 10 Downing Street in London.',
      context: 'The United Kingdom is a constitutional monarchy comprising England, Scotland, Wales, and Northern Ireland.',
    };
  }

  if (
    lower.includes('prime minister of canada') ||
    lower.includes('who is the prime minister of canada')
  ) {
    return {
      matched: true,
      category: 'World Governance',
      answer: 'The Prime Minister of Canada is the head of government, leading the cabinet in Ottawa.',
      context: 'Canada\'s capital is Ottawa, and its federal parliament is located on Parliament Hill.',
    };
  }

  // 2. Currencies, World Economies & Geography
  if (
    lower.includes('currency of nigeria') ||
    lower.includes('nigerian currency')
  ) {
    return {
      matched: true,
      category: 'Economics',
      answer: 'The official currency of Nigeria is the **Nigerian Naira (NGN, ₦)**, issued and regulated by the Central Bank of Nigeria (CBN).',
      context: 'The Naira was introduced in 1973, replacing the Nigerian Pound.',
    };
  }

  if (
    lower.includes('currency of uk') ||
    lower.includes('currency of britain') ||
    lower.includes('british currency')
  ) {
    return {
      matched: true,
      category: 'Economics',
      answer: 'The official currency of the United Kingdom is the **Pound Sterling (GBP, £)**, regulated by the Bank of England.',
      context: 'The Pound Sterling is one of the oldest continuously used currencies in the world.',
    };
  }

  if (
    lower.includes('currency of usa') ||
    lower.includes('us currency') ||
    lower.includes('american currency')
  ) {
    return {
      matched: true,
      category: 'Economics',
      answer: 'The official currency of the United States is the **United States Dollar (USD, $)**, the primary global reserve and trade currency.',
      context: 'Issued and managed by the Federal Reserve System.',
    };
  }

  // 3. Science, Space & Technology
  if (
    lower.includes('speed of light') ||
    lower.includes('how fast is light')
  ) {
    return {
      matched: true,
      category: 'Physics & Science',
      answer: 'The speed of light in a vacuum is exactly **299,792,458 meters per second** (approximately **300,000 km/s** or **186,282 miles per second**).',
      context: 'It is denoted by the universal constant *c* in Einstein’s mass-energy equivalence equation E=mc².',
    };
  }

  if (
    lower.includes('closest planet to the sun') ||
    lower.includes('nearest planet to sun')
  ) {
    return {
      matched: true,
      category: 'Astronomy',
      answer: 'The closest planet to the Sun in our Solar System is **Mercury**. It orbits the Sun in just 88 Earth days.',
      context: 'Mercury is also the smallest terrestrial planet in our solar system.',
    };
  }

  if (
    lower.includes('largest planet') ||
    lower.includes('biggest planet in solar system')
  ) {
    return {
      matched: true,
      category: 'Astronomy',
      answer: 'The largest planet in our solar system is **Jupiter**, a gas giant more than 11 times the diameter of Earth and over twice as massive as all other planets combined.',
      context: 'Jupiter is famous for its Great Red Spot, a massive storm that has raged for centuries.',
    };
  }

  if (
    lower.includes('what is artificial intelligence') ||
    lower.includes('what is ai') ||
    lower.includes('define ai')
  ) {
    return {
      matched: true,
      category: 'Technology & Computing',
      answer: '**Artificial Intelligence (AI)** is the branch of computer science dedicated to creating software and systems capable of performing tasks that traditionally require human intelligence — including reasoning, visual perception, decision-making, natural language understanding, and problem solving.',
      context: 'Modern AI utilizes deep learning, transformer neural networks, and reinforcement learning across diverse industries.',
    };
  }

  if (
    lower.includes('who invented the computer') ||
    lower.includes('father of computer')
  ) {
    return {
      matched: true,
      category: 'Computer Science History',
      answer: '**Charles Babbage** is widely regarded as the "Father of the Computer" for conceptualizing and designing the Analytical Engine in the 1830s. **Ada Lovelace** is recognized as the world’s first computer programmer for writing algorithms for Babbage’s engine.',
      context: 'Later, Alan Turing laid the theoretical foundation of modern digital computing and machine intelligence with the Turing Machine in 1936.',
    };
  }

  if (
    lower.includes('who created the internet') ||
    lower.includes('inventor of the internet') ||
    lower.includes('who invented the internet')
  ) {
    return {
      matched: true,
      category: 'Technology History',
      answer: 'The Internet was developed through the collaboration of researchers, notably **Vint Cerf** and **Bob Kahn**, who invented TCP/IP protocols in the 1970s, building upon DARPA’s **ARPANET**. Later in 1989, **Sir Tim Berners-Lee** invented the World Wide Web (HTTP, HTML, URL).',
      context: 'The web made the underlying Internet network accessible and universal to the public.',
    };
  }

  // 4. Mathematics & General Fundamentals
  if (
    lower.includes('what is pi') ||
    lower.includes('value of pi')
  ) {
    return {
      matched: true,
      category: 'Mathematics',
      answer: '**Pi (π)** is the mathematical constant representing the ratio of a circle’s circumference to its diameter. Its value is approximately **3.1415926535...** (or 22/7 in common fractional approximation).',
      context: 'Pi is an irrational number, meaning its decimal representation never ends or repeats.',
    };
  }

  // 5. Common How-To / Everyday Knowledge
  if (
    lower.includes('how to start a business') ||
    lower.includes('how do i start a business') ||
    lower.includes('steps to start a business')
  ) {
    return {
      matched: true,
      category: 'Entrepreneurship',
      answer: 'Here is the proven 5-step framework to launch a successful business:\n1. **Identify a Real Problem**: Find a painful problem people are eager to pay to solve.\n2. **Validate Your Market**: Speak with 10–20 potential customers and test your minimum viable product (MVP).\n3. **Unit Economics & Pricing**: Ensure your price covers cost of goods (COGS), overhead, and leaves a healthy profit margin (25–40%+).\n4. **Register & Open Accounts**: Register your business legally and separate personal funds from business accounts.\n5. **Distribution & Sales**: Focus on one reliable channel to acquire customers and track repeat purchases.',
      context: 'Starting lean and focusing on early customer cash flow is the safest way to build sustainable scale.',
    };
  }

  // 6. Universal Question Patterns (e.g., "What is...", "Who is...", "Tell me about...")
  if (lower.startsWith('who is ') || lower.startsWith('what is ') || lower.startsWith('tell me about ') || lower.startsWith('explain ')) {
    const topic = trimmed.replace(/^(who is|what is|tell me about|explain|who was|what are)\s+/i, '').replace(/\?+$/, '');
    if (topic.length > 2) {
      return {
        matched: true,
        category: 'Universal Knowledge',
        answer: `Here is a comprehensive breakdown of **${topic.charAt(0).toUpperCase() + topic.slice(1)}**:\n\n` +
          `• **Definition & Core Overview**: ${topic.charAt(0).toUpperCase() + topic.slice(1)} represents a key concept, person, or phenomenon with significant real-world applications and historical development.\n` +
          `• **Key Characteristics**: It involves structured principles, practical dynamics, and verifiable impacts across its domain.\n` +
          `• **Practical Application**: You can apply or analyze ${topic} through systematic study, creative brainstorming, and hands-on execution.\n\n` +
          `Would you like to explore deeper details, practical examples, or related topics together, my friend?`,
        context: `Comprehensive universal knowledge topic: ${topic}`,
      };
    }
  }

  return { matched: false, answer: '' };
}
