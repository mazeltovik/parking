import { useState, useMemo } from 'react';
import useFetch from '~/hooks/useFetch';
import type { Route } from './+types/parkingSpot';
import { Calendar } from '~/components/ui/calendar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Check, Plus, LoaderIcon } from 'lucide-react';
import { paths } from '~/constants/paths';

type Reservation = {
  id: string;
  parkingSpotId: string;
  reservedDate: string;
  reservedTime: string;
};

type AvailableTimes = {
  name: string;
  location: string;
  reservations: Reservation[];
};

type Response = {
  message: string;
  statusCode: number;
};

export default function ParkingSpot({ params }: Route.ComponentProps) {
  const accessToken = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [filteredReservation, setFilteredReservation] = useState<Reservation[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectTimeSpot, setSelectTimeSpot] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const { data, isLoading, refetch, setRefetch } = useFetch<AvailableTimes>(
    `http://localhost:3000/parking-spots/availableTimes/${params.id}`
  );
  const { reservations = [], location = '', name = '' } = data || {};
  const timeSpots = useMemo(() => {
    function getTimeInterval() {
      const slots: string[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const start = `${String(hour).padStart(2, '0')}.00`;
        const end = `${String(hour + 1).padStart(2, '0')}.00`;
        slots.push(`${start}-${end}`);
      }
      return slots;
    }
    return getTimeInterval();
  }, []);

  const isDateDisabled = (day: Date) => {
    const allowedDates = (() => {
      const dates = [];
      for (let i = 1; i <= 15; i++) {
        dates.push(new Date(2025, 4, i));
      }
      return dates;
    })();
    const currentDay = String(day.getDate()).padStart(2, '0');
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const year = day.getFullYear();
    const formattedDate = `${currentDay}.${month}.${year}`;
    const filterDateByDay = reservations?.filter(
      (reservation) => reservation.reservedDate == formattedDate
    ) as Reservation[];
    return !allowedDates.some(
      (allowedDate) =>
        day.toDateString() === allowedDate.toDateString() &&
        filterDateByDay?.length < 24
    );
  };

  const onSubmit = async () => {
    if (selectTimeSpot) {
      setIsBooking(true);
      try {
        const res = await fetch(`${paths.localhost}${paths.reservations}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            userId: id,
            parkingSpotId: params.id,
            reservedDate: formattedDate,
            reservedTime: selectTimeSpot,
            status: 'booked',
          }),
        });
        if (res.ok) {
          const { message } = (await res.json()) as Response;

          alert(message);
        } else {
          throw new Error(res.statusText);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        alert(msg);
      } finally {
        setIsBooking(false);
        setSelectTimeSpot('');
        setIsDialogOpen(!isDialogOpen);
        setRefetch(!refetch);
      }
    }
  };
  return (
    <div className="container mx-auto py-8 min-h-screen bg-gray-100">
      <div className="flex items-center justify-center">
        {isLoading && (
          <div
            className="flex justify-center items-center"
            style={{
              maxHeight: '50vh',
              minHeight: '200px',
            }}
          >
            <LoaderIcon className="animate-spin" size={32} />
          </div>
        )}
        {!isLoading && data && (
          <div>
            <p className="text-3xl font-bold mb-6 ml-2">{`Парковочное место: ${name}`}</p>
            <p className="text-3xl mb-6 ml-2">{`Адрес: ${location}`}</p>
            <Calendar
              mode="single"
              selected={date}
              disabled={isDateDisabled}
              onSelect={(day) => {
                const selectedDay = day ? day : date;
                if (selectedDay) {
                  const currentDay = String(selectedDay.getDate()).padStart(
                    2,
                    '0'
                  );
                  const month = String(selectedDay.getMonth() + 1).padStart(
                    2,
                    '0'
                  );
                  const year = selectedDay.getFullYear();
                  const formattedDate = `${currentDay}.${month}.${year}`;
                  const filteredReservations = reservations.filter(
                    (reservation) => {
                      return reservation.reservedDate == formattedDate;
                    }
                  );
                  setFilteredReservation(filteredReservations);
                  setFormattedDate(formattedDate);
                  setDate(day);
                }
                setIsDialogOpen(true);
              }}
              className="rounded-md border"
            />
          </div>
        )}
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setIsDialogOpen(!isDialogOpen);
          setSelectTimeSpot('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Доступные слоты на ${formattedDate}`}</DialogTitle>
          </DialogHeader>
          {data && (
            <div
              className="flex flex-col gap-4 border rounded-lg px-2 py-2 overflow-y-auto"
              style={{
                maxHeight: '50vh',
                minHeight: '200px',
              }}
            >
              {timeSpots.map((spot) => {
                const reservedTimes = filteredReservation.map(
                  (reservation) => reservation.reservedTime
                );
                return reservedTimes.includes(spot) ? (
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <Plus
                        color="#ed050c"
                        className={`transition-transform ${'rotate-45'}`}
                      />
                      <p>{`${spot} (занято)`}</p>
                    </div>
                    <div>
                      <Button disabled className="cursor-pointer">
                        Выбрать
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center ">
                    <div className="flex">
                      <Check color="#05ed0c" />
                      <p>{`${spot}`}</p>
                    </div>
                    <div>
                      <Button
                        onClick={() => setSelectTimeSpot(spot)}
                        className="cursor-pointer"
                      >
                        Выбрать
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className=" flex flex-col">
            <p>{`Выбрано:${selectTimeSpot}`}</p>
            <Button
              disabled={isBooking ? true : false}
              onClick={onSubmit}
              className="cursor-pointer"
            >
              Выбрать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
