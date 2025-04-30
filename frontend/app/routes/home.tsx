import type { Route } from './+types/home';
import { Parking } from '../parking/parkingPage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New Parking React Router App' },
    { name: 'description', content: 'Welcome to Parking App!' },
  ];
}

export default function Home() {
  return <Parking />;
}
