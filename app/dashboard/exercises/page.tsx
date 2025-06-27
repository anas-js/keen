"use client";


import { db, exercise } from "@/app/db";
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
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, } from "react";

export default function ExercisesPage() {
 

 
  const [exercises, setExercises] = useState<exercise[]>([]);
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();


  const setLoading = useLoading(); 
  // const [loadingNewCategorie, setLoadingNewCategorie] = useState();

  useEffect(() => {
   async function init() {
      setExercises(await db.exercises.toArray());
    }
    init();
  }, []);



  return (
    <div className="CategoriePage">
      <div className="header">
        <h1>جميع التمارين</h1>

      </div>
      <div className="content">
        <div className="categories">
        {exercises.map((e, i) => {
            return (
              <Link href={`/dashboard/exercises/${e.id}`} key={i}>
                <Image alt="img" src={e.img} width={100} height={100} unoptimized></Image>
                <h3>{e.title}</h3>
              </Link>
              // <div >
              
              // </div>
            );
          })}
        </div>
     
      </div>
    </div>
  );
}
