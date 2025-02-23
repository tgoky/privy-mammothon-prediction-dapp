import React, { useEffect, useRef } from "react";

const TradingViewChart = ({ tradingPair }: { tradingPair: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing content before adding a new script
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `BINANCE:${tradingPair}`,
      width: "100%",
      height: 160,
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "#8436b1",
      underLineColor: "rgba(134, 25, 181, 0.2)",
      isTransparent: false,
      autosize: true,
    });

    //updated

    containerRef.current.appendChild(script);
  }, [tradingPair]);

  return <div ref={containerRef} className="tradingview-widget-container" />;
};

export default TradingViewChart;
