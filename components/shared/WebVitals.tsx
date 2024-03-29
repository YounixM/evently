"use client";

import { useReportWebVitals } from "next/web-vitals";
import { metrics } from "@opentelemetry/api";

export function WebVitals() {
  const meter = metrics.getMeter("web-vitals", "v0.1.0");
  console.log(meter);
  const ttfb = meter.createHistogram("TTFB");
  const fcp = meter.createHistogram("FCP");
  const lcp = meter.createHistogram("LCP");
  const fid = meter.createHistogram("FID");
  const cls = meter.createHistogram("CLS");
  const inp = meter.createHistogram("INP");
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case "TTFB": {
        console.log("ttfb", metric.value);
        ttfb.record(metric.value.toString());
      }
      case "FCP": {
        console.log("fcp", metric.value);
        fcp.record(metric.value.toString());
      }
      case "LCP": {
        console.log("lcp", metric.value);
        lcp.record(metric.value.toString());
      }
      case "FID": {
        fid.record(metric.value.toString());
      }
      case "CLS": {
        cls.record(metric.value.toString());
      }
      case "INP": {
        inp.record(metric.value.toString());
      }
    }
  });
}
