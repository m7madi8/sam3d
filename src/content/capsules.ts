export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "interior",
    title: "Interior Design",
    description:
      "Warm, refined interior spaces with a contemporary desert identity, balancing minimalism with practical luxury.",
    image: "/media/home1.webp",
  },
  {
    id: "landscape",
    title: "Landscape Design",
    description:
      "Outdoor environments shaped into a calm visual experience through native plants, stone textures, and natural flow.",
    image: "/media/home2.webp",
  },
  {
    id: "architectural",
    title: "Architectural Design",
    description:
      "Bold yet restrained architecture focused on light, shadow, and a deep connection to place.",
    image: "/media/home4.jpg",
  },
  {
    id: "commercial",
    title: "Commercial Design",
    description:
      "Functional, brand-forward commercial spaces crafted to elevate customer experience and operational flow.",
    image: "/media/home4.jpg",
  },
];
