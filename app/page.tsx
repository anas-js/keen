"use client";

import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useApp } from "./Providers/useApp";
import logo from "@/app/assets/fill.svg";
import Image from "next/image";
import { db } from "./db";
import dateHelper from "./helpers/dateHelper";

export default function App() {
  const [name, setName] = useState("");
  const router = useRouter();
  // const app = useApp();

 async function startApp(e) {
    e.preventDefault();
    // console.log(1);
    // localStorage.setItem("name", name);

    db.settings.update(1,{
      name : name,
      dateInit : dateHelper()
    });

    router.push("/dashboard");
  }
  return (
    <div className="indexPage">
      {/* <h1>Keen</h1> */}
      <Card className="main-card">
        <CardHeader>
          {/* <h1 className="header">Keen</h1> */}
          <Image className="logo" alt="logo" src={logo}></Image>
        </CardHeader>
        <CardBody>
          <div className="form">
            <p>المكان اللي تسجل في تطورك العضلي</p>
            <Form onSubmit={startApp}>
              <Input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="أنس"
                label="اسمك"></Input>
              <Button type="submit" color="primary">
                ابدا
              </Button>
            </Form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
