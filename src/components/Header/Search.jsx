import { useContext } from "react";
import searchIcon from "../../assets/search.svg";
import { useDebounce } from "../../hooks";
import { LocationContext } from "../../context";

export default function Search() {
  const { setSelectedLocation } = useContext(LocationContext);

  const doSearch = useDebounce((term) => {
    setSelectedLocation(term);
  }, 500);

  function handleChange(e) {
    e.preventDefault();
    const value = e.target[0].value;
    console.log(e);
    doSearch(value);
  }
  return (
    <>
      <form action="#" onSubmit={handleChange}>
        <div className="flex items-center space-x-2 py-2 px-3 group focus-within:bg-black/30 transition-all border-b border-white/50 focus-within:border-b-0 focus-within:rounded-md">
          <input
            className="bg-transparent  placeholder:text-white text-white w-full text-xs md:text-base outline-none border-none"
            type="search"
            placeholder="Search Location"
            required
          />
          <button type="submit">
            <img src={searchIcon} />
          </button>
        </div>
      </form>
    </>
  );
}
