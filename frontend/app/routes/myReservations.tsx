import useFetch from '~/hooks/useFetch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '~/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import type { Route } from './+types/home';
import { paths } from '~/constants/paths';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'My Reservations' },
    { name: 'description', content: 'Welcome to my Reservations!' },
  ];
}

type Reservation = {
  id: string;
  parkingSpotId: string;
  reservedDate: string;
  reservedTime: string;
  status: string;
  parkingSpot: {
    name: string;
    location: string;
  };
};

type Response = {
  message: string;
  statusCode: number;
};

export default function MyReservations() {
  const accessToken = localStorage.getItem('accessToken');
  const id = localStorage.getItem('id');
  const { data, isLoading, refetch, setRefetch } = useFetch<Reservation[]>(
    `${paths.localhost}${paths.reservations}/${id}`
  );
  const handleCancelClick = async (id: string) => {
    try {
      const res = await fetch(`${paths.localhost}${paths.reservations}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        alert('Бронирование отменено');
      } else {
        throw new Error(res.statusText);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(msg);
    } finally {
      setRefetch(!refetch);
    }
  };

  return (
    <div className="container mx-auto py-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 ml-2">
        История вашего бронирования
      </h1>
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
        <div className="border rounded-lg p-6 shadow-sm mx-8">
          <Table>
            <TableCaption>Current parking status</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Парковочное место</TableHead>
                <TableHead>Улица</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  // onClick={() => handleRowClick(item.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>{item.parkingSpot.name}</TableCell>
                  <TableCell>{item.parkingSpot.location}</TableCell>
                  <TableCell>{item.reservedDate}</TableCell>
                  <TableCell>{item.reservedTime}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button
                      className="cursor-pointer hover:bg-red-800"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelClick(item.id)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
