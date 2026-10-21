export const ease = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
};
export const spring = { type: "spring" as const, visualDuration: 0.35, bounce: 0.12 };
