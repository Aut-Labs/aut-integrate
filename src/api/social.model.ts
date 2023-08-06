export interface AutSocial {
  type: string;
  link: string;
}

export const socialUrls = {
  discord: {
    prefix: "",
    placeholder: ""
  },
  website: {
    prefix: "",
    placeholder: ""
  }
};

export const DefaultSocials: AutSocial[] = [
  {
    type: "discord",
    link: ""
  },
  {
    type: "website",
    link: ""
  }
];
