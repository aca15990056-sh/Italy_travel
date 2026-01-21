import ItineraryLayout from "@/components/ItineraryLayout";
import { itinerary } from "@/data/itinerary";

export default function HomePage() {
  return <ItineraryLayout days={itinerary} />;
}
