import { Request, Response } from 'express'


export function getRange(req: Request, res: Response): Response {
   let solution = {
      min: Math.floor(Math.random() * 100 + 1),
      max: Math.floor(Math.random() * 100 + 100)
   }
   return res.json(solution);
}


export function getValues({ params: { length } }: Request, res: Response): Response {

   let DICCTIONARY = {
      units: () => Math.floor(Math.random() * 100),
      decimals: () => Math.floor((Math.random() * 100) * 10) / 10,
      centesimals: () => Math.floor((Math.random() * 100) * 100) / 100
   }

   let solution = [];

   for (let i = 0; i < parseInt(length); i++) {
      let probability = Math.random();

      if (probability <= 0.3) {
         solution.push(DICCTIONARY["units"]());
      } else if (probability <= 0.7) {
         solution.push(DICCTIONARY["decimals"]());

      } else {
         solution.push(DICCTIONARY["centesimals"]());
      }
   }


   return res.json({
      values: solution
   });
}
