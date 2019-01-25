/**
 * @author hlmitchell
 * @date 1/24/18
 * @description Express middleware for validating date input and calculating cost of bananas
 */

const monthsInfo = {
  1: ['January', 31],
  2: ['February', 29],
  3: ['March', 31],
  4: ['April', 30],
  5: ['May', 31],
  6: ['June', 30],
  7: ['July', 31],
  8: ['August', 31],
  9: ['September', 30],
  10: ['October', 31],
  11: ['November', 30],
  12: ['December', 31]
}

module.exports = {
  checkDateFormatting: (req, res, next) => {
    const { startDate } = req.body;
    if (startDate.length !== 10 || startDate[2] !== '/' || startDate[5] !== '/') return next(new Error('Invalid Date Format'));
    
    // convert date strings into integers
    let splitDate = startDate.split('/');
    splitDate = splitDate.map((str, i) => parseInt(str));
  
    const month = splitDate[0];
    // months must be between 0 and 12
    if (!month || month < 1 || month > 12) return res.send('Invalid Month');
  
    const year = splitDate[2];
    // year could be shortened to less than 4 characters when letters mixed with nums
    if (!year || year < 1000) return res.send('Invalid Year');
  
    const day = splitDate[1];
    // Client entered Feb 29th on a non leap year
    if (!day || day === 29 && year % 4 !== 0) return res.send('Invalid Day');
    // day is outside appropriate range for its month
    if (day < 0 || day > monthsInfo[month][1]) return res.send('Invalid Day');
  
    res.locals.date = new Date(`${monthsInfo[month][0]} ${day}, ${year}`);
    res.locals.day = day;
    next();
  },

  calculateCost: (req, res, next) => {
    const { numberOfDays } = req.body;
    const { date, day } = res.locals;
    // we need to keep track of the day of the week to avoid counting sundays and saturdays
    let dayOfWeek = date.getDay();
    let total = 0;
  
    if (isNaN(numberOfDays) || numberOfDays < 1) return res.send('Invalid Number of Days');
  
    for (let i = 0; i < numberOfDays; i++) {
      // do not count sundays and saturdays
      if (dayOfWeek !== 0 || dayOfWeek !== 6) {
        if (day <= 7) total += 0.05;
        else if (day <= 14) total += 0.10;
        else if (day <= 21) total += 0.15;
        else if (day <= 28) total += 0.20;
        else total += 0.25;
      }
  
      if (dayOfWeek < 6) dayOfWeek += 1;
      else dayOfWeek = 0;
    }
  
    res.locals.total = total;
    next();
  }
}