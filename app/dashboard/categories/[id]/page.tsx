"use client";

import { categorie, db, exercise } from "@/app/db";
// import { categories, exercises } from "@/app/Providers/useDB";
import logo from "@/app/assets/fill.png";
import { useLoading } from "@/app/Providers/useLoading";
import {
  addToast,
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Form,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";

export default function CategoriePage({ params }) {
  const { id }: { id: string } = use(params);

  const [categorie, setCategorie] = useState<categorie>({ id: 0, title: "" });
  const [exercises, setExercises] = useState<exercise[]>([]);
  const router = useRouter();

  const [newExercise, setNewExercise] = useState({
    title: "",
    img: "",
    loading: false,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {isOpen:popIsOpen,onOpen:popOnOpen, onOpenChange :popOnOpenChange,onClose:popOnClose } = useDisclosure();

  const setLoading = useLoading();
  const [editCategorie, setEditCategorie] = useState({
    title: "",
    loading: false,
  });
  const [drawerType, setDrawerType] = useState<null | "add-exercise" | "edit-categorie">(null);

  useEffect(() => {
    setLoading(true);
    async function init() {
      const isFind = await db.categories.get(+id);
      if (isFind) {
        setCategorie(isFind);
        setExercises(
          await db.exercises.where("categorie_id").equals(+id).toArray()
        );
        setLoading(false);
      } else {
        router.push("/404")
      }
    }
    init();
  }, []);

  function addNewExercise() {
    if (newExercise.loading) {
      addToast({
        title: "يرجى الانتظار ريثما تحمل الصورة!",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    if (!newExercise.title.length) {
      addToast({
        title: "يجب كتابة شي على الاقل",
        color: "danger",
      });

      setLoading(false);
      return;
    }
    db.exercises.add({
      title: newExercise.title,
      img: newExercise.img,
      categorie_id: +id,
    }).then((e) => {
      // console.log();

      setExercises([
        ...exercises,
        {
          title: newExercise.title,
          img: newExercise.img,
          categorie_id: +id,
          id: e,
        },
      ]);

      addToast({
        title: `تم إضافة تمرين جديد "${newExercise.title}"`,
        color: "success",
      });
      onClose();
      setLoading(false);
    });

  
  }

  function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    setNewExercise({ ...newExercise, loading: true });
    const file = e.target.files?.[0];



    if (file) {
      if((file.size / 1024 / 1024) > 5) {
        addToast({
          title: `حجم الصورة يجب الا يتجاوز 5 ميقابايت`,
          color: "danger",
        });
        setNewExercise({ ...newExercise, loading: false });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewExercise({
          ...newExercise,
          img: event.target?.result as string,
          loading: false,
        });
      };
      reader.readAsDataURL(file);
    } 
  }

  function editCategorieHandler() {
    if (editCategorie.loading) {
      addToast({
        title: "يرجى الانتظار...",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    if (!editCategorie.title.length) {
      addToast({
        title: "يجب كتابة اسم العضلة",
        color: "danger",
      });
      setLoading(false);
      return;
    }

    db.categories.update(categorie.id, {
      title: editCategorie.title,
    }).then(() => {
      setCategorie({ ...categorie, title: editCategorie.title });
      addToast({
        title: `تم تعديل اسم العضلة بنجاح "${editCategorie.title}"`,
        color: "success",
      });
      onClose();
      setLoading(false);
    });
  }

  function removeCategorie() {
   
    // addToast({
    //   title : "هل انت متأكد من حذف العضلة؟",
    //   color : "danger",
    //   endContent : <Button color="danger" onPress={() => {
    //     console.log(ref);

    //   }}>نعم حذف</Button>,
    //   promise: new Promise(((res,reg)=> {
    //     setTimeout(() => {
    //       res(true);
    //     }, 2000);
    //   })),
      
    // })
    setLoading(true);
    db.categories.delete(categorie.id).then(() => {
     
      addToast({
        title: `تم حذف العضلة بنجاح"`,
        color: "success",
      });

      popOnClose();
      
      router.push("/dashboard/categories");
      setLoading(false);
    });
   
  }

  return (
    <div className="CategoriePage">
      <div className="header">
        <h1>{categorie.title}   <Chip className="editBtn" size="sm" onClick={() => {
          setEditCategorie({ title: categorie.title, loading: false });
          setDrawerType("edit-categorie");
          onOpen();
        }} >تعديل</Chip></h1>
        <Button onPress={() => { setDrawerType("add-exercise"); onOpen(); }} color="primary">
          إضافة تمرين
        </Button>
      </div>
      <div className="content">
        <div className="categories">
          {exercises.map((e, i) => {
            return (
              <Link href={`/dashboard/exercises/${e.id}`} key={i}>
                <Image
                  alt="img"
                  src={e.img || logo}
                  width={100}
                  height={100}
                  unoptimized></Image>
                <h3>{e.title}</h3>
              </Link>
              // <div >

              // </div>
            );
          })}
        </div>
        {/* <button onClick={start}>111</button> */}
      </div>
      {/* Drawer لإضافة تمرين */}
      <Drawer isOpen={isOpen && drawerType === "add-exercise"} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>إضافة تمرين</DrawerHeader>
              <DrawerBody>
                <Form className="formAddedNewCategorie">
                  <Input
                    label="اسم التمرين"
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, title: e.target.value })
                    }></Input>
                  <Button
                    isLoading={newExercise.loading}
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
                  {newExercise.img && (
                    <div className="img-view">
                      <Image
                        alt="img"
                        src={newExercise.img}
                        width={100}
                        height={100}
                        unoptimized></Image>
                      <Button
                        variant="bordered"
                        color="danger"
                        onPress={() =>
                          setNewExercise({ ...newExercise, img: "" })
                        }>
                        حذف
                      </Button>
                    </div>
                  )}

                  <div className="buttons">
                    <Button onPress={onClose}>الغاء</Button>
                    <Button color="primary" onPress={addNewExercise}>
                      إضافة
                    </Button>
                  </div>
                </Form>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      {/* Drawer لتعديل الفئة */}
      <Drawer isOpen={isOpen && drawerType === "edit-categorie"} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>تعديل الفئة</DrawerHeader>
              <DrawerBody>
                <Form className="formEditCategorie">
                  <Input
                    label="اسم العضلة"
                    value={editCategorie.title}
                    onChange={(e) =>
                      setEditCategorie({ ...editCategorie, title: e.target.value })
                    }
                  />
                  <div className="buttons">
                    <Button onPress={onClose}>الغاء</Button>
                    <Button color="primary" onPress={editCategorieHandler}>
                      تعديل
                    </Button>
                  </div>
                  <Button
                        variant="bordered"
                        color="danger"
                        onPress={popOnOpen}>
                        حذف العضلة
                      </Button>
                </Form>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <Modal backdrop="blur" isOpen={popIsOpen} onClose={popOnClose} onOpenChange={popOnOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">حذف العضلة</ModalHeader>
              <ModalBody>
                <p>هل انت متاكد من رغبتك بحذف العضلة؟</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  الغاء
                </Button>
                <Button color="danger" onPress={removeCategorie}>
                 حذف
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
