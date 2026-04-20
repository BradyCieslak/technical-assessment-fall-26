import Hero from "./components/Hero";
import ResultsTable from "./components/ResultsTable";
import Drivers from "./components/Drivers";
import SeasonChart from "./components/SeasonChart";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-merc-black">
      <Hero />
      <ResultsTable />
      <Drivers />
      <SeasonChart />
      <Footer />
    </div>
  );
}