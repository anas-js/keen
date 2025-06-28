"use client";
// import logo from "@/app/assets/fill.svg";
// import { Chip, Image } from "@heroui/react";

export default function MobilePage() {
  return (
    <div className="mobilePage">
      <div className="header">
        <h1>التطبيق</h1>
      </div>
      <div className="content">
        <p>
          هذا الموقع يدعم تقنية PWA، لذا يمكنك إضافته إلى الشاشة الرئيسية
          واستخدامه كتطبيق حتى بدون اتصال بالإنترنت.
        </p>

        <br />
        <br />

        <h2>📱 طريقة الإضافة حسب نوع جهازك:</h2>
 <br />
        <div className="android">
          <h3>🔹 إذا كنت تستخدم <strong>جهاز Android</strong>:</h3>
          <ol>
            <li>افتح الموقع باستخدام متصفح <strong>Chrome</strong>.</li>
            <li>اضغط على زر القائمة <strong>(⋮)</strong> في أعلى يمين الشاشة.</li>
            <li>اختر <strong>إضافة إلى الشاشة الرئيسية</strong>.</li>
            <li>ثم اضغط <strong>إضافة</strong>.</li>
          </ol>
        </div>
        <br />
        <div className="ios">
          <h3>🔹 إذا كنت تستخدم <strong>جهاز iPhone</strong>:</h3>
          <ol>
            <li>افتح الموقع باستخدام متصفح <strong>Safari</strong>.</li>
            <li>اضغط على زر <strong>المشاركة</strong> <span>🔗</span> في أسفل الشاشة.</li>
            <li>اختر <strong>إضافة إلى الشاشة الرئيسية</strong> (Add to Home Screen).</li>
            <li>ثم اضغط <strong>إضافة</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
