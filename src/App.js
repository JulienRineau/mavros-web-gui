import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <Header />
      <Container className="px-lg-5 px-2">
        <Body />
      </Container>

      <Footer />
    </div>
  );
}

export default App;
