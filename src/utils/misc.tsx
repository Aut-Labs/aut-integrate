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
        Infrastructure, <br /> & Web3 Tools
      </>
    ),
    description:
      "For researchers & web3, open-source teams, that innovate in a liberal fashion - creating the tools and technology to power a more collaborative world.",
    market: 1
  },
  {
    title: (
      <>
        Art, Events <br />& NFTs
      </>
    ),
    description:
      "Art movements, writers & creative collectives of all kind - who use Art & provable ownership for purer, more disruptive forms of human interaction.",
    market: 2
  },
  {
    title: (
      <>
        Governance <br /> & Public Goods
      </>
    ),
    description:
      "From support for people in need, to innovative local hubs - to get together & create something greater than oneself, to build a fairer & more meritocratic world.",
    market: 3
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
      return "builder ⚙️";
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
