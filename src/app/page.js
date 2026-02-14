"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false
});

const SearchContext = createContext();

export default function Home() {

  const [geoData, setGeoData] = useState(null);
  const [searchParams, setSearchParams] = useState("");

  const fetchIpData = async () => {
    try {
      const res = await fetch(`/api/geo?searchParams=${searchParams}`);
      const data = await res.json();
      setGeoData(data);
    } catch (error) {
      console.error("Failed to fetch IP data", error);
    }
  };

  useEffect(() => {
    fetchIpData(); 
  }, [searchParams]);

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams }}>
    <div className="h-screen flex items-start justify-center">
      <div className=" flex flex-col w-full h-full min-w-[365px] max-w-[1920px] ">
        <Header geoData={geoData} />
        <div className="flex-1 w-full relative z-0">
          <MapComponent lat={geoData?.lat} lon={geoData?.lon} location={geoData?.city + ", " + geoData?.region} />
        </div>
      </div>
    </div>
    </SearchContext.Provider>
  );
}


function Header({ geoData }) {
  return (
    <header className="relative z-50 bg-[url('/images/pattern-bg-mobile.png')] md:bg-[url('/images/pattern-bg-desktop.png')] bg-no-repeat bg-cover pb-36">
      <div className="flex flex-col justify-between items-center gap-6 pb-20 md:pb-0 mt-[-20px] md:mt-0 md:pt-3">
        <div className="relative top-12 md:top-5 text-2xl md:text-3xl font-bold text-white ">IP Address Tracker</div>
        <Searchbar />
        <InfoCard geoData={geoData} />
      </div>
    </header>
  );
}

function Searchbar() {

  const { setSearchParams } = useContext(SearchContext);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(e.target[0].value);
  };
  return (
    <form onSubmit={handleSearch} className="relative top-12 md:top-6 flex md:w-[35%] max-w-xl">
      <input className="w-full rounded-l-xl p-3 pl-5 bg-white placeholder:text-gray-light placeholder:text-sm placeholder:md:text-base" type="text" placeholder="Search for any IP address or domain" />
      <button className="flex items-center justify-center rounded-r-xl p-4 bg-black" type="submit">
        <img src="/images/icon-arrow.svg" alt="Search" className="w-fit h-fit" />
      </button>
    </form>
  );
}

function InfoCard({ geoData }) {
  const infoItems = [
    { label: "IP ADDRESS", value: geoData?.query || "-" },
    { label: "LOCATION", value: geoData?.city ? `${geoData?.city}, ${geoData?.region} ${geoData?.zip}` : "-" },
    { label: "TIMEZONE", value: geoData?.timezone ? `UTC ${geoData?.timezone}` : "-" },
    { label: "ISP", value: geoData?.isp || "-" },
  ];

  return (
    <div className="absolute top-38 md:top-46 w-[85%] md:w-[80%] bg-white rounded-xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 text-center md:text-left md:divide-y-0 md:divide-x md:divide-gray-200">
        {infoItems.map((item, index) => (
          <div key={index} className="px-4 pt-2 md:pt-0">
            <h2 className="text-[10px] md:text-xs font-rubik-bold font-bold text-gray-light tracking-widest mb-2">{item.label}</h2>
            <p className="text-base md:text-2xl font-rubik-bold font-bold text-gray-dark break-words">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}