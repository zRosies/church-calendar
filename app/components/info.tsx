"use client";
import React, { useMemo } from "react";
import { Events } from "./calendar";
import { format, isSameDay, parseISO } from "date-fns";

interface ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  dayPicked: Date;
  bookedDates: Events[];
  //   onSave: (title: string) => void;
}

const Information: React.FC<ModalProps> = ({
  isOpen,
  bookedDates,
  onClose,
  dayPicked,
}) => {
  const bookedData: Events | undefined = useMemo(() => {
    const bookedInfo = bookedDates.find((element) => {
      console.log(JSON.stringify(element) === undefined);
      // return element.date == `${dayPicked}`;
      return isSameDay(parseISO(element.date), dayPicked);
    });

    return bookedInfo;
  }, [isOpen]);

  const { date, memberName, address, phone, notes } = bookedData as Events;
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        onClick={() => onClose(false)}
      />
      <div className="bg-white rounded-lg shadow-lg p-6 mx-auto absolute w-full  max-w-[500px] z-[100] top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-open">
        <h3 className="font-bold my-2">Informações do Almoço</h3>
        <div className="flex gap-2 flex-col">
          <p>Nome: {memberName}</p>
          <p>Data: {format(date, "dd/MM/yyyy")}</p>
          <p>Endereço: {address}</p>
          <p>Telefone: {phone}</p>
          <p>Notas: {notes}</p>
        </div>
      </div>
    </>
  );
};

export default Information;
