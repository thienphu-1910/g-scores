const subjects = {
  mathScore: "Math",
  literatureScore: "Literature",
  physicsScore: "Physics",
  chemistryScore: "Chemistry",
  biologyScore: "Biology",
  historyScore: "History",
  geographyScore: "Geography",
  phyEduScore: "Physical Education",
  foreignLgScore: "Foreign Language",
  foreignLgCode: "Foreign Language Code",
};

function convertVariableNameToSubjectName(varName) {
  return subjects[varName];
}

export { convertVariableNameToSubjectName };