import { day, db } from "../db";
import dateHelper from "../helpers/dateHelper";
export default async function InitDB({ stop, router }) {
  try {
    const isFind = await db.settings.get(1);

    if (!isFind) {
      await db.settings.add({
        name: null,
        dateInit: null, //
        defaultUnit: "kg",
        defaultStatistics: "this-week",
      });
    

      // for (let c = 0; c < 10; c++) {
      //   // console.log("create");
      // await  db.categories
      //     .add({
      //       title: `العضلة ${c}`,
      //     })
      //     .then(async (id) => {
      //       for (let ei = 0; ei < 10; ei = ei + 2) {
      //         await   db.exercises
      //         .add({
      //           categorie_id: id,
      //           title: `العضلة ${ei}`,
      //           img : "",
      //         })
      //         .then(async (e) => {
      //           // init app
      //           const newToday = {
                  
      //             rounds: [
      //               {
      //                 repet: 0,
      //                 weight: 0,
      //                 unit: "kg",
      //               },
      //             ],
      //             exercise_id :e
      //           } as day;

      //           for (let i = 0; i < 10; i = i + 2) {
                  
      //             newToday.date = dateHelper({
      //               addDay: i,
      //               setDate: `2025-6-${i + 1}`,
      //             }) as number;
      //             newToday.id = undefined!;
      //             await db.days.add(newToday);
      //           }
      //         });

      //       }


      //     });
      // }
    }
  } catch {
    router.push("/404");
    stop();
  }
}
