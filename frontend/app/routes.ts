import { type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    index("routes/auth.tsx"),
    layout("./home/layout.tsx", [
        route("home","routes/home.tsx"),
        route("reservations", "routes/myReservations.tsx"),
        route("parkingSpot/:id","routes/parkingSpot.tsx")
      ]),
    
] satisfies RouteConfig;
