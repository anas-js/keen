"use client";
import { Image } from "@heroui/react";
// import Image from "next/image";
import Link from "next/link";
// import logo from "@/app/assets/fill.svg";
import { usePathname } from "next/navigation";

export default function SideMenu() {

    const path = usePathname();

    return (
        <div className="side-mune">
            <div className="logo"><Image alt="logo" src="/images/fill.svg"></Image></div>
            <div className="list">
                <ul>
                    <li className={path == "/dashboard" ? 'active' : ""}>
                        <Link href="/dashboard">لوحة التحكم</Link>
                    </li>
                  
                    <li className={path.startsWith("/dashboard/categories") ? 'active' : ""}>
                        <Link href="/dashboard/categories">العضلات</Link>
                    </li>
                    <li className={path.startsWith("/dashboard/about") ? 'active' : ""}>
                        <Link href="/dashboard/about">حول</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
