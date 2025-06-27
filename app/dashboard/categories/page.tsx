"use client";

import { categorie, db, exercise } from "@/app/db";
import logo from "@/app/assets/fill.png";
// import { categories, exercises} from "@/app/Providers/useDB";
import { useLoading } from "@/app/Providers/useLoading";
import {
  addToast,
  Avatar,
  AvatarGroup,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Form,
  Input,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";

export default  function CategoriesPage() {
  // const db = UseDB();

  const [categories, setCategories] = useState<categorie[]>([]);
  const [exercises, setExercises] = useState<{[key:number]:exercise[]}>({});
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();

  const [newCategorieName, setNewCategorieName] = useState<string>("");
  const setLoading = useLoading(); 
  // const [loadingNewCategorie, setLoadingNewCategorie] = useState();

 
  useEffect(() => {
     async function init() {
      setCategories(await db.categories.toArray());

      // await db.exercises.
      setExercises((await db.exercises.toArray()).reduce((acc : {[key:number]:exercise[]},exercise)=>{
        if(!acc[exercise.categorie_id]) {
          acc[exercise.categorie_id] = [];
        };
        acc[exercise.categorie_id].push(exercise);
        return acc;
      },{}));
      // console.log(await db.exercises.toArray());
    }

    init();
    // if (db) {
  }, []);

  async function addNewCategorie() {
    // const close = {...app};
    // close.states.categories.push({
    //   id:12,
    //   title : "hi"
    // });
    // app.setDB(close)
    setLoading(true);

    if(!newCategorieName.length) {
      addToast({
        title : "يجب كتابة شي على الاقل",
        color : "danger"
      });


      setLoading(false);
      return;
    }
    db.categories.add({
      title : newCategorieName
    }).then((e) => {
      console.log(e);
      setCategories([...categories,{
        title : newCategorieName,
        id : e
      }]);

      addToast({
        title : `تم إضافة عضلة جديدة "${newCategorieName}"`,
        color : "success"
      });
      onClose();
      setLoading(false);
    });

   


  }

  return (
    <div className="CategoriesPage">
      <div className="header">
        <h1>العضلات</h1>
        <Button onPress={onOpen} color="primary">
          إضافة عضلة
        </Button>
      </div>
      <div className="content">
        <div className="categories">
          {categories.map((cag, i) => {
            return (
              <Link href={`./categories/${cag.id}`} key={i}>
                <h3>{cag.title}</h3>
                <AvatarGroup max={10}>
                  {exercises[cag.id] && exercises[cag.id].map((e,i)=> {
                    return  <Avatar key={i} src={e.img || logo.src}></Avatar>;
                  })}
                 
                </AvatarGroup>
              </Link>
              // <div >
              
              // </div>
            );
          })}
        </div>
        {/* <button onClick={start}>111</button> */}
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>إضافة عضلة</DrawerHeader>
              <DrawerBody>
                <Form className="formAddedNewCategorie">
                  <Input label="اسم العضلة" onChange={(e)=>setNewCategorieName(e.target.value)} ></Input>
                <div className="buttons">
                <Button  onPress={onClose}>الغاء</Button>
                <Button color="primary"  onPress={addNewCategorie}>إضافة</Button>
               
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
