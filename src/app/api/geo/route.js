import { NextResponse } from "next/server";

export async function GET(request) {

    let fallback = false;

    try {
        const { searchParams } = new URL(request.url);
        
        const query = searchParams.get('searchParams'); 
        
        console.log("using IP-API Fetching data for:", query);
        
        const res = await fetch(`http://ip-api.com/json/${query || ""}`)
        const data = await res.json();

        if (data.status !== "success") throw new Error();

        return NextResponse.json(formatData(data, fallback, query));

    } catch {
        
        fallback = true;
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('searchParams'); 
        
        console.log("using Whois Fetching data for:", query);

        const res = await fetch(`https://ipwhois.app/json/${query || ""}`)
        const data = await res.json();

        if (data.success !== true) return NextResponse.json({error: data.message}, {status: 400});

        return NextResponse.json(formatData(data, fallback, query));

    }
};

function formatData(d, fallback, query) {
    
    if(fallback !== true){
        return {
        query: d.query,
        country: d.country,
        countryCode: d.countryCode,
        region: d.region,
        city: d.city,
        zip: d.zip,
        lat: d.lat,
        lon: d.lon,
        isp: d.isp,
        timezone: d.timezone,
    }   
    } else {
        return {
            query: query,
            country: d.country,
            countryCode: d.country_code,
            region: d.region,
            city: d.city,
            zip: d.zip,
            lat: d.latitude,
            lon: d.longitude,
            isp: d.isp,
            timezone: d.timezone,
        }
    };
};
