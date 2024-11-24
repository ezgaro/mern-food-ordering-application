import { useSearchRestaurants } from "@/api/RestaurantApi";
import SearchResultInfo from "@/components/SearchResultInfo";
import SearchResultsCard from "@/components/SearchResultsCard";
import { useParams } from "react-router-dom";

export default function SearchPage() {
  const { city } = useParams();
  const { results, isLoading } = useSearchRestaurants(city);

  if (!results?.data || !city) {
    return <span>No results found...</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cusines-list">insert cusines list here</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultsCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
