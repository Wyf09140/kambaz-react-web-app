import { Link, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

export default function TOC() {
  const location = useLocation(); // 获取当前路径
  const path = location.pathname;

  return (
    <Nav variant="pills">
      <Nav.Item>
        <Nav.Link as={Link} to="/Labs" active={path === "/Labs"}>
          Labs
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/Labs/Lab1" active={path === "/Labs/Lab1"}>
          Lab 1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/Labs/Lab2" active={path === "/Labs/Lab2"}>
          Lab 2
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/Labs/Lab3" active={path === "/Labs/Lab3"}>
          Lab 3
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/Kambaz" active={path === "/Kambaz"}>
          Kambaz
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://github.com/Wyf09140">My GitHub</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
