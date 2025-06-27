
import { Spinner } from "@heroui/react";
export default function Loading({full = false} : {full?:boolean}) {
    return (
        <div className={`loading ${full && 'full'}`}>
             <Spinner></Spinner>
        </div>
    );
}