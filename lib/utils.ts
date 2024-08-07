import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import sharp from "sharp";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitize(data: string) {
  return DOMPurify.sanitize(data);
}

export function range(start: number, end: number, step = 1) {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}
// const nameList = [
//   "Time",
//   "Past",
//   "Future",
//   "Dev",
//   "Fly",
//   "Flying",
//   "Soar",
//   "Soaring",
//   "Power",
//   "Falling",
//   "Fall",
//   "Jump",
//   "Cliff",
//   "Mountain",
//   "Rend",
//   "Red",
//   "Blue",
//   "Green",
//   "Yellow",
//   "Gold",
//   "Demon",
//   "Demonic",
//   "Panda",
//   "Cat",
//   "Kitty",
//   "Kitten",
//   "Zero",
//   "Memory",
//   "Trooper",
//   "XX",
//   "Bandit",
//   "Fear",
//   "Light",
//   "Glow",
//   "Tread",
//   "Deep",
//   "Deeper",
//   "Deepest",
//   "Mine",
//   "Your",
//   "Worst",
//   "Enemy",
//   "Hostile",
//   "Force",
//   "Video",
//   "Game",
//   "Donkey",
//   "Mule",
//   "Colt",
//   "Cult",
//   "Cultist",
//   "Magnum",
//   "Gun",
//   "Assault",
//   "Recon",
//   "Trap",
//   "Trapper",
//   "Redeem",
//   "Code",
//   "Script",
//   "Writer",
//   "Near",
//   "Close",
//   "Open",
//   "Cube",
//   "Circle",
//   "Geo",
//   "Genome",
//   "Germ",
//   "Spaz",
//   "Shot",
//   "Echo",
//   "Beta",
//   "Alpha",
//   "Gamma",
//   "Omega",
//   "Seal",
//   "Squid",
//   "Money",
//   "Cash",
//   "Lord",
//   "King",
//   "Duke",
//   "Rest",
//   "Fire",
//   "Flame",
//   "Morrow",
//   "Break",
//   "Breaker",
//   "Numb",
//   "Ice",
//   "Cold",
//   "Rotten",
//   "Sick",
//   "Sickly",
//   "Janitor",
//   "Camel",
//   "Rooster",
//   "Sand",
//   "Desert",
//   "Dessert",
//   "Hurdle",
//   "Racer",
//   "Eraser",
//   "Erase",
//   "Big",
//   "Small",
//   "Short",
//   "Tall",
//   "Sith",
//   "Bounty",
//   "Hunter",
//   "Cracked",
//   "Broken",
//   "Sad",
//   "Happy",
//   "Joy",
//   "Joyful",
//   "Crimson",
//   "Destiny",
//   "Deceit",
//   "Lies",
//   "Lie",
//   "Honest",
//   "Destined",
//   "Bloxxer",
//   "Hawk",
//   "Eagle",
//   "Hawker",
//   "Walker",
//   "Zombie",
//   "Sarge",
//   "Capt",
//   "Captain",
//   "Punch",
//   "One",
//   "Two",
//   "Uno",
//   "Slice",
//   "Slash",
//   "Melt",
//   "Melted",
//   "Melting",
//   "Fell",
//   "Wolf",
//   "Hound",
//   "Legacy",
//   "Sharp",
//   "Dead",
//   "Mew",
//   "Chuckle",
//   "Bubba",
//   "Bubble",
//   "Sandwich",
//   "Smasher",
//   "Extreme",
//   "Multi",
//   "Universe",
//   "Ultimate",
//   "Death",
//   "Ready",
//   "Monkey",
//   "Elevator",
//   "Wrench",
//   "Grease",
//   "Head",
//   "Theme",
//   "Grand",
//   "Cool",
//   "Kid",
//   "Boy",
//   "Girl",
//   "Vortex",
//   "Paradox",
// ];

// export function generateString(length: number) {
//   let result = "";
//   let counter = 0;
//   while (counter < length) {
//     result += " " + nameList[Math.floor(Math.random() * nameList.length)];
//     counter += 1;
//   }
//   return result;
// }

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const timeAgo = (date: Date) => {
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minutes";
  }
  return Math.floor(seconds) + " Seconds";
};

export const compress = async (
  image: sharp.Sharp,
  target: number,
  size: number
) => {
  if (size <= target) return image;

  const metadata = await image.metadata();

  const { width, height } = metadata;

  if (!width || !height) return image;
  const scaleNumber = size / target;

  const output_image = image.resize(
    Math.floor(width / scaleNumber),
    Math.floor(height / scaleNumber)
  );
  return output_image;
};
