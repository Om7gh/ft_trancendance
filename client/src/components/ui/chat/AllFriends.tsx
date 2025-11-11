import SearchBar from "../friends/SearchBar";

export default function AllFriends() {
  return (
    <div className="h-[80vh] overflow-scroll bg-slate-900/40 p-3 rounded-xl shadow-sm shadow-slate-700/50">
      <SearchBar />
    </div>
  );
}
