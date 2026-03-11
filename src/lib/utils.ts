type ClassValue =
  | string
  | null
  | false
  | undefined
  | Record<string, boolean>;

export function cn(...values: ClassValue[]) {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string") {
      classes.push(value);
    } else {
      Object.entries(value).forEach(([key, condition]) => {
        if (condition) classes.push(key);
      });
    }
  }

  return classes.join(" ");
}


