import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function Signin() {
  return (
    <div className="container mt-4" id="wd-signin-screen">
      <h4 className="mb-3">Signin</h4>
      <Form>
        <Form.Group className="mb-2" controlId="wd-username">
          <Form.Control type="text" placeholder="username" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="wd-password">
          <Form.Control type="password" placeholder="password" />
        </Form.Group>

        <Link to="/Kambaz/Account/Profile" id="wd-signin-btn">
          <Button className="w-100 mb-2" variant="primary">Signin</Button>
        </Link>

        <div>
          <Link to="/Kambaz/Account/Signup" id="wd-signup-link">
            Signup
          </Link>
        </div>
      </Form>
    </div>
  );
}