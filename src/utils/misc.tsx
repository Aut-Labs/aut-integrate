/* eslint-disable max-len */
export const ContractTypes = [
  {
    label: "SW (Legacy)",
    value: 1
  },
  {
    label: "Moloch V1",
    value: 2
  },
  {
    label: "Moloch V2",
    value: 3
  },
  {
    label: "Aragon",
    value: 4
  },
  {
    label: "DAOStack",
    value: 5
  },
  {
    label: "Compound",
    value: 6
  },
  {
    label: "Tribute",
    value: 7
  }
];

export const MarketTemplates = [
  {
    title: (
      <>
        Open-Source <br />& Infra
      </>
    ),
    description:
      "For researchers & open-source teams, that innovate in a liberal fashion - building the tools to power a more collaborative world.",
    market: 1
  },
  {
    title: (
      <>
        DeFi & <br />
        Payments
      </>
    ),
    description:
      "Whether you’re building a new financial primitive, or educating the world about P2P money - the DeFi market never stops innovating.",
    market: 2
  },
  {
    title: (
      <>
        ReFi & <br />
        Governance
      </>
    ),
    description:
      "From supporting a group in need, to building regenerative local hubs - let’s get together to build a fairer & more meritocratic world.",
    market: 3
  },
  {
    title: (
      <>
        Social, Art <br />& Gaming
      </>
    ),
    description:
      "SocialFi, Artists, writers collectives & gamers - using provable ownership for purer, more disruptive forms of human interaction.",
    market: 4
  },
  {
    title: (
      <>
        Identity & <br />
        Reputation
      </>
    ),
    description:
      "From new ID protocols to provable, privacy-preserving trust - these are the pillars to build a (trustless) decentralized world.",
    market: 5
  }
];

export const CommitmentMessages = (value: number) => {
  switch (+value) {
    case 1:
    case 2:
      return `Just lurking 👀`;
    case 3:
    case 4:
      return "gm gm ☕";
    case 5:
    case 6:
      return "buidler ⚙️";
    case 7:
    case 8:
      return "Trusted seed 🌱";
    case 9:
    case 10:
      return `Soulbound ⛓️`;
    default:
      return `Minimum Commitment Level for new Members.`;
  }
};
