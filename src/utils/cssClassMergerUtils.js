import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cssClassMerger = (...classes) => {
    return twMerge(clsx(classes));
}

