import { format, isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { useState } from "react";
import { Events } from "./calendar";

export default function Accordions({
  months,
  events,
}: {
  months: Date[];
  events: Events[];
}) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleAccordionToggle = (index: number) => {
    // Toggle accordion open/close
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const groupEventsByMonth = () => {
    const grouped: any = {};

    events.forEach((event) => {
      const eventDate: any = parseISO(event.date);
      const monthKey: any = format(eventDate, "MMMM yyyy", { locale: pt });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(event);
    });

    return grouped;
  };

  const today = new Date();

  const groupedEvents = groupEventsByMonth();
  return (
    <div className="flex flex-col gap-2">
      {months.toReversed().map((month, index) => {
        const monthLabel = format(month, "MMMM yyyy", { locale: pt });
        const isOpen = openAccordion === index;

        // Get events for the specific month
        const monthEvents: Events[] = groupedEvents[monthLabel] || []; // Fetch events for this month

        return (
          <div key={index}>
            <button
              onClick={() => handleAccordionToggle(index)}
              className="w-full text-left p-2 md:p-4 bg-[#264653] text-white text-[0.9rem] font-bold rounded-md flex justify-between items-center"
            >
              <span>{monthLabel}</span>
              <span>{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen && (
              <div className="p-4 flex flex-col gap-4">
                {/* Render events for the current month */}
                {monthEvents.length > 0 ? (
                  monthEvents
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`p-2 border-b border-gray-300 font-normal flex flex-col gap-2 text-[0.9rem] md:text-[1.2rem]  rounded-md ${
                          isSameDay(new Date(event.date), today)
                            ? "bg-yellow-100"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between">
                          {" "}
                          <p className="font-bold">
                            Membro(a): {event.memberName}
                          </p>{" "}
                          <p className="font-bold">
                            Data: {format(event.date, "dd/MM/yy")}
                          </p>{" "}
                        </div>
                        <p>Endereço: {event.address}</p>
                        <p>Telefone: {event.phone}</p>
                        <p>Observação: {event.notes}</p>
                      </div>
                    ))
                ) : (
                  <p className="font-normal text-[1rem]">
                    {" "}
                    Nenhum almoço marcado para este mês ainda.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
