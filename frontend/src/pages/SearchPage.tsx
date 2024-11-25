import { useSearchRestaurants } from "@/api/RestaurantApi";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultInfo from "@/components/SearchResultInfo";
import SearchResultsCard from "@/components/SearchResultsCard";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
  searchQuery: string;
  page: number;
};

export default function SearchPage() {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
  });
  const { results, isLoading } = useSearchRestaurants(searchState, city);
  function setPage(page: number) {
    setSearchState(() => ({ ...searchState, page }));
  }
  function setSearchQuery(searchFormData: SearchForm) {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  }
  function resetSearch() {
    setSearchState((prevState) => ({ ...prevState, searchQuery: "", page: 1 }));
  }

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
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeHolder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultsCard key={restaurant._id} restaurant={restaurant} />
        ))}
        <PaginationSelector
          pages={results.pagination.pages}
          page={results.pagination.page}
          onPageChange={setPage}
        ></PaginationSelector>
      </div>
    </div>
  );
}
