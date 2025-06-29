"use client";

import Loading from "@/app/components/loading";
import { categorie, day, db, exercise } from "@/app/db";
import dateHelper from "@/app/helpers/dateHelper";
import Dexie from "dexie";
import { useLoading } from "@/app/Providers/useLoading";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
  Image,
  Breadcrumbs,
  BreadcrumbItem,
  Drawer,
  DrawerContent,
  useDisclosure,
  addToast,
  DrawerHeader,
  DrawerBody,
  Form,
} from "@heroui/react";
import { useRouter, notFound } from "next/navigation";

// import Image from "next/image";

import { ChangeEvent, use, useEffect, useState } from "react";
import Link from "next/link";

export default function ExercisePage({ params }) {
  const useParams = use(params) as { id: string[] };
  const id = useParams.id[0];
  const enteredDate = useParams.id?.[1];

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [categorie, setCategorie] = useState<categorie>();
  const [exercise, setExercise] = useState<exercise>();
  const date = dateHelper({ setDate: enteredDate || undefined }) as number;
  const router = useRouter();
  const setLoading = useLoading();
  const [saveInDB, setSaveInDB] = useState<NodeJS.Timeout>();
  const [saveLoading, setSaveLoading] = useState(false);
  const [addNewRoundLoading, setAddNewRoundLoading] = useState(false);
  const [deleteRoundLoading, setdeleteRoundLoading] = useState<number | null>(
    null
  );

  const [appInitDate, setAppInitDate] = useState<number>();
  const [offsetDays, setOffsetDays] = useState<number>(0);
  const [today, setTody] = useState<day>(null!);
  const [lastDays, setLastDays] = useState<day[]>([]);
  const [loadingMoreDataLoading, setLoadingMoreDataLoading] = useState(false);
  const [lodeedAllData, setLodeedAllData] = useState(false);

  const [editExercise, setExerciseEdit] = useState({
    title: "",
    img: "",
    loading: false,
  });


  // const [lastDays, setLastDays] = useState<
  //   {
  //     date: string;
  //     assign?: boolean;
  //     rounds: { repet: number; weight: number; unit: "kg" | "lb" }[];
  //   }[]
  // >([]);

  useEffect(() => {
    // console.log(id);
    setLoading(true);

    async function init() {
      // console.log("run");
      const initDate = (await db.settings.get(1))!.dateInit!;

      setAppInitDate(initDate); //

      if (
        enteredDate &&
        dateHelper({ setDate: initDate }) > dateHelper({ setDate: enteredDate })
      ) {
        router.push("/404");
        return;
      }

      const isFindExe = await db.exercises.get(+id);
      // console.log(isFindExe);
      if (isFindExe) {
        setExercise(isFindExe);
        setCategorie(await db.categories.get(isFindExe.categorie_id))
        let isFindDay = await db.days
          .where("[exercise_id+date]")
          .equals([+id, date])
          .first();

        // console.log(isFindDay);

        if (!isFindDay) {
          isFindDay = {
            id: undefined!,
            date: date,
            rounds: [
              {
                repet: 0,
                weight: 0,
                unit: "kg",
              },
            ],
            exercise_id: isFindExe.id,
          };

          await db.days.add(isFindDay).then((e) => {
            isFindDay!.id = e;
          });
        }

        setTody(isFindDay);
        getLastDays();

        setLoading(false);
      } else {
        router.push("/404");
      }
    }
    init();
    // if (db) {
    //   db.exercises().get(+id).onsuccess = async function (e) {
    //     const exe = (e.target as IDBRequest).result as exercises[0];
    //     const todayIndex = exe.days.findIndex((e) => e.date === date);
    //     setIndexToday(todayIndex);

    //     if (todayIndex === -1) {
    //       exe.days.push({
    //         date: date,
    //         rounds: [
    //           {
    //             repet: 0,
    //             weight: 0,
    //             unit: "kg",
    //           },
    //         ],
    //       });

    //       await new Promise((res) => {
    //         const edit = db.exercises().put(exe);
    //         edit.onsuccess = function () {
    //           res(null);
    //         };
    //       });
    //       setIndexToday(exe.days.length - 1);
    //     }
    //     setExercise(exe);

    //     db.categories().get(exe.categorie_id).onsuccess = function (e) {
    //       setCategorie((e.target as IDBRequest).result);
    //     };

    //   };
    // }
  }, []);

  if (!exercise) {
    return "تحميل";
  }

  if (
    enteredDate &&
    (!new RegExp(/\d{4}-\d{1,2}-\d{1,2}/).test(enteredDate) ||
      dateHelper({ setDate: enteredDate }) > dateHelper())
  ) {
    return notFound();
  }

  if (id.length > 2) {
    return notFound();
  }

  function updateRounds(
    event: { target: { value: string } },
    index: number,
    input: "repet" | "unit" | "weight"
  ) {
    const newToday = { ...today };
    if (saveInDB) clearTimeout(saveInDB);
    setSaveLoading(true);

    if (input === "repet" || input === "weight") {
      newToday.rounds[index][input] = Number(event.target.value);
    } else {
      newToday.rounds[index][input] = event.target.value as "kg" | "lb";
    }
    setTody(newToday);

    setSaveInDB(
      setTimeout(() => {
        // db.exercises().put(newExe).onsuccess = () => {
        //   setSaveLoading(false);
        // };
        db.days.update(today.id, newToday).then(() => {
          setSaveLoading(false);
        });
      }, 1500)
    );
  }

  function addNewRound() {
    setAddNewRoundLoading(true);
    const newToday = { ...today };
    newToday.rounds.push({
      repet: 0,
      weight: 0,
      unit: "kg",
    });

    db.days.update(today.id, newToday).then(() => {
      setAddNewRoundLoading(false);
      setTody(newToday);
    });
  }

  function deleteRound(index: number) {
    setdeleteRoundLoading(index);

    const newToday = { ...today };
    newToday.rounds.splice(index, 1);

    db.days.update(today.id, newToday).then(() => {
      setTody(newToday);
      setdeleteRoundLoading(null);
    });

    // console.log();
  }


  async function getLastDays() {
    let initDate = appInitDate;
    let offset = offsetDays;
    const groupDays = await db.days
      .where("[exercise_id+date]")
      .between([+id, Dexie.minKey], [+id, Dexie.maxKey],true,true)
      .reverse()
      .offset(offset)
      .limit(7)
      .toArray();

    if (!groupDays.length) {
      // console.log("set true LodeedAllData");
      setLodeedAllData(true);
      return;
    }

    // console.log(groupDays, offset);
    if (!initDate) {
      initDate = (await db.settings.get(1))!.dateInit!;
    }

    // console.log(groupDays);
    //  console.log(appInitDate,offset);

    const groupLastDays = [...lastDays];

    for (let i = 0; i < groupDays.length; i++) {
      const singleDay = groupDays[i];

      if (groupLastDays.length) {
        const lastElement = groupLastDays[groupLastDays.length - 1];
        const lastElementYesterday = dateHelper({
          setDate: lastElement.date,
          subDay: 1,
        });

        // console.log(
        //   dateHelper({ setDate: lastElementYesterday, dateAsText: true }),
        //   dateHelper({ setDate: singleDay.date, dateAsText: true })
        // );

        if (lastElementYesterday == dateHelper({ setDate: singleDay.date })) {
          groupLastDays.push(singleDay);
          offset++;
        } else if (lastElementYesterday >= initDate) {
          groupLastDays.push({
            date: lastElementYesterday as number,
          } as day);

          if (
            lastElementYesterday === initDate ||
            groupLastDays.length % 7 === 0
          ) {
            break;
          }

          i--;
          continue;
        }
      } else {
        groupLastDays.push(singleDay);
        offset++;
      }
    }

    //     console.log(groupDays.map(e=>{
    //   e.date = dateHelper({setDate:e.date,dateAsText:true});
    //   return e;
    // }));

    // console.log(groupLastDays.map(e=>{
    //   e.date = dateHelper({setDate:e.date,dateAsText:true});
    //   return e;
    // }));
    // console.log((await db.days.where('e').toArray()).map(e=>{
    //   e.date = dateHelper({setDate:e.date,dateAsText:true});
    //   return e;
    // }));
    // console.log(date,groupLastDays[0].date);

    setLastDays(groupLastDays);
    setOffsetDays(offset);
    setLoadingMoreDataLoading(false);
  }

  function getMoreData(e) {
    if (lodeedAllData && loadingMoreDataLoading) {
      setLoadingMoreDataLoading(false);
    }
    if (loadingMoreDataLoading || lodeedAllData) {
      return;
    }
    const element = e.target as HTMLElement;
    const fullScroll = element.scrollHeight - element.offsetHeight;

    if (element.scrollTop > fullScroll - 50) {
      setLoadingMoreDataLoading(true);
      getLastDays();
    }
  }


  function editExerciseHandel() {
    if (editExercise.loading) {
      addToast({
        title: "يرجى الانتظار ريثما تحمل الصورة!",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    if (!editExercise.title.length) {
      addToast({
        title: "يجب كتابة شي على الاقل",
        color: "danger",
      });

      setLoading(false);
      return;
    }
    db.exercises.update(exercise!.id,{
      title: editExercise.title,
      img: editExercise.img,
    }).then((e) => {
 
      setExercise({...exercise!, title:editExercise.title, img: editExercise.img});

      addToast({
        title: `تم تعديل اسم التمرين بنجاح "${editExercise.title}"`,
        color: "success",
      });
      onClose();
      setLoading(false);
    });

  
  }

  function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    setExerciseEdit({ ...editExercise, loading: true });
    const file = e.target.files?.[0];



    if (file) {
      if((file.size / 1024 / 1024) > 5) {
        addToast({
          title: `حجم الصورة يجب الا يتجاوز 5 ميقابايت`,
          color: "danger",
        });
        setExerciseEdit({ ...editExercise, loading: false });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setExerciseEdit({ ...editExercise,
          img: event.target?.result as string,
          loading: false,
        });
      };
      reader.readAsDataURL(file);
    } 
  }

  return (
    <div className="ExercisePage">
      <div className="header">
        {exercise.img && <Image
          className="exercise-image"
          alt="img"
          isBlurred
          src={exercise.img}></Image>}
        <Breadcrumbs className="breadcrumbs">
        <BreadcrumbItem href="/dashboard/categories/" >العضلات</BreadcrumbItem>
          <BreadcrumbItem href={`/dashboard/categories/${categorie?.id}`} >{categorie?.title}</BreadcrumbItem>
          <BreadcrumbItem className="no-click">{exercise?.title}</BreadcrumbItem>
          <BreadcrumbItem>
            {dateHelper({ setDate: date, dateAsText: true })}
          </BreadcrumbItem>
        </Breadcrumbs>
        {/* <span dir="ltr">{dateHelper({ setDate: date, dateAsText: true })}</span> */}
        <h1>
          {exercise.title} <Chip className="editBtn" size="sm" onClick={() => {setExerciseEdit({...exercise,loading:false});onOpen()}} >تعديل</Chip>
        </h1>
      </div>
      <div className="content">
        {/* <Button onPress={init}>init</Button> */}

        {lastDays?.[1]?.rounds && <div className="summary">
          <p>اوزانك اخر مره كانت:</p>

          <div className="box">
            {lastDays?.[1]?.rounds?.map((e, i) => {
              if (i != lastDays?.[1]?.rounds?.length - 1) {
                return (
                  <p key={i}>
                    {e.weight}
                    {e.unit}
                    <span className="point"></span>
                  </p>
                );
              }
              return (
                <p key={i}>
                  {e.weight}
                  {e.unit}
                </p>
              );
            })}
          </div>
        </div>}

        <Tabs className="taps"
          // onSelectionChange={(e) => e == "lastDays" && getLastDays()}
          aria-label="Options">
          <Tab key="today" title="تمرين اليوم">
            <div className="rounds">
              <h3>
                الجولات{" "}
                {saveLoading && (
                  <Chip className="save" color="primary" variant="bordered">
                    <Spinner className="spinner" size="sm"></Spinner>جاري الحفظ
                  </Chip>
                )}
              </h3>
              <div className="boxs">
                {/* {exercise.days[IndexToday]?.date} */}
                {today?.rounds.map((r, i) => {
                  return (
                    <div key={i}>
                      <Input
                        onChange={(e) => updateRounds(e, i, "repet")}
                        value={String(r.repet)}
                        className="input input-repet"
                     
                        min={0}
                        type="number"
                        label="كم تكرار؟"></Input>
                      <Input
                        onChange={(e) => updateRounds(e, i, "weight")}
                        value={String(r.weight)}
                        min={0}
                        className="input input-weight"
                        type="number"
                        label="الوزن"></Input>
                      <Select
                        disallowEmptySelection={true}
                        onChange={(e) => updateRounds(e, i, "unit")}
                        selectedKeys={[r.unit]}
                        className="input unit"
                        label="القياس">
                        <SelectItem key="kg">kg</SelectItem>
                        <SelectItem key="lb">lb</SelectItem>
                      </Select>

                      <Button
                        onPress={() => deleteRound(i)}
                        className={`delete-round ${i === 0 && "invisible"}`}
                        color="danger"
                        variant="bordered">
                        حذف
                      </Button>

                      {deleteRoundLoading === i && (
                        <Spinner className="full-loading" color="danger" />
                      )}
                    </div>
                  );
                })}
                <Button
                  isLoading={addNewRoundLoading}
                  onPress={addNewRound}
                  className="addNewRounds"
                  color="primary">
                  إضافة جولة +
                </Button>
              </div>
            </div>
          </Tab>
          <Tab key="lastDays" title="جميع الأيام">
            <div className="lastDaysContainer" onScroll={getMoreData}>
              {lastDays.map((day, i) => {
                return (
                  <Link
                    className={`${!day.rounds ? "not-assign" : ""} ${
                      day.date == date ? "current" : ""
                    }`}
                    href={`/dashboard/exercises/${id}/${dateHelper({
                      setDate: day.date,
                      dateAsText: true,
                    })}`}
                    key={i}>
                    <div className="header">
                      <h3>
                        {dateHelper({ setDate: day.date, dateAsText: true })}
                      </h3>
                      <div className="rounds-box">
                        {day?.rounds?.slice(0, 4).map((e, i) => {
                          if (i <= 2 && i != day?.rounds?.length - 1) {
                            return (
                              <p key={i}>
                                {e.weight}
                                {e.unit}
                                <span className="point"></span>
                              </p>
                            );
                          }
                          return (
                            <p key={i}>
                              {e.weight}
                              {e.unit}
                            </p>
                          );
                        })}
                        {day?.rounds?.length > 4 && (
                          <p className="more">+{day?.rounds?.length - 4}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {loadingMoreDataLoading && <Loading />}
            </div>
          </Tab>
        </Tabs>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>تعديل تمرين {exercise.title}</DrawerHeader>
              <DrawerBody>
                <Form className="formAddedNewCategorie">
                  <Input
                    label="اسم التمرين"
                    onChange={(e) =>
                      setExerciseEdit({ ...editExercise, title: e.target.value })
                    } value={editExercise.title}></Input>
                  <Button
                    isLoading={editExercise.loading}
                    color="secondary"
                    onPress={(e) =>
                      (e.target.nextElementSibling as HTMLElement).click()
                    }>
                    إرفع صورة
                  </Button>
                  <input
                    onChange={uploadImage}
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    type="file"
                    className="hidden"></input>
                  {editExercise.img && (
                    <div className="img-view">
                      <Image
                        alt="img"
                        src={editExercise.img}
                        width={100}
                        height={100}
                       ></Image>
                      <Button
                        variant="bordered"
                        color="danger"
                        onPress={() =>
                          setExerciseEdit({ ...editExercise, img: "" })
                        }>
                        حذف
                      </Button>
                    </div>
                  )}

                  <div className="buttons">
                    <Button onPress={onClose}>الغاء</Button>
                    <Button color="primary" onPress={editExerciseHandel}>
                     حفظ
                    </Button>
                  </div>
                </Form>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
