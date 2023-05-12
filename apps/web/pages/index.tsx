import React from 'react';
import SideBar from '../components/SideBar';
import SearchBar from '../components/SearchBar';
import HomeScreen from '../components/homescreen';

export function Index() {
  const handleSearch = (searchValue: string) => {
    console.log("Searching for:", searchValue);
  };

  return (
    <div>
      <SideBar />
      <SearchBar onSearch={handleSearch} />
      <HomeScreen />
    </div>
  );
}

export default Index;