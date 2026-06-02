import { useState, useContext, createContext } from 'react';
import axios from 'axios';

const SearchContext = createContext();


const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState({
        keyword: "",
        results: []
    });


    return (
        <SearchContext.Provider value={[search, setSearch]}>
            {children}
        </SearchContext.Provider>
    );
}

//custom hook
const useSearch = () => useContext(SearchContext);

export { SearchProvider, useSearch };