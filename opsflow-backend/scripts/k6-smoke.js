import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s"
};

const baseUrl = __ENV.BASE_URL || "http://localhost:8000";

export default function () {
  const res = http.get(`${baseUrl}/health`);
  check(res, {
    "health ok": (r) => r.status === 200
  });
  sleep(1);
}
