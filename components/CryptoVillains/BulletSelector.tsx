import React, { useEffect, useState } from "react";


type BulletSelectorProps = {
    imgName: string;
    selectButton: string;
    others: string;
    onSelect: () => any;
    startSelected?: boolean;
};

export default function BulletSelector({ imgName, selectButton, others, onSelect, startSelected }: BulletSelectorProps) {
    const [selected, setSelected] = useState<boolean>(false);
    useEffect(() => {
        if (startSelected) setSelected(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === selectButton) {
                setSelected(true);
                onSelect();
            } else if (others.includes(event.key)) {
                setSelected(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectButton, selected]);
    return (
        <button onClick={() => {
            if (!selected) {
                const keyboardEvent = new KeyboardEvent("keydown", {
                    bubbles: true,
                    cancelable: true,
                    key: selectButton,
                    code: "Key" + selectButton

                });
                document.dispatchEvent(keyboardEvent);
            }
        }}
            className={`relative rounded-md w-[50px] h-[50px] bg-contain bg-no-repeat bg-center border-2  bg-gray-700 ${selected ? " border-red-600 brightness-110 " : " border-gray-900 brightness-90 "}`} style={{ backgroundImage: `url("${imgName}")` }}>
            <div className="flex justify-center items-center">
                <p className="text-bold text-xl text-black"> {selectButton} </p>
            </div>
        </button >
    );

}