export enum Subjects {
  MATH = "math",
  LITERATURE = "literature",
  FOREIGN_LANGUAGE = "foreignLg",
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BIOLOGY = "biology",
  GEOGRAPHY = "geography",
  HISTORY = "history",
  PHYSICAL_EDUCATION = "phyEdu"
}

export const isExistSubject = (subject: any): boolean => {
  return Object.values(Subjects).includes(subject);
}