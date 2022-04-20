import { IContractorViolationsCount } from 'interfaces/contractorViolationCount';

//This function changes the structure of its parameter into an array of objects with the getYears structure .
export const groupByYear = (content: IContractorViolationsCount[]) => {
  let options = getYears();

  content.forEach((info: any) => {
    options[info.year].count += info.count;
    options[info.year].types[info.violationType] += info.count;
  });

  //Returns an organized array so the ViolationsGrid can loop through it
  return Object.keys(options)
    .sort((a, b) => Number(b) - Number(a))
    .map(option => options[option]);
};

//This function should return four objects, one for the current year and one for each of the three previous years
export const getYears = () => {
  const currentYear = new Date().getFullYear();

  let years = { [currentYear]: { year: currentYear.toString(), count: 0, types: { O: 0, R: 0, S: 0, W: 0 } } };

  for (let i = 1; i <= 3; i++) {
    let prevYear = currentYear - i;
    years[prevYear] = { year: prevYear.toString(), count: 0, types: { O: 0, R: 0, S: 0, W: 0 } };
  }
  //returns an array of objects with the correct count and types for each year
  return years;
};
