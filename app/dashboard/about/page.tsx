"use client";
// import logo from "@/app/assets/fill.svg";
import { Chip, Image } from "@heroui/react";

export default function aboutPage() {
  return (
    <div className="aboutPage">
      <div className="header">
        <Image alt="keen" src="/images/fill.svg"></Image>
        <h1>
          حول{" "}
          <Chip color="primary" variant="bordered">
            v0.1.0
          </Chip>
        </h1>
      </div>
      <div className="content">
        <br />
        الاصدار التجريبي.
        <br />
        تم استخدام خط MiSans fonts في هذا الموقع.
        <br />
        شكر خاص ل
        <a href="/lic.json" target="_blank">
          لمكتبات المفتوحة المصدر
        </a>
        .
        <br />  <br />
        <a href="https://www.linkedin.com/in/anas-alanzi/" target="_blank">
          المطور أنس العنزي 🇸🇦
        </a>
      </div>
    </div>
  );
}
