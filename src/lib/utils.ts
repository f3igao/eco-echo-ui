import { clsx, type ClassValue } from 'clsx';
import { snakeCase } from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const getParkBgImgUrl = (name: string) => {
  const imgName = snakeCase(name);
  const url = `bg-[url('src/assets/park-cover-photos/${imgName}.jpeg')]`;
  // console.log(url);
  return url;
};
