const { checkDateFormatting, calculateCost } = require('../server/costController.js');

describe("All function in costController should work...", () => {

  let req, res, next;
  
  beforeEach(() => {
    // reset all variables for new test suite
    next = jest.fn();
    req = { body: {} };
    res = { locals: {} };
  })

  describe("checkDateFormatting should only accept correctly formatted dates", () => {
    it("should accept properly formated dates", () => {
      req.body.startDate = '01/01/2001'
      checkDateFormatting(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals.date = new Date('January 1, 2001'));
    })

    it("dates should be 10 characters long", () => {
      req.body.startDate = '01/01/200'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Date Format'));

      req.body.startDate = '01/01/22200'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[1][0]).toEqual(new Error('Invalid Date Format'));
    })

    it("dates should have '/' at index 2 and 5", () => {
      req.body.startDate = '1/011/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Date Format'));

      req.body.startDate = '01/012/001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[1][0]).toEqual(new Error('Invalid Date Format'));
    })

    it("should only accept correct months", () => {
      req.body.startDate = '13/01/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Month'));

      req.body.startDate = '00/12/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[1][0]).toEqual(new Error('Invalid Month'));

      req.body.startDate = '0a/12/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[2][0]).toEqual(new Error('Invalid Month'));
    })

    it("should only accept correct years", () => {
      req.body.startDate = '01/01/20a1'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Year'));
    })

    it("should only accept correct days", () => {
      req.body.startDate = '01/00/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Day'));

      req.body.startDate = '01/32/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[1][0]).toEqual(new Error('Invalid Day'));

      req.body.startDate = '01/aa/2001'
      checkDateFormatting(req, res, next);
      expect(next.mock.calls[2][0]).toEqual(new Error('Invalid Day'));
    })
  })

  describe("calculateCost should accurately predice cost of bananas", () => {
    it("should accept correctly formatted number of days", () => {
      req.body.numberOfDays = 0;
      calculateCost(req, res, next);
      expect(next.mock.calls[0][0]).toEqual(new Error('Invalid Number of Days'));

      req.body.numberOfDays = 'S';
      calculateCost(req, res, next);
      expect(next.mock.calls[1][0]).toEqual(new Error('Invalid Number of Days'));
    })

    it("should calculate accurate total", () => {
      req.body.numberOfDays = 31;
      res.locals.date = new Date('January 1, 2019');
      res.locals.day = 1;
      res.locals.month = 1;
      calculateCost(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals.total).toBe(3.25);

      req.body.numberOfDays = 32;
      calculateCost(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals.total).toBe(3.3);

      req.body.numberOfDays = 366;
      calculateCost(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.locals.total).toBe(35.5);
    })
  })
})