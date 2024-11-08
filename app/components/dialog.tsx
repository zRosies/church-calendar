"use client";
import React, { useMemo, useState } from "react";
import { Events } from "./calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { LuLoader2 } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  dayPicked: Date;
  booked: boolean;
  bookedDates: Events[];
  //   onSave: (title: string) => void;
}

const Dialog: React.FC<ModalProps> = ({
  isOpen,
  bookedDates,
  onClose,
  dayPicked,
  booked,
}) => {
  const [isloading, setIsloading] = useState(false);

  const bookedData: Events | undefined = useMemo(() => {
    const bookedInfo = bookedDates.find((element) => {
      console.log(JSON.stringify(element) === undefined);
      // return element.date == `${dayPicked}`;
      return isSameDay(parseISO(element.date), dayPicked);
    });
    console.log();

    return bookedInfo;
  }, [isOpen]);

  if (!isOpen) return null;

  async function BookLunch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsloading(true);

    if (isloading) {
      return;
    }

    const form = e.currentTarget;

    const body = {
      date: dayPicked,
      memberName: (form.elements.namedItem("member") as HTMLInputElement)
        ?.value,
      address: (form.elements.namedItem("address") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement)?.value,
    };

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to book lunch");
      }
      setIsloading(false);
      onClose(false);
      window.location.reload();
    } catch (error) {
      console.error("Error booking lunch:", error);
    }
  }

  async function CancelLunch(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isloading) {
      return;
    }
    setIsloading(true);

    const date = bookedData?.date || null;
    const response = await fetch(`/api/calendar/${date}`, {
      method: "DELETE",
    });

    console.log(await response.json());

    if (response.status != 200) {
      throw new Error("Failed to cancel lunch");
    }

    setIsloading(false);
    window.location.reload();
  }

  async function UpdateAppointment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsloading(true);

    const form = e.currentTarget;

    if (isloading) {
      return;
    }

    const body = {
      date: dayPicked,
      memberName: (form.elements.namedItem("member") as HTMLInputElement)
        ?.value,
      address: (form.elements.namedItem("address") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement)?.value,
    };

    const response = await fetch(`/api/calendar/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
      }),
    });

    console.log(await response.json());

    if (response.status != 200) {
      throw new Error("Failed to cancel lunch");
    }

    setIsloading(false);
    window.location.reload();
  }

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        onClick={() => onClose(false)}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 absolute w-full max-w-[500px] z-[100] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-open">
        {booked ? (
          <div className="flex gap-4 flex-col my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold ">
                Almoço já agendado para {format(dayPicked, "dd/MM/yyyy")}
              </h3>
              <span
                className=" rounded-md cursor-pointer"
                onClick={() => onClose(false)}
              >
                <IoCloseCircle className="h-7 w-7 text-[#264653]" />
              </span>
            </div>
            <h3>Deseja fazer alguma anteração?</h3>
          </div>
        ) : (
          <h2 className="text-xl font-semibold my-6">Marcar almoço</h2>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={booked ? UpdateAppointment : BookLunch}
        >
          <input
            type="text"
            id="member"
            placeholder="Nome do Membro"
            defaultValue={bookedData && bookedData.memberName}
            required
            className="border border-gray-200 p-3 rounded-md w-full"
          />
          <input
            type="phone"
            id="phone"
            placeholder="Telefone"
            defaultValue={bookedData && bookedData.phone}
            required
            className="border border-gray-200 p-3 rounded-md w-full"
          />
          <input
            type="address"
            id="address"
            placeholder="Endereço"
            defaultValue={bookedData && bookedData.address}
            required
            className="border border-gray-200 p-3 rounded-md w-full"
          />
          <textarea
            placeholder="Notas: (Quer deixar um recado?)"
            id="notes"
            required
            defaultValue={bookedData && bookedData.notes}
            className="border border-gray-200 p-3 rounded-md w-full"
          />
          <div className="flex gap-4">
            <button
              onClick={(e) => CancelLunch(e)}
              className=" w-full text-red-500 border-2 border-red-300 p-3 rounded-md flex justify-center items-center group gap-2 hover:bg-red-600 hover:text-white duration-200"
            >
              <span>Cancelar</span>
              <FaTrashAlt className="text-red-500 group-hover:text-white" />
              {isloading && (
                <LuLoader2 className="text-white animate-loading" />
              )}
            </button>
            {booked ? (
              <button
                type="submit"
                className="bg-[#264653] text-white p-3 rounded-md w-full flex justify-center gap-2 items-center"
              >
                Alterar
                {isloading && (
                  <LuLoader2 className="text-white animate-loading" />
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#264653] text-white p-3 rounded-md w-full flex justify-center items-center gap-2"
              >
                Adicionar
                {isloading && (
                  <LuLoader2 className="text-white animate-loading" />
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Dialog;
