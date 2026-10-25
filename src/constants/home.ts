import { Banknote, Gem, History, Sparkles } from "lucide-react-native";

export const zakatOptions = [
  {
    title: "Money",
    subtitle: "Cash & savings",
    icon: Banknote, 
    route: "/money",
    bg: "#E2EDE0",
    accent: "#174C3C",
  },
  {
    title: "Gold",
    subtitle: "Weight & purity",
    icon: Gem , 
    route: "/gold",
    bg: "#F4E9D3",
    accent: "#A77A35",
  },
  {
    title: "Zakat Al-Fitr",
    subtitle: "People & amount",
    icon: Sparkles, 
    route: "/fitr",
    bg: "#E8EDE2",
    accent: "#52744D",
  },
  {
    title: "History",
    subtitle: "Your saved calculations",
    icon: History,
    route: "/history",
    bg: "#E9E8DF",
    accent: "#6D725F",
  },
];