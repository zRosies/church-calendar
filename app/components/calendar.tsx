"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
  parseISO,
  startOfWeek,
  differenceInDays,
} from "date-fns";
import { pt } from "date-fns/locale/pt";
import Dialog from "./dialog";
import { FaHouseMedicalCircleCheck } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { SiLighthouse } from "react-icons/si";

import Information from "./info";
import HouseIcon from "./houseIcon";
import Accordions from "./accordions";

export interface Events {
  date: string;
  memberName: string;
  address: string;
  phone: string;
  notes: string;
}

async function getEvents() {
  const data = await fetch("/api/calendar");
  if (!data.ok) {
    throw new Error(`HTTP error! status: ${data.status}`);
  }
  const json = await data.json();
  return json;
}

const Calendar = () => {
  const date = new Date();

  const [currentMonth, setCurrentMonth] = useState(date);
  const [openDialog, setOpenDialog] = useState({
    open: false,
    date: date,
    booked: false,
  });
  const [openInfo, setOpenInfo] = useState({ open: false, date: date });
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side flag to ensure code runs only after mounting
  const [isClient, setIsClient] = useState(false);

  const months = Array.from({ length: 12 }).map((_, index) =>
    subMonths(date, 11 - index)
  );

  useEffect(() => {
    setIsClient(true); // Mark that client-side rendering is now enabled
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data[0]?.events || []);
      } catch (error) {
        setError(`Error in fetching events: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (!isClient || !events) {
    return null; // Or render a loading spinner or fallback UI
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, date: openDialog.date, booked: false });
    setOpenInfo({ open: false, date: openDialog.date });
  };

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  // Define o primeiro dia da semana como segunda-feira
  const startOfCalendar = startOfWeek(start, { weekStartsOn: 1 });
  const offset = differenceInDays(start, startOfCalendar); // Calcula o deslocamento

  console.log(events);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg flex flex-col-reverse md:flex-row justify-between mx-[10px] md:mx-[20px]">
      <div
        className="py-10 text-2xl font-extrabold px-2 flex border flex-col max-w-[700px] w-full max-h-[700px] overflow-y-scroll gap-4 shadow-md md:p-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <p className="text-[1rem] md:text-[1.2rem]"> Almoços da ala</p>

        <div className="space-y-4">
          <Accordions months={months} events={events} />
        </div>
      </div>

      <div className="w-full max-w-[1200px]">
        <div className="flex justify-between p-6 gap-2 ">
          <div className="flex gap-3">
            <button
              onClick={handlePrevMonth}
              className="md:text-2xl bg-[#264653] text-white p-2 rounded-md"
            >
              <IoIosArrowBack />
            </button>

            <button
              onClick={handleNextMonth}
              className="md:text-2xl bg-[#264653] text-white p-2 rounded-md"
            >
              <IoIosArrowForward />
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-center">
            {format(currentMonth, "MMMM yyyy", { locale: pt })}
          </h2>
        </div>

        {/* Cabeçalho com dias da semana */}
        <div className="grid grid-cols-7 bg-[#264653] text-white text-center font-semibold text-[0.6rem] md:text-[1rem]">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="py-2">
              {day}
            </div>
          ))}
        </div>
        {/* Accordion for each month */}

        {/* Renderização dos dias do mês */}
        <div className="grid grid-cols-7 gap-px bg-gray-300 w-full md:max-w-[1200px] h-full md:h-[600px]">
          {/* Espaços vazios para alinhar o primeiro dia do mês */}
          {Array.from({ length: offset }).map((_, index) => (
            <div key={index} className="bg-white"></div>
          ))}

          {days.map((day, index) => {
            return (
              <div
                key={index}
                className={`relative flex flex-col items-center justify-start p-6 bg-white border border-gray-300 transition-colors duration-200 ${
                  isToday(day) ? "bg-yellow-100" : ""
                }`}
              >
                <p className="text-[0.6rem] md:text-sm font-semibold absolute top-0 left-2">
                  {format(day, "d")}
                </p>
                <div className="absolute bottom-0 left-0 right-0">
                  {events.filter((event) =>
                    isSameDay(parseISO(event.date), day)
                  ).length > 0 ? (
                    events
                      .filter((event) => isSameDay(new Date(event.date), day))
                      .map((event, idx) => (
                        <div
                          key={idx}
                          className="flex justify-center items-center relative"
                        >
                          <div
                            className="bg-[#2A9D8F] text-white text-base rounded-lg md:px-3 md:py-1 md:mt-2 cursor-pointer hidden md:flex flex-col w-full"
                            onClick={() =>
                              setOpenDialog({
                                date: new Date(day),
                                open: true,
                                booked: true,
                              })
                            }
                          >
                            {event.memberName}
                          </div>
                          <div
                            className="relative md:hidden flex justify-center items-center  flex-col"
                            onClick={() =>
                              setOpenDialog({
                                date: new Date(day),
                                open: true,
                                booked: true,
                              })
                            }
                          >
                            <IoPersonCircleSharp className="h-7 w-7 text-[#CA6702]" />
                            <p className="text-[0.4rem]">{event.memberName}</p>
                          </div>
                          <div
                            className="absolute bg-[#0A9396] top-[-10px] left-[30px] md:top-[-70px] md:left-[100px] right-0 cursor-pointer p-1 rounded-[50%] w-5 h-5 md:h-12 md:w-12 flex justify-center items-center"
                            onClick={() =>
                              setOpenInfo({ date: new Date(day), open: true })
                            }
                          >
                            <HouseIcon />
                          </div>
                        </div>
                      ))
                  ) : (
                    <div
                      className="absolute text-[#264653] top-[-30px] md:top-[-80px] right-[12px] md:right-[60px] cursor-pointer hover:text-[#2A9D8F] duration-200 animate-pulse"
                      onClick={() =>
                        setOpenDialog({
                          date: new Date(day),
                          open: true,
                          booked: false,
                        })
                      }
                    >
                      <FaPlusCircle className="h-5 w-5 md:h-12 md:w-12 " />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {openDialog.open && (
            <Dialog
              isOpen={openDialog.open}
              onClose={handleCloseDialog}
              dayPicked={openDialog.date}
              booked={openDialog.booked}
              bookedDates={events}
            />
          )}
          {openInfo.open && (
            <Information
              isOpen={openInfo.open}
              onClose={handleCloseDialog}
              dayPicked={openInfo.date}
              bookedDates={events}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
