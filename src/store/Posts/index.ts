import { makeAutoObservable } from 'mobx';

class Posts {

  constructor() {
    makeAutoObservable(this);
    
  }

  articles: Article[] = [
    {
      id: '1',
      title: 'The Token Is The Product',
      author: 'Mark',
      authorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      date: new Date().toLocaleDateString('en-US'),
      content1: `
        <div><p>There’s an old saying in venture that says “first time founders focus on product, and second time founders focus on distribution”. This describes how product builders often expect that they can achieve growth purely thanks to the quality of their product, rather than by investing energy into creating repeatable patterns that will help them consistently attract attention and users to their product.</p>
        <p>However, there’s another element here that I believe a lot of crypto founders are missing, and that’s tokens. Crypto founders chronically overvalue the go-to-market of their products, and undervalue the go-to-market of their tokens. When I say “the token is the product” I’m not being facetious — I actually believe that for anyone trying to build a valuable company in crypto, your first and primary goal should be to attract permanent attention and liquidity to your token, AKA to sell it to anyone who will hold it for a very very long time.</p>
        <p>As anyone with eyes can see, the primary use-case for blockchains to date has been the purchase, transfer, and sale of tokens. Some applications add extra steps or metadata to these interactions, helping users construct elaborate ways to create value for themselves using the tokens in their possession. But everything we do in crypto, every hoop we jump through, every seed word we write down, is ultimately in service of an interaction which started with us buying into some token ecosystem.</p>
        <p>While there have been a small number of successful crypto projects which have achieved broad persistent distribution for their software without the help of tokens, they exist as outliers. If you were to compile a list of crypto products or protocols with &gt;100k MAU, you’ll notice the vast majority of them either already have a token, or have stated plans to eventually launch one. Crypto markets offer users increased efficiency and fairness, and so naturally it’s extremely difficult to build a sustainable competitive advantage against new entrants who will try to drive your margins down.</p>
        <p>One example here is Uniswap, who was able to maintain hegemony for a number of years thanks to their strong brand and high quality tech. Even they were eventually forced to add a token as a response to competitors like Sushi who were delivering more value back to users than just the functionality of their product, via their token. Examples like this are why I believe that on a long enough time horizon, any successful crypto product which doesn’t launch a token will eventually have their margins competed away, and/or will be beaten by competitors who <em>do</em> launch a token, and build stronger persistent network effects for themselves and their community.</p>
      `,
      content2: `
        <p>This may end up also being true of businesses outside of crypto too, in response to increasingly efficient markets driven by the proliferation of the web and AI. It’s worth noting that this closely mirrors how airlines function right now in the real world — because they operate with extremely low margins, <a href="https://www.theatlantic.com/ideas/archive/2023/09/airlines-banks-mileage-programs/675374/" rel="noreferrer" target="_blank">a majority of their value is derived from their loyalty programs</a>. Delta’s primary product is no longer flights; it’s Delta points.</p>
        <p>Looking back at crypto, the evidence seems to show that it’s possible to build wildly successful crypto projects by:</p>
        <ol>
        <li>
        <p>attracting attention and capital to yourself (and your token) in a persistent manner, and</p>
        </li>
        <li>
        <p>converting that liquid attention into valuable products for your users.</p>
        </li>
        </ol>
        <p>The best evidence that successful crypto products can be built in this specific order is Justin Sun and the TRON network— despite all of the shade people throw at their antics over the years, it’s hard not to be impressed by the real utility the network provides (as a <a href="https://defillama.com/stablecoins/chains" rel="noreferrer" target="_blank">behemoth in the stablecoin payments ecosystem</a>). He’s proven himself extremely capable in both attracting liquid attention to himself, and converting that into a real network that has already created value for millions of people. The evidence clearly shows that tokens can act as self fulfilling prophesies of their own value, where price gains can occur in advance of the value creation itself. This stands in direct opposition to the way that traditional company building/valuations work, which is why crypto remains dumbfounding to anyone not accustomed to this new paradigm.</p>
        <p>When any asset price skyrockets, people pay more attention to it — this is as true in crypto as in any other asset. However, crypto assets seem to be particularly good at converting that increased attention into an increased inherent value of the underlying network. This is because crypto networks welcome skilled contributors to their community regardless of their professional background, vs traditional organizations which are walled gardens with thin entrances. Very few non-crypto organizations are set up to take advantage of the massive inflows of attention that they might receive during reflexive price action. As a result of this, instead of just valuing crypto assets based on current and future value that the network is creating, one also needs to price in the effects that subsequent liquidity flows will have on the network’s future trajectory.</p>
        <p>People enter this ecosystem to make money via this novel business model, which offers steep rewards for those who can be early in predicting future liquidity flows and value creation. The best founders in crypto are not blind to this fact, and instead figure out a way to weaponize this inherent desire, in order to spin up valuable networks where participants are all making money thanks to the existence of the network.</p>
        <p>One prime example of this is the Helium network— they were able to attract enough liquidity to their ecosystem (via their HNT token) to provide a stable incentive for self-interested strangers to purchase miners and begin earning real profits for themselves. Through the power of token liquidity, they were able to bootstrap their network with enough miners to take on the stale mobile broadband market. Coordinating close to <a href="https://explorer.helium.com/stats" rel="noreferrer" target="_blank">400,000 users</a> to join such a network would be a daunting task without the help of deep liquidity, which provides a useful stop-gap during the early fluctuations that arise when spinning up any multi-sided marketplace. In this way the first and most important product that Helium needed to sell was their token — without it, no matter how impressive their hardware or software was, they would not have been able to attract and maintain sufficient attention to achieve the critical mass necessary to take on large incumbents.</p>
      `,
      content3: `
        <p>In tokenized products like Helium, the token’s price acts as a lowest common denominator measure of the attention flowing in/out of a given ecosystem. When token prices drop, miners churn both not only because their economics have changed, but also because of the herd mentality that exists around attention— if I see everyone else leaving the party, I’m much more likely to go as well.</p>
        <p>In this way, attracting liquidity isn’t a one-time thing that’s only important in the early stages — it remains a prerequisite throughout the continuous existence of the network, albeit a less and less important one as the community onboards sufficient native supply/demand to the network. Being able to attract consistent liquid attention to your project is not a trivial task — the strains it puts on crypto founding teams mirrors the grueling experience of being a creator on large social platforms, where even taking one day off at the wrong time can be disastrous for your growth.</p>
        <p>Nonetheless, there are some crypto founders who are both excellent technologists and terrifying meme lords, who keenly understand how attention flows and how best they can ride those waves in order to continuously drive value into their ecosystem. They create self-reinforcing positive feedback loops by consistently delivering on the promises they make to their community members, and are driven to continue innovating on their products in order to keep their users (token holders) bought in to a long-run vision of the project.</p>
        <p>Practically speaking, the art of attracting liquidity often takes many forms — for most founders the process starts with raising some small seed capital from friends &amp; family, then some more from institutional investors (with either explicit or implicit mention of the future token), followed by other pre-launch token deals, the launch itself, bounty campaigns to get the token distributed, campaigns with exchanges and market makers to provide liquidity for the token, and a myriad of other marketing techniques to raise the project’s profile within the crypto attention sphere. Importantly, they collaborate with an increasingly broad network of people who believe in their mission and join their community to help stand it up— incentivized to contribute to it thanks to their intrinsic belief in the existing network, and a token which offers steep rewards for joining early. In an ideal world, the people you’re selling your token to should be the first people who will actually use the network itself, or at the very least will champion it loudly to their audiences.</p>
        <p>Ultimately, most of the art comes down to the simple math of selling the token to as many new buyers as possible, while simultaneously doing everything possible to keep existing token holders from dumping their tokens. Sometimes this is achieved via token lockups around investments or staked tokens, sometimes it’s achieved using memes. However they do it, the best tokenized communities are skilled at playing an infinite game within an adversarial game, where strangers coordinate in times of token distress to keep the game going (ie bidding when the token dumps), despite ultimately competing with each other to exit at a higher price later on. The founders within these ecosystems are often extremely technical individuals who have achieved enough ease of self that they don’t need to be taken seriously, and impart a human element on what can otherwise become an extremely commoditized relationship with their token holders.</p>
        <p>Tokens are an extremely powerful coordination tool, and in the next decade we’re going to see an explosion of tokenized networks which will seriously challenge the institutions that still wield immense power in our lives today. Tokens are also going to save companies in commodified markets from losing their moats entirely, by letting them bank their attention and good will to spend in times of intense competitive need. This presents a massive opportunity for founders who are skilled in both technical and creative pursuits (software and memes), who are brave enough to take on massive incumbent organizations, and who have the grit to survive inevitable droughts of liquidity that will come along the way.</p>
        <p>The fact that this playbook has become so clearly understood and repeatable means that utility token networks will continue to attract large amounts of early stage investment capital, from investors who see the potential gains to be had from being early and right when betting on a founder that’s working on a suitable meme. As this market matures, I also expect we’re going to see the competition for liquid attention becoming more fierce (as we’re already witnessing within the blockspace utility token markets).</p>
        <p>Nonetheless, we at Boost remain excited about the tokenized networks that are still on their way, and we think that recent advances in wallet &amp; zk tech, combined with the ubiquity of secure blockspace, creates the perfect recipe for a whole new cohort of applications and users to onboard into crypto. If you’re in the early stages of building a tokenized network and are looking for early stage capital, we’re always looking for new companies at <a href="http://mailto:apply@boost.vc" rel="noreferrer" target="">apply@boost.vc</a>.</p>
        <p>If you want to jam on ideas, or if you disagree with me, feel free to ping me on <a href="https://twitter.com/markbeylin" rel="noreferrer" target="_blank">Twitter</a>.</p></div>
      `
    },
    {
      id: '2',
      title: 'Bitcoin, Green Mining, and the Possibility for a More Sustainable Future',
      author: 'PYUSD',
      authorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      date: new Date().toLocaleDateString('en-US'),
      content1: `
        <div><p>One of the most pervasive conversations surrounding blockchain technology is sustainability. Blockchain networks — specifically proof-of-work (PoW) networks like Bitcoin — can consume large amounts of energy. Recent estimates suggest that Bitcoin mining is currently responsible annually for an estimated 85 million metric tons of carbon dioxide equivalent (<a href="https://filecache.mediaroom.com/mr5mr_paypal/186970/Green_Mining_Initiative_2024.pdf" rel="noreferrer" target="_blank">as of April 02, 2024</a>). Even with new blockchain consensus mechanisms proliferating rapidly, Bitcoin’s PoW architecture is likely to persist.</p>
        <p>PayPal’s Blockchain Research Group, in a strategic collaboration with Energy Web and DMG Blockchain Solutions Inc. (“DMG”), presents an opportunity to accelerate the clean energy transition for Bitcoin mining. Just like so many other mechanisms throughout web3, we propose the use of cryptoeconomic incentives to encourage desired behavior: Bitcoin miners using low-carbon energy sources in their mining operations. The full research paper, linked below, outlines an opportunity that not only rewards Bitcoin miners for operating with sustainable energy, but also increases the likelihood of participating entities to route on-chain transactions to these specific miners.</p>
      `,
      content2: `
        <p>Read the full paper from the <strong><a href="https://nam11.safelinks.protection.outlook.com/?url=https%3A%2F%2Fnewsroom.paypal-corp.com%2Fimage%2FGreen_Mining_Initiative_2024.pdf&amp;data=05%7C02%7Cwilburns%40paypal.com%7Cd2510d3722fc4939429608dc622c4164%7Cfb00791460204374977e21bac5f3f4c8%7C0%7C0%7C638493189460006661%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&amp;sdata=eCx%2Fu0p3a6TNK7Y0VpN3x0W%2FMl9e8ZHGEcGnVo3IRGo%3D&amp;reserved=0" rel="noreferrer" target="_blank">PayPal Blockchain Research Group</a></strong>.</p>
        <h3 id="heading-incentivizing-desired-activity-with-cryptoeconomics">Incentivizing desired activity with cryptoeconomics</h3>
        <p>Rational miners are driven by cryptoeconomic incentives. They expect to be rewarded with an asset (bitcoin BTC) that is more valuable than the resources they expended to acquire that reward. Much of blockchain’s history has focused on how to get a group of disparate, individual miners to all perform honestly and responsibly in the maintenance of a decentralized ledger.</p>
        <p>Since 2008, Bitcoin has achieved the robust, secure, decentralized, and censorship-resistant maintenance of the ledger with its decentralized miner community. In other words, the fundamental cryptoeconomic structure of Bitcoin and its PoW consensus mechanism has proven successful. Now, the question is whether additional cryptoeconomic incentives can be layered on top of the fundamental PoW mechanism thereby allowing us to encourage more environmentally sustainable actions that we desire as a community.</p>
        <p>PayPal’s Blockchain Research Group's partner EnergyWeb has developed a clean energy validation platform to permit Bitcoin miners to obtain low-carbon accreditation for their mining operations. These <em>green miners</em> are associated with public keys (which we refer to as <em>green keys)</em>, to which rewards can be distributed. On-chain transactions are preferentially routed to <em>green miners</em> by being broadcasted with low transaction fees, but with some BTC reward “locked” in a multisig payout address. <em>Green miners</em> will be incentivized to mine these transactions, since they will be the only ones eligible for the additional “locked” BTC reward.</p>
      `,
      content3: `
        <p>PayPal’s Blockchain Research Group hopes that this paper influences preferred behaviors by proposing ways in which fundamental cryptoeconomic incentives can be reapplied to improve and optimize existing, proven, strong networks. Sustainability is a significant topic of conversation for nearly every emerging and established industry in the world, and we aim to support the role of crypto in a sustainable future.</p>
        <p>Read the full paper from the <strong><a href="https://nam11.safelinks.protection.outlook.com/?url=https%3A%2F%2Fnewsroom.paypal-corp.com%2Fimage%2FGreen_Mining_Initiative_2024.pdf&amp;data=05%7C02%7Cwilburns%40paypal.com%7Cd2510d3722fc4939429608dc622c4164%7Cfb00791460204374977e21bac5f3f4c8%7C0%7C0%7C638493189460006661%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&amp;sdata=eCx%2Fu0p3a6TNK7Y0VpN3x0W%2FMl9e8ZHGEcGnVo3IRGo%3D&amp;reserved=0" rel="noreferrer" target="_blank">PayPal Blockchain Research Group</a></strong>.</p></div>
      `
    },
    {
      id: '3',
      title: 'Evolving Influencers',
      author: '0xab',
      authorAddress: '0xD571Cb930A525c83D7D2B7442a34b09c5F1cCa3E',
      date: new Date().toLocaleDateString('en-US'),
      content1: `
        <div><p>It’s clear that influencers have come a long way from their traditional roots. Gone are the days when only a few voices dominated the conversation. Now, online, each emerging ecosystem entirely shifts the way we connect. The evolution of influence is not just about who is speaking, but about how their community is amplified by the ever-changing tools at their disposal. Over the coming weeks, we hope to explore the ways in which new infrastructure and products, enabled by web3, are transforming the role of the influencer. As we dive further into this transition, we’ll start with some general context.</p>
        <p>Take the iconic partnership between Nike and Michael Jordan back in '84. It was more than just a deal; it was a cultural statement that combined Jordan's athletic brilliance with Nike's savvy branding, turning a pair of sneakers into a worldwide fashion movement. This wasn't just about selling shoes; it was about selling an identity through traditional mediums like print and TV.</p>
      `,
      content2: `
        <p>Then came the internet, and with it, a whole new playground for influence. Suddenly, anyone with a blog or a social media account could become an influencer. Platforms like MySpace and YouTube initially broke down the barriers, allowing direct communication between influencers and their followers. Bloggers became the new tastemakers, using their platforms to build communities and shape opinions in real time.</p>
        <p>We've seen another shift with the rise of algorithms, particularly on platforms like TikTok. Subtly pulling the strings, algorithms have decided who gets seen and heard, bringing micro-influencers to the forefront. Their content, while niche, exemplifies the digital age's personalized and fragmented nature of influence. Algorithms don't just suggest who we might like; they shape the cultural zeitgeist by elevating voices from the most unexpected corners. But it's not just about who's talking; it's about what they're offering. Today's influencers are curators of experiences and content. They're not just showing off brands; they're creating immersive experiences for their followers. The platform era of influence mirrors the web3 philosophy of active ownership and participation, just with skewed incentive models.</p>
        <p>Enter decentralized social, with social tokens and onchain media pushing in a new direction - turning followers into actual stakeholders. Platforms like friend.tech let influencers, or anyone for that matter, trade "keys" to their chats - blurring the lines between content creators and <a href="https://x.com/blknoiz06/status/1774169548662407251?s=20" rel="noreferrer" target="_blank">financiers</a>. Simultaneously, the rise of memecoins is another twist in the narrative, with creators turning their essence into currency, achieving staggering market valuations. More often than not, these tokens aren’t even launched by the person they allude to, shaking up the traditional understanding of influencers and value accrual.</p>
      `,
      content3: `
        <p>Decentralized social media protocols are further amplifying this shift, with platforms like Farcaster and the community tokens enabling creators to <a href="https://x.com/albiverse/status/1774819762314392018?s=20" rel="noreferrer" target="_blank">tip</a> their communities for their contributions. The influencer's role is evolving from mere content creation to one of <a href="https://x.com/Cooopahtroopa/status/1772469718034583699?s=20" rel="noreferrer" target="_blank">curatorship</a>, where engagement is rewarded in ways that extend beyond the traditional metrics of likes and shares. A new form of digital patronage. This isn't just about rewarding loyalty; it's about creating a verifiable, onchain record of <a href="https://x.com/gmoneyNFT/status/1773061574418149654?s=20" rel="noreferrer" target="_blank">engagement</a>. The message is clear: in the world of web3, influence is no longer just about reach - it's about nurturing a participatory economy. While we’ll save a deep dive for the next article, <a href="https://x.com/Cooopahtroopa?s=20" rel="noreferrer" target="_blank">Cooper </a>and <a href="https://x.com/gmoneyNFT?s=20" rel="noreferrer" target="_blank">Gmoney</a> are clear examples of this.</p>
        <p>As we look to the future, the role of influencers is evolving beyond content creation. It's becoming about how they engage their audience, with token incentives, or almost game design, playing increasingly significant roles. The future of influence is not just about who holds the megaphone, but how they prompt the crowd. As decentralized social media platforms evolve, influencers are arriving for the programmability and staying for the open, composable, and interoperable networks that redefine interaction.</p></div>
      `
    },
    {
      id: '4',
      title: 'T2',
      author: '0xab',
      authorAddress: '0xD571Cb930A525c83D7D2B7442a34b09c5F1cCa3E',
      date: new Date().toLocaleDateString('en-US'),
      content1: 'Oooh!',
      content2: '',
      content3: ''
    },
    {
      id: '5',
      title: 'T3',
      author: '0xab',
      authorAddress: '0xD571Cb930A525c83D7D2B7442a34b09c5F1cCa3E',
      date: new Date().toLocaleDateString('en-US'),
      content1: 'Oooh!',
      content2: '',
      content3: ''
    }
  ]

  getArticleById = (id: string): Article => {
    let article = {
      id: '',
      title: '',
      author: '',
      authorAddress: '0x0',
      date: '',
      content1: '',
      content2: '',
      content3: ''
    };
    this.articles.forEach(item => {
      if (id === item.id) {
        article = item;
      }
    })
    return article;
  }
}

export type Article = {
    id: string
    title: string
    author: string
    authorAddress: `0x${string}`
    date: string
    content1: string
    content2: string
    content3: string
}

const posts = new Posts();
export { posts };