export const Subjects = {
  MATH: "math",
  LITERATURE: "literature",
  FOREIGN_LANGUAGE: "foreignLg",
  PHYSICS: "physics",
  CHEMISTRY: "chemistry",
  BIOLOGY: "biology",
  GEOGRAPHY: "geography",
  HISTORY: "history",
  PHYSICAL_EDUCATION: "phyEdu",
};

export const SUBJECT_LABELS = {
  math: "Math",
  literature: "Literature",
  foreignLg: "Foreign Language",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  geography: "Geography",
  history: "History",
  phyEdu: "Physical Ed.",
};

export const SUBJECT_ICONS = {
  math: "∑",
  literature: "✦",
  foreignLg: "◈",
  physics: "⊛",
  chemistry: "⬡",
  biology: "◉",
  geography: "◎",
  history: "◷",
  phyEdu: "◈",
};

export const PREDEFINED_GROUPS = [
  {
    id: "A",
    name: "Group A",
    subjects: [Subjects.MATH, Subjects.PHYSICS, Subjects.CHEMISTRY],
  },
  {
    id: "B",
    name: "Group B",
    subjects: [Subjects.MATH, Subjects.CHEMISTRY, Subjects.BIOLOGY],
  },
  {
    id: "C",
    name: "Group C",
    subjects: [Subjects.LITERATURE, Subjects.HISTORY, Subjects.GEOGRAPHY],
  },
  {
    id: "D",
    name: "Group D",
    subjects: [Subjects.MATH, Subjects.LITERATURE, Subjects.FOREIGN_LANGUAGE],
  },
];
